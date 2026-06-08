import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-28 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-3 font-display text-4xl text-ink">Page not found</h1>
      <p className="mt-4 text-muted">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-[2px] bg-ink px-5 py-3 text-sm font-medium text-paper hover:bg-ink-soft"
        >
          Go home
        </Link>
        <Link
          href="/insights"
          className="rounded-[2px] border border-ink px-5 py-3 text-sm font-medium text-ink hover:bg-ink hover:text-paper"
        >
          Browse insights
        </Link>
      </div>
    </Container>
  );
}
