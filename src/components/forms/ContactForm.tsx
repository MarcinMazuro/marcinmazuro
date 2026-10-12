"use client";

import Link from "next/link";
import { useState } from "react";
import { CONSENT, TOPICS, type Topic } from "@/lib/contact";
import { dictionary } from "@/lib/dictionary";
import { localePath, type Lang } from "@/lib/i18n";
import { HONEYPOT_FIELD } from "@/lib/protection";
import { HoneypotField } from "./HoneypotField";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-2 w-full rounded-md border border-line bg-canvas px-4 py-3 font-sans text-sm text-fg placeholder:text-fg-muted/50 focus:border-accent/60 focus:outline-none";
const label = "block font-mono text-xs text-fg-muted";
const DEFAULT_TOPIC: Topic = "hiring";

export function ContactForm({ lang }: { lang: Lang }) {
  const t = dictionary(lang).contact;
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [HONEYPOT_FIELD]: data.get(HONEYPOT_FIELD),
          lang,
          name: data.get("name"),
          email: data.get("email"),
          company: data.get("company"),
          topic: data.get("topic"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
        }),
      });
      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setMessage(body.error ?? t.failed);
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setMessage(t.offline);
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-accent/40 bg-surface p-8 font-mono">
        <p className="text-accent">200 OK</p>
        <p className="mt-3 font-sans leading-relaxed text-fg-muted">{t.success}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={send}
      className="relative grid gap-5 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2 sm:p-8"
    >
      <HoneypotField />
      <label className={label}>
        name
        <input name="name" required maxLength={80} autoComplete="name" className={field} />
      </label>

      <label className={label}>
        email
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>

      <label className={label}>
        company <span className="text-fg-muted/60">-- {t.optional}</span>
        <input name="company" maxLength={120} autoComplete="organization" className={field} />
      </label>

      <label className={label}>
        topic
        <select name="topic" defaultValue={DEFAULT_TOPIC} className={field}>
          {Object.entries(TOPICS).map(([key, text]) => (
            <option key={key} value={key}>
              {text[lang]}
            </option>
          ))}
        </select>
      </label>

      <label className={`${label} sm:col-span-2`}>
        message
        <textarea name="message" required rows={5} maxLength={4000} className={`${field} resize-y`} />
      </label>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-fg-muted sm:col-span-2">
        <input name="consent" type="checkbox" required className="mt-0.5 size-4 shrink-0 accent-[var(--c-accent)]" />
        <span>
          {CONSENT.text[lang]}{" "}
          <Link href={localePath(lang, "/privacy")} className="text-accent-2 underline underline-offset-2">
            {t.privacy}
          </Link>
        </span>
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-md bg-accent px-6 py-2.5 font-mono text-sm font-medium text-canvas transition-transform hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "sending" ? "POST /api/contact..." : t.send}
        </button>
        {status === "error" && (
          <p role="alert" className="mt-3 font-mono text-xs text-danger">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
