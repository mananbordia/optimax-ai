import { NextResponse } from "next/server";
import redisClient from "@/lib/redisClient";

const POOL_FUNDS_REDIS_KEY = "pool:funds";
const PRECISION = 1000;

export async function POST(req: Request) {
  const { amount }: { amount: number } = await req.json();

  await redisClient.INCRBY(POOL_FUNDS_REDIS_KEY, amount * PRECISION);

  // Return new pool funds
  const funds = await redisClient.GET(POOL_FUNDS_REDIS_KEY);
  return NextResponse.json({ funds: Number(funds) / PRECISION });
}

// Get pool funds
export async function GET() {
  const funds = await redisClient.GET(POOL_FUNDS_REDIS_KEY);
  return NextResponse.json({
    funds: Number(funds) / PRECISION || 0,
  });
}
