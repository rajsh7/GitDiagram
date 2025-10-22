"use client";
import { useSearchParams } from "next/navigation";
import GraphView from "../../components/GraphView";

export default function DiagramPage() {
  const searchParams = useSearchParams();
  const repo = searchParams.get("repo");
  const loadSaved = searchParams.get("load");

  if (!repo)
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p>No repository specified. Go back to home.</p>
      </div>
    );

  return <GraphView repo={repo + (loadSaved ? "?load=saved" : "")} />;
}
