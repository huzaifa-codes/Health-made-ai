"use client";

import HealthChart from "@/components/charts/HealthChart";
import ChatPanel from "@/components/chat/ChatPanel";
import { Card } from "@/components/ui/card";
import { Settings, Activity, Calendar, User } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  return (
    <main className="min-h-screen w-full bg-white px-12 py-6 text-gray-900 font-[var(--font-geist-sans)]">
      <div className="grid grid-cols-[160px_1fr_420px] gap-10 items-start">
        <aside className="bg-white border border-gray-200 flex flex-col items-center py-12 space-y-14 h-screen sticky top-0 rounded-2xl">
          <div className="flex flex-col items-center gap-12">
            <div className="p-4 rounded-xl hover:bg-purple-50 cursor-pointer transition">
              <Activity size={32} className="text-purple-600" />
            </div>

            <div className="p-4 rounded-xl hover:bg-purple-50 cursor-pointer transition">
              <Calendar size={28} className="text-gray-500 hover:text-purple-600" />
            </div>

            <div className="p-4 rounded-xl hover:bg-purple-50 cursor-pointer transition">
              <User size={28} className="text-gray-500 hover:text-purple-600" />
            </div>

            <div className="p-4 rounded-xl hover:bg-purple-50 cursor-pointer transition">
              <Settings size={28} className="text-gray-500 hover:text-purple-600" />
            </div>
          </div>

    
          <div className="mt-auto mb-4">
            <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold text-lg">
              HM
            </div>
          </div>
        </aside>

        {/* ---------------- Main Section ---------------- */}
        <section className="flex flex-col gap-10 min-h-screen">
          {/* Header */}
          <header>
            <h1 className="text-5xl font-bold text-purple-700 tracking-tight">Health Mate</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Your AI-powered health companion for a smarter lifestyle.
            </p>
          </header>

          {/* Info Cards */}
          <div className="grid grid-cols-3 gap-8">
            {[
              {
                title: "Overall Health Score",
                value: "98.2%",
                progress: 98,
                note: "Last updated: 2h ago",
              },
              {
                title: "Average Sleep",
                value: "7h 42m",
                progress: 75,
                note: "This week",
              },
              {
                title: "Active Minutes",
                value: "314",
                progress: 62,
                note: "Goal: 500 min/month",
              },
            ].map((card, i) => (
              <Card
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-8 transition hover:border-purple-200"
              >
                <p className="text-base text-gray-500">{card.title}</p>
                <h3 className="text-4xl font-bold text-purple-700 mt-3">{card.value}</h3>
                <Progress value={card.progress} className="mt-6" />
                <p className="text-md text-gray-400 mt-3">{card.note}</p>
              </Card>
            ))}
          </div>

          {/* Chart Section */}
          <Card className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-purple-700">Health Overview</h3>
              <p className="text-sm text-gray-400">Weekly summary</p>
            </div>
            <HealthChart />
          </Card>

          {/* Sleep Table */}
          <Card className="bg-white border border-gray-200 rounded-2xl p-8">
            <div className="flex justify-between text-base text-gray-500 mb-4 font-medium">
              <span>Sleep Duration</span>
              <span>Sleep Score</span>
            </div>

            {[
              { time: "8h 33m", score: "Excellent" },
              { time: "7h 22m", score: "Good" },
              { time: "6h 19m", score: "Fair" },
              { time: "5h 13m", score: "Poor" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-5 border-b border-gray-100 last:border-0"
              >
                <p className="text-gray-800 text-lg font-medium">{item.time}</p>
                <p
                  className={`font-semibold text-lg ${
                    item.score === "Excellent"
                      ? "text-purple-700"
                      : item.score === "Good"
                      ? "text-purple-500"
                      : item.score === "Fair"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  {item.score}
                </p>
              </div>
            ))}
          </Card>
        </section>

        {/* ---------------- Chat Panel ---------------- */}
      <aside className="bg-white border border-gray-200 rounded-2xl sticky top-0 p-8 flex flex-col h-screen w-[480px]">
  <h2 className="text-2xl font-semibold mb-8 text-center text-purple-700">
    AI Health Assistant
  </h2>

  {/* Chat messages area */}
  <div className="flex-1 overflow-y-auto min-h-0">
    <ChatPanel />
  </div>

  {/* Bottom action buttons */}
  <div className="mt-8 flex gap-4">
    <button className="flex-1 py-3.5 rounded-lg bg-purple-600 text-white text-base font-medium hover:bg-purple-700 transition">
      New Consultation
    </button>
    <button className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center text-xl">
      ⚙️
    </button>
  </div>
</aside>

      </div>
    </main>
  );
}
