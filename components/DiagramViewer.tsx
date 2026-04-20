"use client";

import { useContext } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useRef } from "react";
import Flowchart from "@/components/Flowchart";
import { FiZoomIn } from "react-icons/fi";
import { FiZoomOut } from "react-icons/fi";
import { TbZoomReset } from "react-icons/tb";
import { MdOutlineFileDownload } from "react-icons/md";
import { FaProjectDiagram } from "react-icons/fa";
import { ThemeContext } from "@/context/context";

export default function DiagramViewer({ diagram }: { diagram: string }) {
  const chartRef = useRef<HTMLDivElement>(null); // Reference to the diagram container

  const themeContext = useContext(ThemeContext); // Access the theme context to determine if dark mode is enabled
  if (!themeContext) return null; // Handle the case where the context is not available
  const isDark = themeContext.theme === "dark"; // Determine if the current theme is dark mode

  // Download SVG
  const downloadDiagram = () => {
    const svg = chartRef.current?.querySelector("svg"); // Find the SVG element within the diagram container
    if (!svg) return;

    const serializer = new XMLSerializer(); // Serialize the SVG element to a string
    const svgString = serializer.serializeToString(svg); // Convert the SVG element to a string

    // Create a Blob from the SVG string and generate a download link
    const blob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(blob); // Create a temporary URL for the Blob

    // Create a link element, set the download attribute, and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "diagram.svg";
    link.click();

    URL.revokeObjectURL(url); // Clean up the temporary URL
  };

  return (
    <div className="w-full h-full flex flex-col min-h-0">
      {/* HEADER */}
      <div className={`border-b p-3 flex justify-between items-center transition-colors ${isDark
        ? "border-slate-800 bg-slate-900/50"
        : "border-slate-200 bg-white"
        }`}>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? "text-slate-500" : "text-slate-500"
          }`}>Preview Canvas</span>
      </div>

      {/* MAIN CANVAS */}
      <div className="h-100">
        <TransformWrapper
          initialScale={1.5}
          minScale={0.5}
          maxScale={3}
          wheel={{ step: 0.1 }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className="w-full h-full flex flex-col">

              {/* TOOLBAR */}
              {diagram && (
                <div className={`flex justify-end gap-1 p-2 transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-100"
                  }`}>
                  <button
                    onClick={() => zoomIn()}
                    className={`px-2 py-1 rounded border transition ${isDark
                      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    title="zoom in"
                  >
                    <FiZoomIn />
                  </button>

                  <button
                    onClick={() => zoomOut()}
                    className={`px-2 py-1 rounded border transition ${isDark
                      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    title="zoom out"
                  >
                    <FiZoomOut />
                  </button>

                  <button
                    onClick={() => resetTransform()}
                    className={`px-2 py-1 rounded border transition ${isDark
                      ? "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200"
                      : "bg-white hover:bg-slate-100 border-slate-300 text-slate-700"
                      }`}
                    title="reset"
                  >
                    <TbZoomReset />
                  </button>

                  <button
                    onClick={downloadDiagram}
                    className="px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded border border-indigo-500 flex items-center gap-1"
                    title="download"
                  >
                    <MdOutlineFileDownload />
                    <span>Download</span>
                  </button>
                </div>
              )}

              {/* DIAGRAM AREA */}
              <div className={`flex-1 min-h-0 overflow-hidden transition-colors ${isDark ? "bg-slate-950/40" : "bg-slate-50"
                }`}>
                {diagram ? (
                  <TransformComponent
                    wrapperClass="!w-full !h-full"
                    contentClass="flex items-center justify-center w-full h-full"
                  >
                    <div ref={chartRef} className="p-6">
                      <Flowchart chart={diagram} />
                    </div>
                  </TransformComponent>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div className="group">
                      <div className={`mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl border transition ${isDark
                        ? "bg-slate-800/50 border-slate-700 group-hover:border-indigo-500/50"
                        : "bg-white border-slate-300 group-hover:border-indigo-400"
                        }`}>
                        <FaProjectDiagram className={`transition ${isDark
                          ? "text-slate-500 group-hover:text-indigo-500/80"
                          : "text-slate-400 group-hover:text-indigo-500"
                          }`} size={24} />
                      </div>

                      <p className={`font-medium ${isDark ? "text-slate-400" : "text-slate-600"
                        }`}>
                        Ready for input
                      </p>
                      <p className={`text-sm mt-1 ${isDark ? "text-slate-600" : "text-slate-500"
                        }`}>
                        Your visualization will render here.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </TransformWrapper>
      </div>
    </div>
  );
}