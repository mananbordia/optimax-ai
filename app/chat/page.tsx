"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Send,
  Bot,
  User,
  Moon,
  Sun,
  Clock,
  DollarSign,
  TrendingUp,
  BarChart3,
  Blocks,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";
import Link from "next/link";
import {
  getPromptFee,
  getPromptFeeInEther,
  useSendPromptFee,
} from "@/lib/transaction-utils";

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [],
    });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { address, isConnected } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });
  const { sendPromptFee, isPending } = useSendPromptFee();

  const isBalanceSufficient = balanceData
    ? balanceData.value >= getPromptFeeInEther()
    : false;

  // Pool amount state
  const [poolAmount, setPoolAmount] = useState(10000); // $10,000 starting pool

  // Countdown timer state - 1 day in seconds (24 * 60 * 60)
  const ONE_DAY_IN_SECONDS = 86400;
  const [timeRemaining, setTimeRemaining] = useState(ONE_DAY_IN_SECONDS);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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

  // Format remaining time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      secs.toString().padStart(2, "0"),
    ].join(":");
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    return ((ONE_DAY_IN_SECONDS - timeRemaining) / ONE_DAY_IN_SECONDS) * 100;
  };

  const payAndSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!isBalanceSufficient) return;
    // if (await sendPromptFee()) {
    handleSubmit(e);
    // }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencySign: undefined,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("$", "");
  };

  // Format wallet address for display
  const truncateAddress = (address: string | undefined) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 flex flex-col">
      <header className="border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
              className="hover:scale-110 transition-transform duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </Button>
          )}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <div className="relative">
                <BarChart3 className="h-6 w-6 text-primary animate-float" />
                <TrendingUp className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-gradient-animated">Optimax AI</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {isConnected && balanceData && (
              <div className="text-base font-medium hidden md:block">
                <span className="text-muted-foreground mr-2">Balance:</span>
                <span className="text-gradient">
                  {Number.parseFloat(
                    formatUnits(balanceData.value, balanceData.decimals)
                  ).toFixed(4)}{" "}
                  {balanceData.symbol}
                </span>
              </div>
            )}
            <WalletConnectButton />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="text-foreground hover:scale-110 transition-transform duration-200"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </header>

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
                  Convince the AI to place a bet with these funds
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
                    This AI assistant can interact with blockchain using
                    Coinbase AgentKit.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-auto p-4 text-xs text-muted-foreground border-t border-border/30">
            © 2025 Optimax AI
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 flex flex-col",
            isMobile && sidebarOpen && "opacity-50"
          )}
        >
          <div className="flex-1 overflow-hidden p-4">
            <Card className="h-full flex flex-col border-2 border-primary/30 shadow-md bg-card/50 backdrop-blur-sm">
              <CardContent className="flex-1 overflow-y-auto p-4 pt-6">
                {/* Persistent welcome message */}
                <div className="mb-6 mr-10 bg-secondary/30 rounded-lg p-4 border-l-4 border-primary sticky top-0 z-10 shadow-md">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">
                        Welcome to Optimax AI
                      </h3>
                      <p className="text-sm">
                        Hello! I'm your AI options betting assistant with
                        blockchain capabilities.
                      </p>
                      <br />
                      <p className="text-sm mt-0">
                        <strong>
                          Your challenge: Convince me that you know BTC’s next
                          move.
                        </strong>
                        <br /> If you’re confident, you can place an options bet
                        using the pool’s funds. Win the bet, and the full
                        winnings are yours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
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
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground"
                          } shadow-md`}
                        >
                          {message.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
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
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder={
                      timeRemaining === 0
                        ? "Time's up! No more submissions."
                        : "Make your case for an options bet on BTC"
                    }
                    className="flex-1 bg-background/50 border-border/50 focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                    disabled={isLoading || timeRemaining === 0}
                  />
                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
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
        </main>
      </div>
    </div>
  );
}
