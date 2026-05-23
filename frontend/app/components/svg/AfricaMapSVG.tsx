"use client";

import { motion } from "framer-motion";

export function AfricaMapSVG({
  className,
  decorative = true,
}: {
  className?: string;
  decorative?: boolean;
}) {
  return (
    <motion.svg
      viewBox="0 0 160 180"
      fill="none"
      className={className}
      aria-hidden={decorative}
      role={decorative ? undefined : "img"}
      initial="hidden"
      animate="visible"
    >
      {!decorative && <title>Stylized map of Africa</title>}
      <motion.path
        d="M78 8C62 14 51 27 43 42L27 48L18 66L28 82L25 99L38 110L46 134L62 138L70 160L88 172L99 151L116 136L123 116L141 98L134 76L119 66L112 49L98 42L91 25L78 8Z"
        stroke="var(--accent-gold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0.2 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" },
          },
        }}
      />
      <motion.path
        d="M56 57L74 70L69 91L84 105L79 128"
        stroke="var(--accent-green)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.55"
        variants={{
          hidden: { pathLength: 0 },
          visible: {
            pathLength: 1,
            transition: { duration: 1.8, ease: "easeInOut", delay: 0.25 },
          },
        }}
      />
    </motion.svg>
  );
}

export default AfricaMapSVG;
