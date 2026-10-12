"use client";

/** PDF straight from the browser instead of a separate file - the resume never drifts from the site. */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-accent px-4 py-2 font-mono text-xs font-medium text-canvas"
    >
      {label}
    </button>
  );
}
