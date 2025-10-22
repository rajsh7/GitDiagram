"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RepoInput() {
  const [repo, setRepo] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repo.includes("/")) return alert("Use format: owner/repo");
    router.push(`/diagram?repo=${repo}`);
  };

  const handleLoadSaved = () => {
    if (!repo.includes("/")) return alert("Use format: owner/repo");
    router.push(`/diagram?repo=${repo}&load=saved`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">🔍 GitDiagram</h1>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <input
          type="text"
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          placeholder="e.g. facebook/react"
          className="px-4 py-2 rounded-md text-black w-72"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-semibold"
        >
          Visualize
        </button>
        <button
          type="button"
          onClick={handleLoadSaved}
          className="bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md text-white font-semibold"
        >
          Load Saved
        </button>
      </form>
    </div>
  );
}
