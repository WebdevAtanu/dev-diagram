"use client";

import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useRef } from "react";
import Flowchart from "@/components/Flowchart";

export default function DiagramViewer({ diagram }: { diagram: string }) {
  const chartRef = useRef<HTMLDivElement>(null); // Reference to the diagram container

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
      <div className="border-b border-slate-800 p-3 bg-slate-900/50 flex justify-between items-center">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
          <div className="w-3 h-3 rounded-full bg-slate-700" />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Preview Canvas</span>
      </div>

      {/* MAIN CANVAS */}
      <div className="h-100">
        <TransformWrapper
          initialScale={1.5}
          minScale={0.5}
          maxScale={3}
          wheel={{ step: 0.2 }}
          doubleClick={{ disabled: true }}
        >
          {({ zoomIn, zoomOut, resetTransform }) => (
            <div className="w-full h-full flex flex-col">

              {/* TOOLBAR */}
              {diagram && (
                <div className="flex justify-end gap-2 p-2 border-b border-slate-800 bg-slate-900/40">
                  <button
                    onClick={() => zoomIn()}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    + Zoom
                  </button>

                  <button
                    onClick={() => zoomOut()}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    − Zoom
                  </button>

                  <button
                    onClick={() => resetTransform()}
                    className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 rounded border border-slate-700"
                  >
                    Reset
                  </button>

                  <button
                    onClick={downloadDiagram}
                    className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded border border-indigo-500"
                  >
                    Download
                  </button>
                </div>
              )}

              {/* DIAGRAM AREA */}
              <div className="flex-1 min-h-0 bg-slate-950/40 overflow-hidden">
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
                      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/50 border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                        <svg
                          className="w-8 h-8 text-slate-600 group-hover:text-indigo-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                          />
                        </svg>
                      </div>

                      <p className="text-slate-400 font-medium">
                        Ready for input
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
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