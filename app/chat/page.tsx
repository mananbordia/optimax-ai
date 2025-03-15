"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Send, Bot, User, Clock, DollarSign, Blocks } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { useAccount, useBalance } from "wagmi";
import {
  getPromptFee,
  getPromptFeeInEther,
  useSendPromptFee,
} from "@/lib/transaction-utils";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import useChat from "@/hooks/use-chat";
import usePool from "@/hooks/use-pool";

export default function ChatPage() {
  const {
    messages,
    sendMessage,
    fetchMessages,
    isFetching,
    isSending,
    input,
    handleInputChange,
  } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });
  const { sendPromptFee, isPending } = useSendPromptFee();

  const isBalanceSufficient = useMemo(
    () => (balanceData ? balanceData.value >= getPromptFeeInEther() : false),
    [balanceData]
  );

  useEffect(() => {
    fetchMessages();
  }, []);

  // Pool amount state
  const { poolAmount, fetchPoolAmount, isFetching: isFetchingPool } = usePool();

  useEffect(() => {
    if (!isSending && !isFetchingPool) {
      fetchPoolAmount();
    }
  }, [isSending]);

  // Countdown timer state - 1 day in seconds (24 * 60 * 60)
  const ONE_DAY_IN_SECONDS = 86400;
  const getSecondsUntilMidnightUTC = () => {
    const now = new Date();
    const midnightUTC = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
    );
    return Math.floor((midnightUTC.getTime() - now.getTime()) / 1000);
  };

  const [timeRemaining, setTimeRemaining] = useState(
    getSecondsUntilMidnightUTC()
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages]);

  // Countdown timer effect - always running
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Set the height to scrollHeight to fit the content
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        payAndSendMessage(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} secs`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} mins`;
    }

    return `${minutes} mins`;
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return ((ONE_DAY_IN_SECONDS - timeRemaining) / ONE_DAY_IN_SECONDS) * 100;
  };

  const payAndSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isBalanceSufficient) return;
    if (address != null && (await sendPromptFee())) {
      sendMessage({
        role: "user",
        content: input ?? "Bullish",
        address: address,
      });
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencySign: undefined,
      maximumFractionDigits: 2,
    })
      .format(amount)
      .replace("$", "");
  };

  // Format wallet address for display
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-3)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={cn(
            "w-72 border-r border-border/30 bg-card/50 backdrop-blur-sm transition-all duration-300 flex flex-col",
            isMobile && (sidebarOpen ? "fixed inset-y-0 left-0 z-50" : "hidden")
          )}
        >
          <div className="p-4 space-y-4">
            {/* Pool Amount Card */}
            <Card className="border-2 border-primary/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-primary" />
                  Available Pool
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-center py-2 text-gradient">
                  {formatCurrency(poolAmount)} ETH
                </div>
                <div className="text-xs text-center text-muted-foreground">
                  Convince the AI to place a bet
                </div>
              </CardContent>
            </Card>

            {/* Countdown Timer Card */}
            <Card className="border-2 border-primary/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  Time Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-mono text-center py-2 text-gradient">
                  {formatTime(timeRemaining)}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-secondary/20 h-2 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000 ease-in-out"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <div className="mt-4 text-xs text-center text-muted-foreground">
                  AI will return funds after deadline
                </div>
                {timeRemaining === 0 && (
                  <div className="mt-3 text-center text-sm text-destructive font-medium">
                    Time's up!
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blockchain Capabilities Card */}
            <Card className="border-2 border-primary/30 shadow-md overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Blocks className="h-4 w-4 text-primary" />
                  Blockchain Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    This AI assistant can interact with blockchain and collect
                    on-chain data using Coinbase AgentKit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto p-4 text-xs text-muted-foreground border-t border-border/30">
            © 2025 Optimax AI | Made with ❤️
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 flex flex-col h-[calc(100vh-57px)]",
            isMobile && sidebarOpen && "opacity-50"
          )}
        >
          <div className="flex-1 overflow-hidden p-4">
            <div className="flex flex-col h-[calc(100vh-145px)]">
              <Card className="flex-1 flex flex-col border-2 border-primary/30 shadow-md bg-card/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="flex-1 overflow-y-auto p-4 pt-6 h-[calc(100vh-280px)]">
                  {/* Persistent welcome message */}
                  <div className="mb-6 mr-10 bg-secondary rounded-lg p-4 border-l-4 border-primary sticky top-0 z-10 shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">
                          Welcome to Optimax AI
                        </h3>
                        <p className="text-sm">
                          Hello! I'm your AI options betting agent with
                          blockchain capabilities.
                        </p>
                        <br />
                        <p className="text-sm mt-0">
                          <strong>
                            Your challenge: Convince me that you know BTC’s next
                            move.
                          </strong>
                          <br /> If you’re confident, you can place an options
                          bet using the pool’s funds. Win the bet, and the full
                          winnings are yours.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        } animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div
                          className={`flex items-start gap-2 max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div className="flex flex-col items-start gap-2">
                            <div
                              className={`rounded-full p-2 ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-secondary-foreground"
                              }`}
                            >
                              {message.role === "user" ? (
                                <User className="h-4 w-4" />
                              ) : (
                                <Bot className="h-4 w-4" />
                              )}
                            </div>
                            {!!message.address && (
                              <div className="text-xs">
                                {" "}
                                {truncateAddress(message.address)}{" "}
                              </div>
                            )}
                          </div>
                          <div
                            className={`rounded-lg px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary text-secondary-foreground"
                            } shadow-md whitespace-pre-wrap`}
                          >
                            {message.content}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isSending && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="flex items-start gap-2 max-w-[80%]">
                          <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
                            <Bot className="h-4 w-4" />
                          </div>
                          <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground shadow-md">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              />
                              <div
                                className="h-2 w-2 rounded-full bg-current animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <CardFooter className="border-t border-border/30 p-4 bg-card/80">
                  <form
                    onSubmit={payAndSendMessage}
                    className="flex w-full gap-2"
                  >
                    <Textarea
                      autoFocus={true}
                      ref={textareaRef}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      value={input}
                      placeholder={
                        timeRemaining === 0
                          ? "Time's up! No more submissions."
                          : "Make your case for an options bet on BTC"
                      }
                      className="flex-1 min-h-[40px] max-h-[200px] bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/50 transition-all duration-300 resize-none"
                      disabled={isFetching || isSending || timeRemaining === 0}
                      maxLength={500}
                      rows={1}
                    />
                    <Button
                      type="submit"
                      disabled={
                        isFetching ||
                        isSending ||
                        !input.trim() ||
                        timeRemaining === 0 ||
                        !isBalanceSufficient ||
                        isPending
                      }
                      className="bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-600 text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {isBalanceSufficient
                        ? `Send (${getPromptFee()} ETH)`
                        : `Balance < ${getPromptFee()} ETH`}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </div>
            {/* Powered by section */}
            <div className="p-4 flex-row flex gap-3 justify-end items-center">
              <div className="flex justify-center items-center text-sm font-medium text-muted-foreground">
                Powered by
              </div>
              <div className="flex flex-wrap justify-center items-center">
                <div className="flex items-center justify-center z-10">
                  <Image
                    src="/logos/coinbase.svg"
                    alt="Coinbase"
                    width={35}
                    height={35}
                  />
                </div>
                <div className="flex items-center justify-center h-8 z-9">
                  <Image
                    src="/logos/logx.svg"
                    alt="LogX"
                    width={35}
                    height={35}
                    className="ml-[-10px]"
                  />
                </div>
                <div className="flex items-center justify-center h-8 z-8">
                  <Image
                    src="/logos/zetachain.svg"
                    alt="Zetachain"
                    width={35}
                    height={35}
                    className="ml-[-10px]"
                  />
                </div>
                <div className="flex items-center justify-center h-8 z-5">
                  <Image
                    src="/logos/base.svg"
                    alt="Base"
                    width={35}
                    height={35}
                    className="ml-[-10px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
