import { Reveal, WordReveal } from "@/components/motion/primitives";
import { Aurora } from "@/components/ui/Aurora";
import { Eyebrow } from "@/components/ui/SectionHeading";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-12 pt-6 sm:pb-16 sm:pt-10">
      <Aurora variant="soft" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-5">
          <Reveal y={12}>
            <Eyebrow>{eyebrow}</Eyebrow>
          </Reveal>

          <h1 className="font-display text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]">
            <WordReveal text={title} />
          </h1>

          <Reveal delay={0.15} y={16}>
            <p className="max-w-2xl text-[1rem] leading-relaxed text-fg-muted sm:text-[1.06rem]">
              {description}
            </p>
          </Reveal>

          {children && (
            <Reveal delay={0.25} y={14}>
              {children}
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
