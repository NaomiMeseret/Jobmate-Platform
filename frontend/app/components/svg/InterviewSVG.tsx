"use client";

import { motion } from "framer-motion";

export function InterviewSVG({
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
      {!decorative && <title>AI interview conversation</title>}
      <motion.path
        d="M34 44C34 31 45 20 58 20H112C125 20 136 31 136 44V76C136 89 125 100 112 100H82L56 124V100C44 99 34 88 34 76V44Z"
        fill="var(--accent-gold)"
        opacity="0.82"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.82, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        style={{ transformOrigin: "85px 72px" }}
      />
      <motion.path
        d="M84 86C84 73 95 62 108 62H162C175 62 186 73 186 86V118C186 131 175 142 162 142H138L112 162V142H108C95 142 84 131 84 118V86Z"
        fill="var(--accent-indigo)"
        opacity="0.82"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 0.82, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.25 }}
        style={{ transformOrigin: "135px 112px" }}
      />
      {[64, 84, 104].map((cx, index) => (
        <motion.circle
          key={`candidate-${cx}`}
          cx={cx}
          cy="60"
          r="4"
          fill="var(--bg-base)"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.15 }}
        />
      ))}
      {[116, 136, 156].map((cx, index) => (
        <motion.circle
          key={`ai-${cx}`}
          cx={cx}
          cy="104"
          r="4"
          fill="var(--bg-base)"
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.45 + index * 0.15 }}
        />
      ))}
    </svg>
  );
}

export default InterviewSVG;
