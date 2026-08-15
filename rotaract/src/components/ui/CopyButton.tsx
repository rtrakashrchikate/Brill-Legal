"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Copy-to-clipboard with an animated confirmation. Public contact details are
 * deliberately reachable without an account, so this appears throughout the
 * site — on member cards, event organisers and every hub listing.
 */
export function CopyButton({
  value,
  label,
  icon,
  className,
  compact = false,
}: {
  value: string;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard API is unavailable over plain HTTP — fall back to a selection.
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      try {
        document.execCommand("copy");
      } catch {
        /* nothing more we can do — the value is still visible on screen */
      }
      document.body.removeChild(field);
    }

    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label ?? value}`}
      className={cn(
        "group/copy relative inline-flex items-center gap-2 rounded-full border border-hairline",
        "bg-fg/[0.03] text-fg-muted transition-all duration-300 ease-[var(--ease-glass)]",
        "hover:border-cranberry-600/35 hover:bg-cranberry-600/8 hover:text-cranberry-600 dark:hover:text-cranberry-300",
        compact ? "size-8 justify-center" : "px-3 py-1.5 text-[0.78rem]",
        className,
      )}
    >
      <span className="grid size-4 place-items-center">
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.svg
              key="done"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-emerald-500"
            >
              <path d="m4.5 12.5 5 5 10-11" />
            </motion.svg>
          ) : (
            <motion.span
              key="idle"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="grid place-items-center"
            >
              {icon ?? <CopyIcon />}
            </motion.span>
          )}
        </AnimatePresence>
      </span>

      {!compact && (
        <span className="relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={copied ? "copied" : "label"}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              {copied ? "Copied" : (label ?? value)}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </button>
  );
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="9" width="11" height="12" rx="2.5" />
      <path d="M5 15.5A2.5 2.5 0 0 1 3.5 13V5.5A2.5 2.5 0 0 1 6 3h7.5A2.5 2.5 0 0 1 15.7 4.6" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden className={className}>
      <path d="M12.03 2C6.9 2 2.74 6.16 2.74 11.29c0 1.8.5 3.48 1.37 4.92L2 22.5l6.45-2.06a9.2 9.2 0 0 0 3.58.72h.01c5.13 0 9.29-4.16 9.29-9.29S17.16 2 12.03 2Zm0 16.72h-.01a7.4 7.4 0 0 1-3.4-.86l-.24-.13-3.83 1.22 1.24-3.73-.16-.25a7.42 7.42 0 1 1 6.4 3.75Zm4.24-5.4c-.23-.12-1.37-.68-1.58-.75-.21-.08-.37-.12-.52.11-.15.24-.6.76-.74.92-.13.15-.27.17-.5.06a6.06 6.06 0 0 1-3.03-2.65c-.23-.39.23-.36.65-1.2.07-.15.04-.28-.02-.39-.06-.12-.52-1.26-.72-1.72-.19-.45-.38-.39-.52-.4h-.45c-.15 0-.39.06-.6.29-.2.24-.79.77-.79 1.88s.81 2.18.92 2.33c.12.15 1.6 2.44 3.87 3.42 1.44.62 2 .68 2.72.57.44-.07 1.37-.56 1.56-1.1.19-.55.19-1.01.14-1.11-.06-.1-.21-.17-.44-.28Z" />
    </svg>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      <rect x="2.5" y="4.5" width="19" height="15" rx="3" />
      <path d="m3.5 7 7.6 5.3a2 2 0 0 0 2.3 0L21 7" />
    </svg>
  );
}
