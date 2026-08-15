"use client";

import { AnimatePresence, motion } from "framer-motion";

import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle, ready } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      aria-pressed={isDark}
      className={cn(
        "glass relative grid size-10 place-items-center overflow-hidden rounded-full",
        "transition-transform duration-300 ease-[var(--ease-glass)] hover:scale-105 active:scale-95",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-500",
          isDark
            ? "bg-[radial-gradient(circle_at_30%_20%,rgb(0_80_161/0.5),transparent_70%)] opacity-100"
            : "bg-[radial-gradient(circle_at_70%_20%,rgb(247_168_27/0.45),transparent_70%)] opacity-100",
        )}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ready ? theme : "placeholder"}
          initial={{ y: 14, opacity: 0, rotate: -35 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -14, opacity: 0, rotate: 35 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          {isDark ? <MoonIcon /> : <SunIcon />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2M12 19.4v2M2.6 12h2M19.4 12h2M5.4 5.4l1.4 1.4M17.2 17.2l1.4 1.4M18.6 5.4l-1.4 1.4M6.8 17.2l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a7 7 0 0 0 11.1 11.1Z" />
    </svg>
  );
}
