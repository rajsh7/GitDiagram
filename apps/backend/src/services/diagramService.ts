// src/services/diagramService.ts
interface RepoItem {
  path: string;
  type: "blob" | "tree";
}

interface Node {
  id: string;
  label: string;
  type: "file" | "folder";
  x?: number;
  y?: number;
}

interface Edge {
  source: string;
  target: string;
}

export function generateRepoGraph(structure: RepoItem[]) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  structure.forEach((item) => {
    const parts = item.path.split("/");
    const id = parts.join("/");
    const label = parts[parts.length - 1];
    const type = item.type === "tree" ? "folder" : "file";

    nodes.push({ id, label, type });

    // Link parent folder → this file/folder
    if (parts.length > 1) {
      const parent = parts.slice(0, -1).join("/");
      edges.push({ source: parent, target: id });
    }
  });

  // simple layout positioning (hierarchical)
  nodes.forEach((node, i) => {
    node.x = (i % 10) * 200; // horizontal spacing
    node.y = Math.floor(i / 10) * 100; // vertical spacing
  });

  return { nodes, edges };
}
