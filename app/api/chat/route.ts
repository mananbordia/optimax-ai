import { openai } from "@ai-sdk/openai";
import { streamText, ToolSet } from "ai";
import { initializeAgent, agentSystemPrompt } from "@/lib/agent-kit";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

var toolsOpenAi: ToolSet | undefined = undefined;

export async function POST(req: Request) {
  const { messages } = await req.json();

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
    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: agentSystemPrompt,
      messages,
      tools: toolsOpenAi,
      maxSteps: 2,
    });

    console.log("Chat API result:", result);

    return result.toDataStreamResponse();
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
