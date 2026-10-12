/** Section heading styled like a shell command: "01 / git log --career". */
export function SectionHeading({ index, command, title }: { index: string; command: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs text-accent">
        {index} <span className="text-fg-muted">/ {command}</span>
      </p>
      <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
    </div>
  );
}
