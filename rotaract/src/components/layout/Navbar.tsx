"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";

import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { useSession } from "@/lib/auth/useSession";
import { navLinks, site } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useSession();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-[var(--ease-glass)]",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
          <nav
            className={cn(
              "relative flex items-center justify-between gap-4 rounded-full px-3 transition-all duration-500 ease-[var(--ease-glass)]",
              scrolled ? "glass h-14 shadow-lg" : "h-16 border border-transparent",
            )}
          >
            <Link
              href="/"
              className="group flex items-center gap-2.5 rounded-full py-1 pl-1.5 pr-3"
              aria-label={`${site.name} — home`}
            >
              <Wheel className="size-9 shrink-0 transition-transform duration-700 ease-[var(--ease-glass)] group-hover:rotate-180" />
              <span className="flex flex-col leading-none">
                <span className="font-display text-[0.95rem] font-semibold tracking-tight">
                  Rotaract
                </span>
                <span className="whitespace-nowrap text-[0.62rem] uppercase tracking-[0.16em] text-fg-muted sm:tracking-[0.2em]">
                  Pune Metro
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-colors duration-300",
                      active ? "text-fg" : "text-fg-muted hover:text-fg",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-fg/[0.07]"
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              {/* Wrapped rather than class-toggled: `hidden` and the button's own
                  display utility would otherwise race on stylesheet order. */}
              <div className="hidden items-center gap-2 sm:flex">
                <ThemeToggle />
                <ButtonLink href={user ? "/dashboard" : "/login"} size="sm">
                  {user ? "Dashboard" : "Rotaractor login"}
                </ButtonLink>
              </div>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-label={open ? "Close menu" : "Open menu"}
                className="glass grid size-10 place-items-center rounded-full lg:hidden"
              >
                <span className="relative flex h-3 w-4 flex-col justify-between">
                  <motion.span
                    animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1.6px] w-full rounded-full bg-current"
                  />
                  <motion.span
                    animate={open ? { opacity: 0, x: -6 } : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-[1.6px] w-full rounded-full bg-current"
                  />
                  <motion.span
                    animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="h-[1.6px] w-full rounded-full bg-current"
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="mx-auto mt-2 h-[2px] w-[min(100%-2rem,80rem)] origin-left rounded-full bg-gradient-to-r from-cranberry-600 via-gold-500 to-royal-700 opacity-70"
          aria-hidden
        />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink-950/45 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="glass-panel glass-sheen absolute inset-x-4 top-24 p-4"
            >
              <ul className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + index * 0.045, duration: 0.4 }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-medium transition-colors",
                        isActive(link.href)
                          ? "bg-cranberry-600/10 text-cranberry-600 dark:text-cranberry-300"
                          : "text-fg-muted hover:bg-fg/5 hover:text-fg",
                      )}
                    >
                      {link.label}
                      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-3 flex items-center gap-2 border-t border-hairline pt-3">
                <ThemeToggle />
                <ButtonLink href={user ? "/dashboard" : "/login"} className="flex-1">
                  {user ? "Open dashboard" : "Rotaractor login"}
                </ButtonLink>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Wheel({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="wheel-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-cranberry-600)" />
          <stop offset="55%" stopColor="var(--color-gold-500)" />
          <stop offset="100%" stopColor="var(--color-royal-700)" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="21" fill="none" stroke="url(#wheel-grad)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="7.5" fill="none" stroke="url(#wheel-grad)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="2.6" fill="url(#wheel-grad)" />
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        // Rounded because Math.sin/cos are implementation-defined: Node and the
        // browser can differ in the final digits, which React reads as a
        // hydration mismatch.
        const at = (radius: number, fn: (n: number) => number) =>
          (24 + fn(angle) * radius).toFixed(3);
        return (
          <line
            key={index}
            x1={at(7.5, Math.cos)}
            y1={at(7.5, Math.sin)}
            x2={at(21, Math.cos)}
            y2={at(21, Math.sin)}
            stroke="url(#wheel-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}
