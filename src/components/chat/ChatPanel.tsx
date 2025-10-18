"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPanel() {
  return (
    <div className="flex  flex-col h-full">
      {/* ---------------- Messages ---------------- */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        {/* User Message */}
        <div className="flex justify-end">
          <div className="bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-none max-w-[75%] text-base leading-relaxed">
            Can you please diagnose my symptom?
          </div>
        </div>

        {/* AI Reply */}
        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.jpg" alt="AI" />
          </Avatar>
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-gray-800 text-base leading-relaxed">
            Based on your input, you may be experiencing{" "}
            <span className="text-purple-700 font-medium">eczema</span>.  
            Try moisturizing regularly and avoiding irritants.
          </div>
        </div>

        {/* More Example Message */}
        <div className="flex justify-end">
          <div className="bg-purple-600 text-white px-4 py-3 rounded-2xl rounded-br-none max-w-[75%] text-base leading-relaxed">
            What should I do if symptoms worsen?
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatar.jpg" alt="AI" />
          </Avatar>
          <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-none max-w-[80%] text-gray-800 text-base leading-relaxed">
            If symptoms persist or worsen, you should consult a dermatologist for
            a professional diagnosis and treatment plan.
          </div>
        </div>
      </div>

      {/* ---------------- Input Bar ---------------- */}
      <div className="mt-4 flex items-center gap-3 border-t border-gray-200 pt-4">
        <Input
          placeholder="Type your message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-800 placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-purple-500"
        />
        <Button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg">
          Send
        </Button>
      </div>
    </div>
  );
}
