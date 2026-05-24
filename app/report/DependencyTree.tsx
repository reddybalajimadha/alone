"use client";

import React, { useState, useMemo } from "react";
import { DependencyNode } from "../types";

interface VisualNode {
  id: string;
  name: string;
  details?: string;
  x: number;
  y: number;
  depth: number;
  hasChildren: boolean;
  isCollapsed: boolean;
  parentId?: string;
}

interface VisualLink {
  sourceId: string;
  targetId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function truncateLabel(text: string, limit: number): string {
  if (text.length <= limit) return text;
  return text.substring(0, limit - 3) + "...";
}

export default function DependencyTree({ tree }: { tree: DependencyNode }) {
  // Store collapsed node paths (using unique paths as keys)
  const [collapsedNodes, setCollapsedNodes] = useState<Record<string, boolean>>({});
  const [hoveredNode, setHoveredNode] = useState<VisualNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<VisualNode | null>(null);

  // Layout parameters
  const ySpacing = 38;
  const containerWidth = 600;

  // Process the tree data and calculate positions dynamically
  const { nodes, links, height } = useMemo(() => {
    const visualNodes: VisualNode[] = [];
    const visualLinks: VisualLink[] = [];
    let yIndex = 0;

    // Helper to calculate max depth of visible nodes first
    function getVisibleMaxDepth(node: DependencyNode, depth: number, path: string): number {
      const isCollapsed = !!collapsedNodes[path];
      if (!node.children || node.children.length === 0 || isCollapsed) {
        return depth;
      }
      return node.children.reduce((max, child, idx) => {
        const childPath = `${path} > ${child.name}-${idx}`;
        return Math.max(max, getVisibleMaxDepth(child, depth + 1, childPath));
      }, depth);
    }

    const maxDepth = getVisibleMaxDepth(tree, 0, tree.name);
    // Dynamically calculate level spacing to fit within 600px width
    const levelWidth = maxDepth > 0
      ? Math.min(145, Math.max(85, (containerWidth - 175) / maxDepth))
      : 145;

    // Recursive layout worker
    function layout(
      node: DependencyNode,
      depth: number,
      path: string,
      parentId?: string
    ): { x: number; y: number; id: string } {
      const id = path;
      const hasChildren = !!node.children && node.children.length > 0;
      const isCollapsed = !!collapsedNodes[id];
      const x = depth * levelWidth + 25;

      // Leaf or Collapsed node: allocates a dedicated vertical row
      if (!hasChildren || isCollapsed) {
        const y = yIndex * ySpacing + 25;
        yIndex++;

        const vNode: VisualNode = {
          id,
          name: node.name,
          details: node.details,
          x,
          y,
          depth,
          hasChildren,
          isCollapsed,
          parentId,
        };
        visualNodes.push(vNode);
        return { x, y, id };
      }

      // Expanded node: layouts children first, then centers parent vertically between them
      const childPositions: { x: number; y: number; id: string }[] = [];
      const childrenNodes = node.children || [];

      for (let i = 0; i < childrenNodes.length; i++) {
        const child = childrenNodes[i];
        // Append index to path to ensure uniqueness even if names match
        const childPath = `${path} > ${child.name}-${i}`;
        const pos = layout(child, depth + 1, childPath, id);
        childPositions.push(pos);

        visualLinks.push({
          sourceId: id,
          targetId: pos.id,
          x1: x,
          y1: 0, // Placeholder, updated below
          x2: pos.x,
          y2: pos.y,
        });
      }

      const minY = childPositions[0].y;
      const maxY = childPositions[childPositions.length - 1].y;
      const y = minY + (maxY - minY) / 2;

      const vNode: VisualNode = {
        id,
        name: node.name,
        details: node.details,
        x,
        y,
        depth,
        hasChildren,
        isCollapsed,
        parentId,
      };
      visualNodes.push(vNode);

      // Backfill parent Y coordinate for its child links
      for (const link of visualLinks) {
        if (link.sourceId === id) {
          link.y1 = y;
        }
      }

      return { x, y, id };
    }

    // Initialize layout starting from the root node
    layout(tree, 0, tree.name);

    const computedHeight = Math.max(yIndex * ySpacing + 40, 220);

    return { nodes: visualNodes, links: visualLinks, height: computedHeight };
  }, [tree, collapsedNodes]);

  const activeNode = hoveredNode || selectedNode;

  // Track parent lineage path for highlighting
  const highlightedIds = useMemo(() => {
    if (!activeNode) return new Set<string>();
    const ids = new Set<string>();
    let currentId: string | undefined = activeNode.id;
    while (currentId) {
      ids.add(currentId);
      const node = nodes.find((n) => n.id === currentId);
      currentId = node?.parentId;
    }
    return ids;
  }, [activeNode, nodes]);

  function handleNodeClick(node: VisualNode, e: React.MouseEvent) {
    e.stopPropagation();
    if (node.hasChildren) {
      setCollapsedNodes((prev) => ({
        ...prev,
        [node.id]: !prev[node.id],
      }));
    } else {
      setSelectedNode(selectedNode?.id === node.id ? null : node);
    }
  }

  // Generates smooth horizontal cubic bezier curve paths for connectors
  const getBezierPath = (link: VisualLink) => {
    const controlX = (link.x1 + link.x2) / 2;
    return `M ${link.x1} ${link.y1} C ${controlX} ${link.y1}, ${controlX} ${link.y2}, ${link.x2} ${link.y2}`;
  };

  return (
    <div className="my-10 flex flex-col gap-6 rounded-md border border-rule bg-paper/50 p-4 sm:p-6">
      {/* Help Tip */}
      <div className="text-center text-xs italic text-ink-faint">
        Click items with circular rings (o) to expand or collapse details.
      </div>

      <div className="w-full overflow-x-auto pb-4 select-none">
        <svg
          width={containerWidth}
          height={height}
          viewBox={`0 0 ${containerWidth} ${height}`}
          className="mx-auto block overflow-visible transition-all duration-300"
        >
            {/* Draw Links using Bezier curves */}
            {links.map((link, i) => {
              const isHighlighted =
                highlightedIds.has(link.sourceId) &&
                highlightedIds.has(link.targetId);
              return (
                <path
                  key={i}
                  d={getBezierPath(link)}
                  fill="none"
                  stroke={
                    isHighlighted ? "var(--color-ink)" : "var(--color-rule)"
                  }
                  strokeWidth={isHighlighted ? 1.5 : 1}
                  strokeDasharray={isHighlighted ? "none" : "2 2"}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const isHighlighted = highlightedIds.has(node.id);
              const isSelected = selectedNode?.id === node.id;

              const isRoot = node.depth === 0;
              const isLeaf = !node.hasChildren;

              // Parent nodes align to the left (ends leftward), leaf/root nodes align to the right
              const textX = isLeaf || isRoot ? 12 : -12;
              const textAnchor = isLeaf || isRoot ? "start" : "end";
              const displayName = truncateLabel(node.name, isLeaf ? 24 : 18);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={(e) => handleNodeClick(node, e)}
                >
                  {/* Hover/Tap Area */}
                  <circle r={14} fill="transparent" />

                  {node.hasChildren ? (
                    <>
                      {/* Expandable ring */}
                      <circle
                        r={7}
                        fill="var(--color-paper)"
                        stroke={isHighlighted ? "var(--color-ink)" : "var(--color-ink-soft)"}
                        strokeWidth={isHighlighted ? 1.5 : 1}
                        className="transition-all duration-300"
                      />
                      {/* Plus / Minus indicator */}
                      <line
                        x1={-3}
                        y1={0}
                        x2={3}
                        y2={0}
                        stroke="var(--color-ink)"
                        strokeWidth={1}
                      />
                      {node.isCollapsed && (
                        <line
                          x1={0}
                          y1={-3}
                          x2={0}
                          y2={3}
                          stroke="var(--color-ink)"
                          strokeWidth={1}
                        />
                      )}
                    </>
                  ) : (
                    /* Simple leaf dot */
                    <circle
                      r={3.5}
                      fill={isHighlighted ? "var(--color-ink)" : "var(--color-ink-soft)"}
                      stroke="var(--color-paper)"
                      strokeWidth={1}
                      className="transition-all duration-300"
                    />
                  )}

                  {/* Text Label */}
                  <text
                    x={textX}
                    y={4}
                    textAnchor={textAnchor}
                    className={[
                      "font-serif text-sm select-none pointer-events-none transition-all duration-300",
                      isHighlighted
                        ? "fill-ink font-semibold opacity-100"
                        : "fill-ink-soft opacity-85",
                    ].join(" ")}
                  >
                    {displayName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

      {/* Detail Showcase Card */}
      <div className="min-h-[85px] rounded-sm border border-rule bg-paper px-4 py-3 transition-colors duration-300">
        {activeNode ? (
          <div>
            <div className="flex items-center justify-between border-b border-rule pb-1.5 mb-2">
              <h4 className="font-serif text-base font-semibold text-ink">
                {activeNode.name}
              </h4>
              <span className="text-[11px] uppercase tracking-widest text-ink-faint">
                {activeNode.hasChildren ? "Category Node" : "Base Element"}
              </span>
            </div>
            <p className="font-serif text-sm text-ink-soft italic leading-relaxed">
              {activeNode.details || "A fundamental component in the lineage of this creation."}
            </p>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center py-2">
            <p className="font-serif text-sm italic text-ink-faint text-center">
              Hover over or click any node to trace its lineage and expand details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
