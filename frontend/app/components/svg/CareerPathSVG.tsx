"use client";

import { motion } from "framer-motion";

const milestones = [
  { cx: 42, cy: 134 },
  { cx: 86, cy: 104 },
  { cx: 132, cy: 76 },
  { cx: 178, cy: 38 },
];

export function CareerPathSVG({
  className,
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 170"
      fill="none"
      className={className}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
    >
      {!decorative && <title>Upward career path</title>}
      <motion.path
        d="M28 144C62 120 76 108 100 94C130 76 146 62 192 24"
        stroke="var(--accent-gold)"
        strokeWidth="4"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0.35 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.35, ease: "easeInOut" }}
      />
      {milestones.map((point, index) => (
        <motion.circle
          key={`${point.cx}-${point.cy}`}
          cx={point.cx}
          cy={point.cy}
          r="8"
          fill="var(--accent-green)"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.35, delay: 0.25 + index * 0.16 }}
          style={{ transformOrigin: `${point.cx}px ${point.cy}px` }}
        />
      ))}
    </svg>
  );
}

export default CareerPathSVG;
