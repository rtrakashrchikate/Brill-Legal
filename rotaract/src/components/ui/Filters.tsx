"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function FilterChips({
  options,
  value,
  onChange,
  layoutId,
  className,
  ariaLabel,
}: {
  options: { value: string; label: string; count?: number }[];
  value: string;
  onChange: (value: string) => void;
  layoutId: string;
  className?: string;
  ariaLabel: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={cn(
              "relative rounded-full px-3.5 py-1.5 text-[0.8rem] font-medium transition-colors duration-300",
              active ? "text-white" : "text-fg-muted hover:text-fg",
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-full bg-cranberry-600 shadow-[0_10px_28px_-12px_rgb(217_27_92/0.9)]"
              />
            )}
            {!active && (
              <span className="absolute inset-0 rounded-full border border-hairline bg-fg/[0.03]" />
            )}
            <span className="relative flex items-center gap-1.5">
              {option.label}
              {typeof option.count === "number" && (
                <span className={cn("text-[0.68rem]", active ? "text-white/70" : "text-fg-muted/70")}>
                  {option.count}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label: string;
}) {
  return (
    <label className={cn("glass relative flex h-11 items-center gap-2.5 rounded-full px-4", className)}>
      <span className="sr-only">{label}</span>
      <svg
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        aria-hidden
        className="shrink-0 text-fg-muted"
      >
        <circle cx="11" cy="11" r="6.6" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-fg-muted/70"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="shrink-0 rounded-full p-1 text-fg-muted transition-colors hover:text-cranberry-600"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      )}
    </label>
  );
}

export function SelectFilter({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  className?: string;
}) {
  return (
    <label className={cn("glass relative flex h-11 items-center gap-2 rounded-full pl-4 pr-2", className)}>
      <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-fg-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none bg-transparent py-2 pl-1 pr-6 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-surface text-fg">
            {option.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="pointer-events-none absolute right-4 text-fg-muted"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </label>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass-panel glass-sheen flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-full bg-cranberry-600/10 text-cranberry-600">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="m16.5 16.5 4 4" />
        </svg>
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-fg-muted">{description}</p>
      {action}
    </div>
  );
}
