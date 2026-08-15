import { Reveal } from "@/components/motion/primitives";
import { Aurora } from "@/components/ui/Aurora";
import { ArrowRight, ButtonLink } from "@/components/ui/Button";
import { CopyButton, MailIcon, WhatsAppIcon } from "@/components/ui/CopyButton";
import { site } from "@/config/site";

export function CtaBand() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6">
      <Reveal>
        <div className="glass-panel glass-sheen relative isolate overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
          <Aurora variant="band" />

          <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-[2.6rem] sm:leading-[1.1]">
              Have something to ask for, or something to give?
            </h2>
            <p className="text-[0.95rem] leading-relaxed text-fg-muted sm:text-base">
              The Requirement Hub is open to read for everyone — no account, no gate. If you are
              a verified Rotaractor, you can post an ask in under a minute.
            </p>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/hub" size="lg" className="group">
                Browse open requests
                <ArrowRight className="group-hover:translate-x-1" />
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="glass">
                Sign in to post
              </ButtonLink>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <CopyButton value={site.email} label={site.email} icon={<MailIcon />} />
              <CopyButton value={site.whatsapp} label={site.whatsapp} icon={<WhatsAppIcon />} />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
