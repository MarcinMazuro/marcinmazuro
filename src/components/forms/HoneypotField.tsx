import { HONEYPOT_FIELD } from "@/lib/protection";

/** A field invisible to people and screen readers - only bots fill it in. */
export function HoneypotField() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
