"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GraphView from "../../components/GraphView";

function DiagramPageInner() {
  const searchParams = useSearchParams();
  const repo = searchParams.get("repo");
  const loadSaved = searchParams.get("load");

  if (!repo) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="mb-2 text-lg">⚠️ No repository specified.</p>
          <a href="/" className="underline text-blue-400 hover:text-blue-300">
            Go back to Home
          </a>
        </div>
      </div>
    );
  }

  // Append ?load=saved only if specified
  const repoParam = loadSaved ? `${repo}?load=saved` : repo;

  return <GraphView repo={repoParam} />;
}

export default function DiagramPage() {
  return (
    <Suspense fallback={<div className="text-white p-6">Loading diagram...</div>}>
      <DiagramPageInner />
    </Suspense>
  );
}
