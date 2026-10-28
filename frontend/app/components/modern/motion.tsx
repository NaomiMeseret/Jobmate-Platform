"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Motion primitives.
 *
 * Every animation here exists to explain a state change: content entering the
 * viewport, a number settling on a value, a live indicator confirming work is
 * happening. Motion that is reduced-motion aware is disabled entirely.
 */

function useSweepVisibility() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [crossed, setCrossed] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;

    const revealCrossedContent = () => {
      const currentY = window.scrollY;
      const element = ref.current;
      if (element) {
        const bounds = element.getBoundingClientRect();
        const documentTop = bounds.top + currentY;
        const documentBottom = bounds.bottom + currentY;
        const sweptTop = Math.min(previousY, currentY) - window.innerHeight;
        const sweptBottom = Math.max(previousY, currentY) + window.innerHeight;

        // If a large jump crosses an element between scroll events, reveal it
        // anyway; hidden page content is never allowed to remain inaccessible.
        if (documentBottom >= sweptTop && documentTop <= sweptBottom) {
          setCrossed(true);
        }
      }
      previousY = currentY;
    };

    window.addEventListener("scroll", revealCrossedContent, { passive: true });
    window.addEventListener("hashchange", revealCrossedContent);
    window.addEventListener("resize", revealCrossedContent);
    revealCrossedContent();

    return () => {
      window.removeEventListener("scroll", revealCrossedContent);
      window.removeEventListener("hashchange", revealCrossedContent);
      window.removeEventListener("resize", revealCrossedContent);
    };
  }, []);

  return { ref, visible: inView || crossed };
}

export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion.div;
  const { ref, visible } = useSweepVisibility();

  if (reduce) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={visible ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.08,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, visible } = useSweepVisibility();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={visible ? "visible" : undefined}
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Counts from zero to `value` once the element scrolls into view.
 * Used for real, measured numbers only.
 */
export function CountUp({
  value,
  duration = 1.1,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      // easeOutExpo keeps the final digits from creeping.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className={cn("tnum", className)}>
      {display}
    </span>
  );
}

/**
 * A pulsing dot used next to live status text. Static under reduced motion.
 */
export function LiveDot({
  className,
  tone = "accent",
}: {
  className?: string;
  tone?: "accent" | "muted";
}) {
  const reduce = useReducedMotion();
  const color =
    tone === "accent"
      ? "bg-[var(--accent)]"
      : "bg-[var(--text-muted)]";

  return (
    <span className={cn("relative flex size-2", className)} aria-hidden="true">
      {!reduce && (
        <span
          className={cn("absolute inset-0 rounded-full opacity-60", color)}
          style={{ animation: "jm-pulse 1.8s ease-out infinite" }}
        />
      )}
      <span className={cn("relative size-2 rounded-full", color)} />
    </span>
  );
}

/**
 * A restrained pointer-following tilt for interactive surfaces.
 * The effect is disabled for touch input and reduced-motion preferences.
 */
export function TiltSurface({
  children,
  className,
  as = "div",
  maxTilt = 3,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  maxTilt?: number;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.45 });
  const rotateY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.45 });
  const MotionTag = motion[as];

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduce || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
    const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;
    x.set(vertical * -maxTilt);
    y.set(horizontal * maxTilt);
  };

  const resetTilt = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionTag
      className={cn("tilt-surface", className)}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      whileHover={reduce ? undefined : { y: -2 }}
      whileTap={reduce ? undefined : { scale: 0.995 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      {children}
    </MotionTag>
  );
}
