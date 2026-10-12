"use client";

import { dictionary } from "@/lib/dictionary";
import type { Lang } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";

/**
 * A typical GCP data platform with "records" flowing through it.
 *
 * The animation is SMIL (animateMotion) - it needs no JavaScript and stays
 * off the main thread. With reduced motion there are no dots at all.
 */

type NodeDef = { id: string; x: number; y: number; name: string; detail: string };

const W = 132;
const H = 50;

const EDGES: [string, string][] = [
  ["app", "pubsub"],
  ["pubsub", "dataflow"],
  ["gcs", "dataflow"],
  ["dataflow", "bq"],
  ["bq", "looker"],
  ["bq", "vertex"],
];

function buildNodes(lang: Lang): NodeDef[] {
  const t = dictionary(lang).pipeline;
  return [
    { id: "app", x: 70, y: 80, name: t.apps, detail: t.events },
    { id: "gcs", x: 70, y: 240, name: "Cloud Storage", detail: t.files },
    { id: "pubsub", x: 245, y: 80, name: "Pub/Sub", detail: t.stream },
    { id: "dataflow", x: 420, y: 160, name: "Dataflow", detail: "Apache Beam" },
    { id: "bq", x: 595, y: 160, name: "BigQuery", detail: t.warehouse },
    { id: "looker", x: 770, y: 80, name: "Looker", detail: "BI" },
    { id: "vertex", x: 770, y: 240, name: "Vertex AI", detail: "ML" },
  ];
}

function edgePath(nodes: NodeDef[], from: string, to: string): string {
  const a = nodes.find((n) => n.id === from)!;
  const b = nodes.find((n) => n.id === to)!;
  const x1 = a.x + W / 2;
  const x2 = b.x - W / 2;
  const mid = (x1 + x2) / 2;
  return `M ${x1} ${a.y} C ${mid} ${a.y}, ${mid} ${b.y}, ${x2} ${b.y}`;
}

export function DataPipeline({ lang }: { lang: Lang }) {
  const reducedMotion = usePrefersReducedMotion();
  const nodes = buildNodes(lang);

  return (
    <svg viewBox="0 0 840 320" className="h-auto w-full" role="img" aria-label={dictionary(lang).pipeline.label}>
      <defs>
        <linearGradient id="edge" x1="0" x2="1">
          <stop offset="0" stopColor="var(--c-accent-2)" stopOpacity="0.15" />
          <stop offset="1" stopColor="var(--c-accent)" stopOpacity="0.5" />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Orchestrator above the pipeline, linked with dashed lines */}
      <g className="font-mono">
        <rect
          x={420 - 70}
          y={8}
          width={140}
          height={34}
          rx={8}
          fill="var(--c-surface)"
          stroke="var(--c-line)"
          strokeDasharray="4 4"
        />
        <text x={420} y={30} textAnchor="middle" fontSize={12} fill="var(--c-fg-muted)">
          Cloud Composer
        </text>
        <path d={`M 420 42 L 420 ${160 - H / 2}`} stroke="var(--c-line)" strokeDasharray="4 4" fill="none" />
        <path
          d={`M 470 42 C 595 42, 595 60, 595 ${160 - H / 2}`}
          stroke="var(--c-line)"
          strokeDasharray="4 4"
          fill="none"
        />
      </g>

      {EDGES.map(([from, to]) => (
        <path key={`${from}-${to}`} d={edgePath(nodes, from, to)} stroke="url(#edge)" strokeWidth={1.5} fill="none" />
      ))}

      {!reducedMotion &&
        EDGES.flatMap(([from, to], i) =>
          [0, 1].map((n) => (
            <circle key={`${from}-${to}-${n}`} r={3} fill="var(--c-accent)">
              <animateMotion
                dur={`${2.2 + (i % 3) * 0.4}s`}
                begin={`${i * 0.35 + n * 1.2}s`}
                repeatCount="indefinite"
                path={edgePath(nodes, from, to)}
              />
            </circle>
          )),
        )}

      {nodes.map((n) => (
        <g key={n.id} className="font-mono">
          {n.id === "bq" && (
            <rect
              x={n.x - W / 2}
              y={n.y - H / 2}
              width={W}
              height={H}
              rx={10}
              fill="var(--c-accent)"
              opacity={0.25}
              filter="url(#glow)"
            />
          )}
          <rect
            x={n.x - W / 2}
            y={n.y - H / 2}
            width={W}
            height={H}
            rx={10}
            fill="var(--c-surface)"
            stroke={n.id === "bq" ? "var(--c-accent)" : "var(--c-line)"}
          />
          <text x={n.x} y={n.y - 2} textAnchor="middle" fontSize={13} fill="var(--c-fg)">
            {n.name}
          </text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize={10} fill="var(--c-fg-muted)">
            {n.detail}
          </text>
        </g>
      ))}
    </svg>
  );
}
