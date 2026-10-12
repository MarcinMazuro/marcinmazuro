import { notFound } from "next/navigation";
import { Architecture } from "@/components/sections/Architecture";
import { ConsoleSection } from "@/components/sections/ConsoleSection";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Services } from "@/components/sections/Services";
import { Skills } from "@/components/sections/Skills";
import { isLang } from "@/lib/i18n";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <main>
      <Hero lang={lang} />
      <Experience lang={lang} />
      <Projects lang={lang} />
      <Skills lang={lang} />
      <ConsoleSection lang={lang} />
      <Architecture lang={lang} />
      <Services lang={lang} />
      <Contact lang={lang} />
    </main>
  );
}
