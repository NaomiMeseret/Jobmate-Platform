"use client";

import { motion } from "framer-motion";

export function GlobalConnectionSVG({
  className,
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  const arcTransition = (delay: number) => ({
    duration: 1.25,
    ease: "easeInOut" as const,
    delay,
  });

  return (
    <motion.svg
      viewBox="0 0 420 420"
      fill="none"
      className={className}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
      initial="hidden"
      animate="visible"
    >
      {!decorative && <title>Africa connected to global opportunities</title>}
      <motion.circle
        cx="210"
        cy="210"
        r="156"
        stroke="var(--border-accent)"
        strokeWidth="1.5"
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.ellipse
        cx="210"
        cy="210"
        rx="72"
        ry="156"
        stroke="var(--accent-indigo)"
        strokeWidth="1"
        opacity="0.42"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: arcTransition(0.15) },
        }}
      />
      <motion.path
        d="M56 210H364"
        stroke="var(--accent-green)"
        strokeWidth="1"
        opacity="0.35"
        variants={{
          hidden: { pathLength: 0 },
          visible: { pathLength: 1, transition: arcTransition(0.25) },
        }}
      />
      <motion.path
        d="M98 310C160 214 252 182 324 108"
        stroke="var(--accent-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0.2 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: arcTransition(0.45),
          },
        }}
      />
      <motion.path
        d="M116 126C176 198 242 230 334 284"
        stroke="var(--accent-indigo)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0.2 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: arcTransition(0.65),
          },
        }}
      />
      <motion.path
        d="M88 248C154 246 216 222 288 176"
        stroke="var(--accent-green)"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0.2 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: arcTransition(0.85),
          },
        }}
      />
      {[
        { cx: 98, cy: 310, color: "var(--accent-green)", delay: 1 },
        { cx: 324, cy: 108, color: "var(--accent-gold)", delay: 1.1 },
        { cx: 116, cy: 126, color: "var(--accent-indigo)", delay: 1.2 },
        { cx: 334, cy: 284, color: "var(--accent-green)", delay: 1.3 },
        { cx: 288, cy: 176, color: "var(--accent-gold)", delay: 1.4 },
      ].map((node) => (
        <motion.circle
          key={`${node.cx}-${node.cy}`}
          cx={node.cx}
          cy={node.cy}
          r="7"
          fill={node.color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.15, 1], opacity: 1 }}
          transition={{ duration: 0.55, delay: node.delay }}
        />
      ))}
    </motion.svg>
  );
}

export default GlobalConnectionSVG;
