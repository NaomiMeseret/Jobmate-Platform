"use client";

import { motion } from "framer-motion";

const textLines = [
  { x: 64, y: 58, width: 82 },
  { x: 64, y: 78, width: 112 },
  { x: 64, y: 98, width: 96 },
  { x: 64, y: 124, width: 122 },
];

export function CVDocumentSVG({
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
      {!decorative && <title>AI optimized CV document</title>}
      <path
        d="M52 22H142L178 58V154C178 163 171 170 162 170H52C43 170 36 163 36 154V38C36 29 43 22 52 22Z"
        stroke="var(--accent-gold)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M142 22V54C142 58 145 61 149 61H178"
        stroke="var(--accent-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="58" y="42" width="42" height="42" rx="8" fill="var(--accent-indigo)" opacity="0.24" />
      <circle cx="79" cy="59" r="8" fill="var(--accent-indigo)" opacity="0.78" />
      <path
        d="M64 78C68 70 90 70 94 78"
        stroke="var(--accent-indigo)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.78"
      />
      {textLines.map((line) => (
        <rect
          key={`${line.y}-${line.width}`}
          x={line.x}
          y={line.y}
          width={line.width}
          height="7"
          rx="3.5"
          fill="var(--text-muted)"
          opacity="0.34"
        />
      ))}
      <motion.line
        x1="44"
        x2="170"
        y1="38"
        y2="38"
        stroke="var(--accent-green)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: [0, 112, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

export default CVDocumentSVG;
