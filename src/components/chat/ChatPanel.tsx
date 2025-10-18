"use client";

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function HealthMateChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "👋 Hello! I'm HealthMate, your AI medical assistant. Type your symptoms or upload a medical report (PDF/Image) for analysis.",
    },
  ]);
  const [message, setMessage] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && !file) return;

    // Add user messages
    const userMessages: Message[] = [];
    if (message.trim()) userMessages.push({ sender: "user", text: message.trim() });
    if (file) userMessages.push({ sender: "user", text: `📎 Uploaded file: ${file.name}` });

    setMessages((prev) => [...prev, ...userMessages]);
    setMessage("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("promt", message.trim() || "");
      if (file) formData.append("file", file);

      const res = await axios.post("/api/healthmate", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const reply: string = res.data.result || "⚠️ No response received.";
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setFile(null);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "⚠️ Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col max-w-md mx-auto p-4 bg-white text-gray-800 border rounded-lg shadow-md h-[550px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 p-2 border rounded bg-gray-50">
        {messages.map((msg, i) =>
          msg.sender === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="bg-purple-600 text-white px-3 py-2 rounded-2xl rounded-br-none max-w-[70%] whitespace-pre-wrap text-sm">
                {msg.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex items-start gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src="/avatar.jpg" alt="AI" />
              </Avatar>
              <div className="bg-gray-100 px-3 py-2 rounded-2xl rounded-tl-none max-w-[75%] whitespace-pre-wrap text-sm">
                {msg.text}
              </div>
            </div>
          )
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input + File */}
      <form onSubmit={handleSend} className="flex flex-col gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your symptoms or question..."
          className="flex-1 text-sm rounded-lg px-3 py-2"
        />
        <input
          type="file"
          accept=".pdf,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="text-sm"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
        >
          {loading ? "Analyzing..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
