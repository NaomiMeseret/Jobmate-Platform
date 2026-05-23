"use client";

import { motion } from "framer-motion";

const nodes = [
  { cx: 58, cy: 48 },
  { cx: 104, cy: 34 },
  { cx: 144, cy: 64 },
  { cx: 78, cy: 104 },
  { cx: 132, cy: 120 },
  { cx: 176, cy: 96 },
  { cx: 168, cy: 150 },
];

const edges = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [2, 5],
  [4, 5],
  [4, 6],
  [5, 6],
];

export function AIBrainSVG({
  className,
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 180"
      fill="none"
      className={className}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
    >
      {!decorative && <title>AI neural network</title>}
      {edges.map(([from, to]) => (
        <motion.line
          key={`${from}-${to}`}
          x1={nodes[from].cx}
          y1={nodes[from].cy}
          x2={nodes[to].cx}
          y2={nodes[to].cy}
          stroke="var(--accent-green)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="8 10"
          initial={{ strokeDashoffset: 18, opacity: 0.28 }}
          animate={{ strokeDashoffset: [18, 0, -18], opacity: [0.28, 0.8, 0.28] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {nodes.map((node, index) => (
        <motion.circle
          key={`${node.cx}-${node.cy}`}
          cx={node.cx}
          cy={node.cy}
          r="9"
          fill="var(--accent-indigo)"
          opacity="0.8"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            delay: index * 0.12,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
        />
      ))}
    </svg>
  );
}

export default AIBrainSVG;
