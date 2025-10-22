"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
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

/** ✅ Dynamically import react-modal to avoid SSR issues */
const Modal = dynamic(() => import("react-modal"), { ssr: false });

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

function GraphViewInner({ repo }: { repo: string }) {
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Notes
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [noteContent, setNoteContent] = useState("");

  /** 🔹 Safe Modal Initialization */
  useEffect(() => {
    if (typeof window !== "undefined" && (Modal as any).setAppElement) {
      const root =
        document.getElementById("__next") ||
        document.getElementById("root") ||
        document.body;
      (Modal as any).setAppElement(root);
    }
  }, []);

  /** 🔹 Fetch graph + notes */
  const fetchGraph = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let graphData: GraphData = { nodes: [], edges: [] };
      let noteData: any[] = [];

      try {
        const graphRes = await axios.get(
          `https://gitdiagram-pk6l.onrender.com/api/diagram/${repo}`
        );
        graphData = graphRes.data.graph;
      } catch (err: any) {
        if (err.response?.status === 404) console.warn("No diagram found");
      }

      try {
        const notesRes = await axios.get(
          `https://gitdiagram-pk6l.onrender.com/api/notes/${repo}`
        );
        noteData = notesRes.data;
      } catch (err: any) {
        if (err.response?.status === 404) console.warn("No notes found");
      }

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

      const edges = (graphData.edges || []).map((e: any) => ({
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
      }));

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
      await axios.post(`https://gitdiagram-pk6l.onrender.com/api/diagram`, {
        repo,
        graph,
      });
      setIsSaved(true);
      alert("✅ Diagram saved successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to save diagram.");
    }
  };

  /** 🔹 Note handlers */
  const handleSaveNote = async () => {
    if (!selectedNode) return;
    try {
      await axios.post(`https://gitdiagram-pk6l.onrender.com/api/notes`, {
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

  const handleDeleteNote = async () => {
    if (!selectedNode) return;
    try {
      await axios.delete(
        `https://gitdiagram-pk6l.onrender.com/api/notes/${repo}/${selectedNode.id}`
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

      {/* 📝 Modal */}
      {!!selectedNode && (
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
      )}
    </div>
  );
}

/** ✅ Export wrapped provider */
export default function GraphView({ repo }: { repo: string }) {
  return (
    <ReactFlowProvider>
      <GraphViewInner repo={repo} />
    </ReactFlowProvider>
  );
}
