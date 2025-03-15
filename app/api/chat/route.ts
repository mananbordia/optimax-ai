import { openai } from "@ai-sdk/openai";
import { generateText, ToolSet } from "ai";
import { initializeAgent, agentSystemPrompt } from "@/lib/agent-kit";
import { NextResponse } from "next/server";
import redisClient from "@/lib/redisClient";
import { Message } from "@/hooks/use-chat";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

var toolsOpenAi: ToolSet | undefined = undefined;

const MESSAGE_REDIS_KEY = "chat:messages";
const POOL_FUNDS_REDIS_KEY = "pool:funds";

export async function POST(req: Request) {
  const { message }: { message: Message } = await req.json();

  if (!toolsOpenAi) {
    try {
      // Initialize AgentKit and get tools
      const { tools } = await initializeAgent();
      toolsOpenAi = tools;
    } catch (error) {
      console.error("Error initializing agent:", error);
      // Skip initializing agent if there's an error
    }
  }

  try {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      system: agentSystemPrompt,
      messages: [message],
      tools: toolsOpenAi,
      maxSteps: 2,
    });

    console.log("Chat API result:", result.text);

    const userMessage: Message = {
      ...message,
      timestamp: Date.now(),
    };
    const agentMessage: Message = {
      role: "assistant",
      content: result.text,
      address: "",
      timestamp: Date.now() + 2,
    };

    // Try to save messages to Redis
    try {
      console.log("Saving messages to Redis:", userMessage);

      await redisClient.ZADD(MESSAGE_REDIS_KEY, [
        {
          score: Number(userMessage.timestamp),
          value: JSON.stringify(userMessage),
        },
        {
          score: Number(agentMessage.timestamp),
          value: JSON.stringify(agentMessage),
        },
      ]);

      await redisClient.INCRBY(POOL_FUNDS_REDIS_KEY, 10)
    } catch (error) {
      console.error("Error saving message to Redis:", error);
    }

    return NextResponse.json({ message: agentMessage });

    // console.log("Chat API response:", result.toTextStreamResponse());
    // return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process request" + error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  const messages = await redisClient.zRange(MESSAGE_REDIS_KEY, 0, -1);
  // Parse messages from Redis
  return NextResponse.json({
    messages: messages.map((message) => JSON.parse(message) as Message),
  });
}
