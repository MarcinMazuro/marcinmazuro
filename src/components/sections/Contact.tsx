import { ContactForm } from "@/components/forms/ContactForm";
import { PROFILE } from "@/lib/content";
import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Contact({ lang }: { lang: Lang }) {
  const t = dictionary(lang).contact;
  const links = [
    { label: "email", href: `mailto:${PROFILE.email}`, text: PROFILE.email },
    { label: "github", href: PROFILE.github, text: PROFILE.github.replace("https://", "") },
    { label: "linkedin", href: PROFILE.linkedin, text: "linkedin" },
  ];
  return (
    <section id="contact" className="scroll-mt-20 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[1fr_1.6fr] 3xl:max-w-7xl">
        <div>
          <SectionHeading index="07" command="curl -X POST" title={t.title} />
          <p className="leading-relaxed text-fg-muted">{t.intro}</p>
          <dl className="mt-8 space-y-3 font-mono text-sm">
            {links.map((l) => (
              <div key={l.label} className="flex gap-3">
                <dt className="w-20 text-fg-muted">{l.label}</dt>
                <dd>
                  <a href={l.href} className="text-accent-2 hover:underline">
                    {l.text}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <ContactForm lang={lang} />
      </div>
    </section>
  );
}
