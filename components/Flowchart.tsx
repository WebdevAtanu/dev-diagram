"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function Flowchart({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chart || !ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
    });

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(
          `mermaid-${Date.now()}`,
          chart
        );
        ref.current!.innerHTML = svg;
      } catch (err) {
        ref.current!.innerHTML = "<p>Error rendering diagram</p>";
      }
    };

    renderChart();
  }, [chart]);

  return <div ref={ref} />;
}