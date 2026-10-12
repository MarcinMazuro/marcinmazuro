import { Architektura } from "@/components/sekcje/Architektura";
import { Doswiadczenie } from "@/components/sekcje/Doswiadczenie";
import { Hero } from "@/components/sekcje/Hero";
import { Kontakt } from "@/components/sekcje/Kontakt";
import { Projekty } from "@/components/sekcje/Projekty";
import { SekcjaKonsoli } from "@/components/sekcje/SekcjaKonsoli";
import { Umiejetnosci } from "@/components/sekcje/Umiejetnosci";
import { Uslugi } from "@/components/sekcje/Uslugi";

export default function StronaGlowna() {
  return (
    <main>
      <Hero />
      <Doswiadczenie />
      <Projekty />
      <Umiejetnosci />
      <SekcjaKonsoli />
      <Architektura />
      <Uslugi />
      <Kontakt />
    </main>
  );
}
