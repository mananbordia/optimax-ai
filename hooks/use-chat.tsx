import { useState } from "react";

export type Message = {
  role: "user" | "assistant";
  content: string;
  address: string;
  timestamp?: number;
};

export default function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [input, setInput] = useState(""); // Store input value

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const sendMessage = async (message: Message) => {
    setInput(""); // Clear input
    setIsSending(true);
    setMessages((prevMessages) => [...prevMessages, message]);
    const response = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // TODO: Handle errors
    const data = await response.json();
    setMessages((prevMessages) => [...prevMessages, data.message]);
    setIsSending(false);
  };

  const fetchMessages = async () => {
    setIsFetching(true);
    const response = await fetch("/api/chat");
    const data = await response.json();
    setMessages(data.messages);
    setIsFetching(false);
    return data;
  };

  return {
    messages,
    sendMessage,
    fetchMessages,
    isSending,
    isFetching,
    input,
    handleInputChange,
  };
}
