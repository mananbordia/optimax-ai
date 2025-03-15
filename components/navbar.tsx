"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sun, Moon, BarChart3, TrendingUp, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WalletConnectButton } from "./wallet-connect-button";
import { useAccount, useBalance } from "wagmi";
import { formatUnits } from "viem";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const { isConnected, address } = useAccount();
  const { data: balanceData } = useBalance({
    address,
  });

  console.log("balanceData", balanceData);
  console.log("isConnected", isConnected);

  const products = [
    {
      name: "Perpmax AI",
      path: "/perpmax",
      description: "Gain access for 20x leverage perpetual trading",
      isActive: false,
    },
    {
      name: "Spotmax AI",
      path: "/spotmax",
      description: "Convince AI agent and use pool for spot trading",
      isActive: false,
    },
    {
      name: "Premax AI",
      path: "/premax",
      description:
        "Beat Pre-market AI agent and predict on unlaunched tokens",
      isActive: false,
    },
    {
      name: "Arbimax AI",
      path: "/artimax",
      description:
        "AI Arbitrage agent that autonomously works across multiple chains to extract max value",
      isActive: false,
    },
  ];

  return (
    <header className="border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold flex items-center gap-3">
              <div className="relative">
                <BarChart3 className="h-6 w-6 text-primary animate-float" />
                <TrendingUp className="h-4 w-4 text-green-500 absolute -top-1 -right-1" />
              </div>
              <span className="text-gradient-animated">Optimax AI</span>
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-4 ml-10">
            <TooltipProvider>
              {products.map((product) => (
                <Tooltip key={product.name}>
                  <TooltipTrigger asChild>
                    <div className="relative">
                      {product.isActive ? (
                        <Link
                          href={product.path}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            pathname === product.path
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {product.name}
                        </Link>
                      ) : (
                        <div className="relative px-3 py-2 text-sm font-medium rounded-md text-muted-foreground cursor-not-allowed">
                          {product.name}
                          <span className="absolute -bottom-1 -right-2 text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium inline-flex items-center justify-center leading-none ">
                            Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="max-w-xs">{product.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="gap-1">
                Products <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {products.map((product) => (
                <DropdownMenuItem
                  key={product.name}
                  disabled={!product.isActive}
                >
                  {product.isActive ? (
                    <Link href={product.path} className="w-full">
                      {product.name}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span>{product.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                        Soon
                      </span>
                    </div>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
      </div>
    </header>
  );
}
