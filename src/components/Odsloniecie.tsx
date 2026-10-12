"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useBezRuchu } from "@/lib/useBezRuchu";

/**
 * Wejście elementu przy przewijaniu - wspólne dla sekcji pod sceną.
 *
 * Animujemy wyłącznie przesunięcie, nigdy przezroczystość. Motion zapisuje
 * stan początkowy już w HTML-u z serwera, więc opacity:0 oznaczałoby, że
 * przy błędzie JavaScriptu albo nieodpalonym obserwatorze widoczności cała
 * oferta z cenami zostaje niewidoczna. Przesunięte o 24 px treści są w
 * najgorszym razie lekko przesunięte, ale zawsze czytelne.
 */
export function Odsloniecie({
  children,
  opoznienie = 0,
  className,
}: {
  children: ReactNode;
  opoznienie?: number;
  className?: string;
}) {
  const bezRuchu = useBezRuchu();

  return (
    <motion.div
      initial={bezRuchu ? false : { y: 24 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: bezRuchu ? 0 : 0.7,
        delay: bezRuchu ? 0 : opoznienie,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
