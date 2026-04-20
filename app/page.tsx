"use client";

import { useState, useContext } from "react";
import { Crimson_Text, Inter } from "next/font/google";
import DiagramViewer from "@/components/DiagramViewer";
import { GoSun } from "react-icons/go";
import { GoMoon } from "react-icons/go";
import { ThemeContext } from "@/context/context";

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
  const themeContext = useContext(ThemeContext);
  if (!themeContext) return null;
  const isDark = themeContext.theme === "dark";

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
    <div
      className={`min-h-screen ${isDark ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"
        } ${inter.className} p-6 selection:bg-indigo-500/30 transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto relative">
        {/* HEADER */}
        <div className="flex justify-between items-start mb-6 pt-2">
          <div className="">
            <h1
              className={`${crimsonText.className} text-3xl md:text-5xl font-bold bg-clip-text text-transparent tracking-tight ${isDark
                ? "bg-linear-to-b from-white to-slate-400"
                : "bg-linear-to-b from-slate-900 to-slate-500"
                }`}
            >
              Dev Diagram
            </h1>

            <p
              className={`mt-2 font-light max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Transform abstract concepts into structured logic.
            </p>
          </div>
          {/* TOGGLE BUTTON */}
          <button
            onClick={themeContext.toggleTheme}
            className={`p-2.5 rounded-full border transition-all duration-300 shadow-md backdrop-blur-md
              ${isDark
                ? "bg-slate-800/80 border-slate-700 text-yellow-300 hover:bg-slate-700 hover:shadow-[0_0_12px_rgba(250,204,21,0.4)]"
                : "bg-white/80 border-slate-300 text-slate-700 hover:bg-slate-100 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)]"
              }`}
            title="Toggle Theme"
          >
            <span
              className={`transition-all duration-500 ${isDark ? "rotate-0" : "rotate-180"
                }`}
            >
              {isDark ? <GoSun size={18} /> : <GoMoon size={18} />}
            </span>
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* LEFT PANEL */}
          <div className="lg:col-span-2 space-y-4">
            <div
              className={`backdrop-blur-xl rounded-2xl p-6 border shadow-xl transition-colors duration-300 ${isDark
                ? "bg-slate-900/50 border-slate-800"
                : "bg-white border-slate-200"
                }`}
            >
              {/* TEXTAREA */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your logic... (e.g. user authentication, payment processing, etc.)"
                className={`w-full h-56 p-4 rounded-xl border transition-all resize-none shadow-inner focus:outline-none focus:ring-2 ${isDark
                  ? "bg-slate-950/50 border-slate-700 text-slate-200 placeholder:text-slate-600 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  : "bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:ring-indigo-500/40 focus:border-indigo-500"
                  }`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    generateDiagram();
                  }
                }}
              />

              {/* TIP */}
              <div className="px-2 text-xs text-slate-500 leading-relaxed italic">
                Tip: Be specific about user actions and system responses for
                better results.
              </div>

              {/* BUTTON */}
              <button
                onClick={generateDiagram}
                disabled={loading}
                className={`w-full mt-6 py-3.5 rounded-xl font-semibold transition-all active:scale-[0.98] ${isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                  : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-md"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Synthesizing...
                  </span>
                ) : (
                  "Generate Architecture"
                )}
              </button>

              {/* ERROR */}
              {error && (
                <div
                  className={`mt-2 text-xs p-2 rounded-lg flex items-center gap-2 border ${isDark
                    ? "text-red-400 bg-red-950/30 border-red-500/20"
                    : "text-red-600 bg-red-50 border-red-200"
                    }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className={`lg:col-span-3 backdrop-blur-xl rounded-2xl border shadow-xl overflow-hidden h-full flex flex-col transition-colors duration-300 ${isDark
              ? "bg-slate-900/40 border-slate-800"
              : "bg-white border-slate-200"
              }`}
          >
            <DiagramViewer diagram={diagram} />
          </div>
        </div>
      </div>
    </div>
  );
}