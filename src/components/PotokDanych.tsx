"use client";

import { useBezRuchu } from "@/lib/useBezRuchu";

/**
 * Schemat typowej platformy danych na GCP, po którym płyną „rekordy".
 *
 * Animacja to SMIL (animateMotion) - działa bez JavaScriptu i nie obciąża
 * głównego wątku. Przy ograniczonym ruchu kropek nie ma wcale.
 */

type Wezel = { id: string; x: number; y: number; nazwa: string; opis: string };

const W = 132;
const H = 50;

const WEZLY: Wezel[] = [
  { id: "app", x: 70, y: 80, nazwa: "Aplikacje", opis: "zdarzenia" },
  { id: "gcs", x: 70, y: 240, nazwa: "Cloud Storage", opis: "pliki, CDC" },
  { id: "pubsub", x: 245, y: 80, nazwa: "Pub/Sub", opis: "strumień" },
  { id: "dataflow", x: 420, y: 160, nazwa: "Dataflow", opis: "Apache Beam" },
  { id: "bq", x: 595, y: 160, nazwa: "BigQuery", opis: "hurtownia" },
  { id: "looker", x: 770, y: 80, nazwa: "Looker", opis: "BI" },
  { id: "vertex", x: 770, y: 240, nazwa: "Vertex AI", opis: "ML" },
];

const KRAWEDZIE: [string, string][] = [
  ["app", "pubsub"],
  ["pubsub", "dataflow"],
  ["gcs", "dataflow"],
  ["dataflow", "bq"],
  ["bq", "looker"],
  ["bq", "vertex"],
];

const wezel = (id: string) => WEZLY.find((w) => w.id === id)!;

function sciezka(z: string, do_: string): string {
  const a = wezel(z);
  const b = wezel(do_);
  const x1 = a.x + W / 2;
  const x2 = b.x - W / 2;
  const srodek = (x1 + x2) / 2;
  return `M ${x1} ${a.y} C ${srodek} ${a.y}, ${srodek} ${b.y}, ${x2} ${b.y}`;
}

export function PotokDanych() {
  const bezRuchu = useBezRuchu();

  return (
    <svg
      viewBox="0 0 840 320"
      className="h-auto w-full"
      role="img"
      aria-label="Schemat platformy danych: aplikacje i Cloud Storage przez Pub/Sub i Dataflow do BigQuery, dalej do Looker i Vertex AI. Całość orkiestruje Cloud Composer."
    >
      <defs>
        <linearGradient id="krawedz" x1="0" x2="1">
          <stop offset="0" stopColor="var(--p-akcent-2)" stopOpacity="0.15" />
          <stop offset="1" stopColor="var(--p-akcent)" stopOpacity="0.5" />
        </linearGradient>
        <filter id="poswiata" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Orkiestrator nad potokiem, połączony przerywaną linią */}
      <g className="font-mono">
        <rect x={420 - 70} y={8} width={140} height={34} rx={8} fill="var(--p-powierzchnia)" stroke="var(--p-linia)" strokeDasharray="4 4" />
        <text x={420} y={30} textAnchor="middle" fontSize={12} fill="var(--p-tekst-miekki)">
          Cloud Composer
        </text>
        <path d={`M 420 42 L 420 ${160 - H / 2}`} stroke="var(--p-linia)" strokeDasharray="4 4" fill="none" />
        <path d={`M 470 42 C 595 42, 595 60, 595 ${160 - H / 2}`} stroke="var(--p-linia)" strokeDasharray="4 4" fill="none" />
      </g>

      {KRAWEDZIE.map(([z, d]) => (
        <path key={`${z}-${d}`} d={sciezka(z, d)} stroke="url(#krawedz)" strokeWidth={1.5} fill="none" />
      ))}

      {!bezRuchu &&
        KRAWEDZIE.flatMap(([z, d], i) =>
          [0, 1].map((n) => (
            <circle key={`${z}-${d}-${n}`} r={3} fill="var(--p-akcent)">
              <animateMotion
                dur={`${2.2 + (i % 3) * 0.4}s`}
                begin={`${i * 0.35 + n * 1.2}s`}
                repeatCount="indefinite"
                path={sciezka(z, d)}
              />
            </circle>
          )),
        )}

      {WEZLY.map((w) => (
        <g key={w.id} className="font-mono">
          {w.id === "bq" && (
            <rect
              x={w.x - W / 2}
              y={w.y - H / 2}
              width={W}
              height={H}
              rx={10}
              fill="var(--p-akcent)"
              opacity={0.25}
              filter="url(#poswiata)"
            />
          )}
          <rect
            x={w.x - W / 2}
            y={w.y - H / 2}
            width={W}
            height={H}
            rx={10}
            fill="var(--p-powierzchnia)"
            stroke={w.id === "bq" ? "var(--p-akcent)" : "var(--p-linia)"}
          />
          <text x={w.x} y={w.y - 2} textAnchor="middle" fontSize={13} fill="var(--p-tekst)">
            {w.nazwa}
          </text>
          <text x={w.x} y={w.y + 14} textAnchor="middle" fontSize={10} fill="var(--p-tekst-miekki)">
            {w.opis}
          </text>
        </g>
      ))}
    </svg>
  );
}
