import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { initializeAgent, agentSystemPrompt } from "@/lib/agent-kit"

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  try {
    // Initialize AgentKit and get tools
    const { tools } = await initializeAgent()

    const result = streamText({
      model: openai("gpt-4o"),
      system: agentSystemPrompt,
      messages,
      tools,
      maxSteps: 10,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

