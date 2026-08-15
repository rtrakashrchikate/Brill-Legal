import Link from "next/link";

import { Aurora } from "@/components/ui/Aurora";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { navLinks } from "@/config/site";

export default function NotFound() {
  return (
    <section className="relative isolate mx-auto flex min-h-[60dvh] w-full max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <Aurora variant="soft" />

      <p className="relative font-display text-[5rem] font-semibold leading-none text-gradient sm:text-[7rem]">
        404
      </p>
      <h1 className="relative mt-4 font-display text-2xl font-semibold sm:text-3xl">
        That page isn&rsquo;t on the board.
      </h1>
      <p className="relative mt-3 max-w-md text-[0.95rem] leading-relaxed text-fg-muted">
        The link may be old, or the listing may have been fulfilled and archived. Everything the
        club publishes is reachable from the pages below.
      </p>

      <div className="relative mt-8 flex flex-wrap justify-center gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="glass rounded-full px-4 py-2 text-[0.82rem] text-fg-muted transition-all duration-300 hover:-translate-y-0.5 hover:text-cranberry-600"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <ButtonLink href="/" size="lg" className="group relative mt-8">
        Back to home
        <ArrowRight className="group-hover:translate-x-1" />
      </ButtonLink>
    </section>
  );
}
