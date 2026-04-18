"use client";

import { useState } from "react";
import { Crimson_Text, Inter } from "next/font/google";
import DiagramViewer from "@/components/DiagramViewer";

// Fonts
const crimsonText = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [message, setMessage] = useState("");
  const [diagram, setDiagram] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateDiagram = async () => {
    if (!message.trim()) {
      setError("Please enter your app idea");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Generation failed");
        setDiagram("");
      } else {
        setDiagram(data.diagram);
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className={`min-h-screen bg-slate-950 text-slate-200 ${inter.className} p-6 selection:bg-indigo-500/30`}>

      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-8 pt-4">
          <h1 className={`${crimsonText.className} text-5xl font-bold bg-clip-text text-transparent bg-linear-to-b from-white to-slate-400 tracking-tight`}>
            Dev Diagram
          </h1>
          <p className="text-slate-400 mt-2 font-light max-w-xl mx-auto">
            Transform abstract concepts into structured logic.
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* LEFT PANEL (Input) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-800 shadow-2xl">

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your logic... (e.g. user authentication, payment processing, etc.)"
                className="w-full h-56 p-4 rounded-xl bg-slate-950/50 border border-slate-700 text-slate-200 placeholder:text-slate-600 placeholder:italic placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                onKeyDown={e => {
                  if (e.key == "Enter")
                    generateDiagram();
                }}
              />

              <div className="px-2 text-xs text-slate-500 leading-relaxed italic">
                Tip: Be specific about user actions and system responses for better results.
              </div>

              <button
                onClick={generateDiagram}
                disabled={loading}
                className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-semibold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Synthesizing...
                  </span>
                ) : (
                  "Generate Architecture"
                )}
              </button>

              {error && (
                <div className="mt-2 text-xs text-red-400 bg-red-950/30 border border-red-500/20 p-2 rounded-lg flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden h-full flex flex-col">
            <DiagramViewer diagram={diagram} />
          </div>
        </div>
      </div>
    </div>
  );
}