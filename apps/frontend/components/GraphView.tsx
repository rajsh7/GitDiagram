"use client";
import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import axios from "axios";
import Modal from "react-modal";

/** ✅ Safe Modal Initialization (works for Next.js 13–16) */
if (typeof window !== "undefined") {
  const appRoot =
    document.getElementById("__next") ||
    document.getElementById("root") ||
    document.body;
  Modal.setAppElement(appRoot);
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

function GraphViewInner({ repo }: { repo: string }) {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Notes state
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [noteContent, setNoteContent] = useState("");

  /** 🔹 Fetch graph + notes (handles 404s gracefully) */
  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let graphData: GraphData = { nodes: [], edges: [] };
      let noteData: any[] = [];

      // Try fetching diagram
      try {
        const graphRes = await axios.get(
          `http://localhost:5000/api/diagram/${repo}`
        );
        graphData = graphRes.data.graph;
      } catch (err: any) {
        if (err.response?.status === 404) {
          console.warn("⚠️ No diagram found, starting with empty graph.");
        } else throw err;
      }

      // Try fetching notes
      try {
        const notesRes = await axios.get(
          `http://localhost:5000/api/notes/${repo}`
        );
        noteData = notesRes.data;
      } catch (err: any) {
        if (err.response?.status === 404) {
          console.warn("⚠️ No notes found, skipping.");
        } else throw err;
      }

      // Build nodes
      const nodes = (graphData.nodes || []).map((n: any) => ({
        id: n.id,
        position: { x: n.x, y: n.y },
        data: { label: n.label },
        style: {
          background: n.type === "folder" ? "#4ade80" : "#60a5fa",
          color: "white",
          borderRadius: 6,
          padding: 6,
          border: noteData.some((x: any) => x.nodeId === n.id)
            ? "3px solid #facc15"
            : "none",
        },
      }));

      // Build edges
      const edges = (graphData.edges || []).map((e: any) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
      }));

      // Map notes
      const noteMap: Record<string, string> = {};
      noteData.forEach((n: any) => (noteMap[n.nodeId] = n.content));

      setNotes(noteMap);
      setGraph({ nodes, edges });
      setIsSaved(false);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load graph or notes.");
    } finally {
      setLoading(false);
    }
  }, [repo]);

  /** 🔹 Save graph */
  const saveGraph = async () => {
    if (!graph) return;
    try {
      await axios.post("http://localhost:5000/api/diagram", { repo, graph });
      setIsSaved(true);
      alert("✅ Diagram saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save diagram.");
    }
  };

  /** 🔹 Load saved graph */
  const loadSavedGraph = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/diagram/saved/${repo}`
      );
      const saved = res.data.data?.graph;

      if (!saved) {
        alert("No saved diagram found.");
        return;
      }

      setGraph(saved);
      setIsSaved(true);
      alert("📂 Loaded saved diagram!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to load saved diagram.");
    } finally {
      setLoading(false);
    }
  };

  /** 🔹 Save note */
  const handleSaveNote = async () => {
    if (!selectedNode) return;
    try {
      await axios.post("http://localhost:5000/api/notes", {
        repo,
        nodeId: selectedNode.id,
        content: noteContent,
      });
      setNotes((prev) => ({ ...prev, [selectedNode.id]: noteContent }));
      setSelectedNode(null);
      fetchGraph();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save note.");
    }
  };

  /** 🔹 Delete note */
  const handleDeleteNote = async () => {
    if (!selectedNode) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/notes/${repo}/${selectedNode.id}`
      );
      setNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[selectedNode.id];
        return newNotes;
      });
      setSelectedNode(null);
      fetchGraph();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete note.");
    }
  };

  /** 🔹 On node click → open modal */
  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node);
    setNoteContent(notes[node.id] || "");
  };

  useEffect(() => {
    fetchGraph();
  }, [fetchGraph]);

  if (loading)
    return <p className="text-center text-white mt-10">Loading diagram...</p>;
  if (error)
    return <p className="text-center text-red-400 mt-10">{error}</p>;
  if (!graph) return null;

  return (
    <div className="relative w-screen h-screen bg-gray-900 text-white">
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex space-x-3">
        <button
          onClick={fetchGraph}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md"
        >
          🔄 Refresh
        </button>

        <button
          onClick={saveGraph}
          className={`px-4 py-2 rounded-md ${
            isSaved ? "bg-green-600" : "bg-emerald-600 hover:bg-emerald-700"
          }`}
        >
          💾 {isSaved ? "Saved" : "Save"}
        </button>

        <button
          onClick={loadSavedGraph}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-md"
        >
          📂 Load
        </button>
      </div>

      {/* Diagram */}
      <ReactFlow
        nodes={graph.nodes}
        edges={graph.edges}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>

      {/* 📝 Note Modal */}
      <Modal
        isOpen={!!selectedNode}
        onRequestClose={() => setSelectedNode(null)}
        style={{
          overlay: { backgroundColor: "rgba(0,0,0,0.6)" },
          content: {
            maxWidth: "400px",
            margin: "auto",
            borderRadius: "10px",
            padding: "20px",
          },
        }}
      >
        <h2 className="text-lg font-bold mb-2">
          Notes for:{" "}
          <span className="text-blue-600">{selectedNode?.data?.label}</span>
        </h2>
        <textarea
          className="w-full border rounded p-2 h-32 text-black"
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="Write your note here..."
        />
        <div className="flex justify-end mt-3 space-x-2">
          <button
            onClick={handleDeleteNote}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
          <button
            onClick={handleSaveNote}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Save
          </button>
        </div>
      </Modal>
    </div>
  );
}

/** ✅ Wrap in ReactFlowProvider */
export default function GraphView({ repo }: { repo: string }) {
  return (
    <ReactFlowProvider>
      <GraphViewInner repo={repo} />
    </ReactFlowProvider>
  );
}
