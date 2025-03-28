"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  ArrowRight,
  DollarSign,
  Clock,
  Bot,
  Shield,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { POWERED_BY_CONFIG } from "@/lib/constants";
import { Navbar } from "@/components/navbar";

export default function LandingPage() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className="py-16 md:py-24 container mx-auto px-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="text-gradient">Convince the AI</span>
              <br />
              to Place Your Bet
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Present your analysis to our AI options betting agent. <br />
              If you're convincing enough, agent will allow you to place a bet
              with entire pool funds. Win the bet, take all the profits.
            </p>
            <div className="pt-4">
              <Link href="/chat">
                <div className="relative inline-block group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
                  <button
                    className="relative px-8 py-6 bg-black rounded-lg leading-none flex items-center text-white text-lg font-medium transition-all duration-300 hover:scale-105"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    Get Started
                    <ArrowRight
                      className={`ml-2 transition-transform duration-300 ${
                        isHovering ? "translate-x-1" : ""
                      }`}
                    />
                  </button>
                </div>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <Card className="border-2 border-primary/30 shadow-xl p-6 w-full max-w-md bg-card/80 backdrop-blur-sm">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <div className="rounded-full p-2 bg-secondary text-secondary-foreground">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div className="rounded-lg px-4 py-2 bg-secondary text-secondary-foreground shadow-md">
                      Convince me why you should place an options bet on BTC
                      with our 10,000 ETH pool. What's your analysis?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="flex items-start gap-2 flex-row-reverse">
                      <div className="rounded-full p-2 bg-primary text-primary-foreground">
                        <div className="h-5 w-5 flex items-center justify-center">
                          👤
                        </div>
                      </div>
                      <div className="rounded-lg px-4 py-2 bg-primary text-primary-foreground shadow-md">
                        Based on the recent post by President Trump for
                        including BTC...
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <div className="absolute -top-4 -right-4 bg-green-500 text-white rounded-full px-3 py-1 text-sm font-bold shadow-lg">
                24h Challenge
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Marquee Section */}
      <section className="py-6 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Powered By</h2>
          <div className="overflow-hidden">
            <div className="flex animate-marquee text-xl font-bold">
              {[...Array(2)].map((_, outerIndex) => (
                <div
                  key={outerIndex}
                  className="flex min-w-full justify-around"
                >
                  {POWERED_BY_CONFIG.map((partner, index) => (
                    <Card
                      key={index}
                      className="p-4 pt-1 border-2 border-primary/30 shadow-sm flex flex-col gap-2"
                    >
                      <div className="text-xs text-center text-muted-foreground">
                        {partner.subtext}
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center justify-center h-8">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        {partner.name}
                      </div>
                    </Card>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 border-primary/30 shadow-md p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">10,000 ETH Pool</h3>
              <p className="text-muted-foreground">
                Our AI controls a 10,000 ETH pool for options trading. Convince
                it to place a bet with these funds.
              </p>
            </Card>

            <Card className="border-2 border-primary/30 shadow-md p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">24-Hour Window</h3>
              <p className="text-muted-foreground">
                You have 24 hours to make your case. Provide detailed market
                analysis to convince our AI.
              </p>
            </Card>

            <Card className="border-2 border-primary/30 shadow-md p-6 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Win the Profits</h3>
              <p className="text-muted-foreground">
                If the AI places your bet and it wins, all profits go directly
                to your connected wallet.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Test Your Market Analysis?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Connect your wallet, make your case, and potentially win big if our AI
          is convinced by your options trading strategy.
        </p>
        <Link href="/chat">
          <div className="relative inline-block group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-x"></div>
            <button className="relative px-8 py-6 bg-black rounded-lg leading-none flex items-center text-white text-lg font-medium transition-all duration-300 hover:scale-105">
              Start the Challenge
              <ArrowRight className="ml-2" />
            </button>
          </div>
        </Link>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border/30 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="relative">
                <BarChart3 className="h-5 w-5 text-primary" />
                <TrendingUp className="h-3 w-3 text-green-500 absolute -top-1 -right-1" />
              </div>
              <span className="font-bold">Optimax AI</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 Optimax AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
