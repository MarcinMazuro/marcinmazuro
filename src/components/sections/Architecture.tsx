import { Reveal } from "@/components/Reveal";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const TERRAFORM = `resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = "github"
  workload_identity_pool_provider_id = "github-oidc"

  # Only this repository can deploy
  attribute_condition = "assertion.repository=='MarcinMazuro/marcinmazuro'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}`;

/** This website as a project: the path from a commit to production. */
export function Architecture({ lang }: { lang: Lang }) {
  const t = dictionary(lang).architecture;
  return (
    <section id="architecture" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <SectionHeading index="05" command="terraform show" title={t.title} />
        <div className="grid gap-10 lg:grid-cols-2">
          <ol>
            {t.steps.map((step, i) => (
              <Reveal key={step.what} delay={i * 0.05}>
                <li className="relative flex gap-4 pb-6">
                  {i < t.steps.length - 1 && (
                    <span aria-hidden className="absolute top-7 bottom-0 left-[11px] w-px bg-line" />
                  )}
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface font-mono text-[10px] text-accent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-fg">{step.what}</p>
                    <p className="mt-1 text-sm text-fg-muted">{step.detail}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="border-b border-line px-4 py-2 font-mono text-[11px] text-fg-muted">terraform/iam.tf</div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-fg-muted">
              <code>{TERRAFORM}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
