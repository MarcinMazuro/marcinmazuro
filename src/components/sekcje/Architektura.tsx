import { Odsloniecie } from "@/components/Odsloniecie";
import { NaglowekSekcji } from "./NaglowekSekcji";

const KROKI = [
  { co: "git push main", opis: "Każdy push na main to wdrożenie." },
  { co: "GitHub Actions", opis: "lint, testy, build. Logowanie do GCP przez Workload Identity Federation - zero kluczy JSON." },
  { co: "Cloud Build", opis: "Obraz Dockera w trzech etapach, cache warstw z poprzedniej wersji." },
  { co: "Artifact Registry", opis: "Obraz otagowany krótkim SHA commita." },
  { co: "Cloud Run", opis: "europe-west1, osobne konto usługi z minimalnymi uprawnieniami." },
  { co: "Firestore", opis: "eur3, wiadomości z formularza. Limit zapytań i pole-pułapka na boty." },
];

const TERRAFORM = `resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = "github"
  workload_identity_pool_provider_id = "github-oidc"

  # Tylko to repozytorium może wdrażać
  attribute_condition = "assertion.repository=='MarcinMazuro/marcinmazuro'"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }
}`;

/** Ta strona jako projekt: droga od commita do produkcji. */
export function Architektura() {
  return (
    <section id="architektura" className="scroll-mt-20 py-24">
      <div className="mx-auto max-w-6xl px-5 3xl:max-w-7xl">
        <NaglowekSekcji numer="05" nazwa="terraform show" tytul="Ta strona też jest projektem" />
        <div className="grid gap-10 lg:grid-cols-2">
          <ol className="space-y-0">
            {KROKI.map((k, i) => (
              <Odsloniecie key={k.co} opoznienie={i * 0.05}>
                <li className="relative flex gap-4 pb-6 last:pb-0">
                  {i < KROKI.length - 1 && (
                    <span aria-hidden className="absolute top-7 bottom-0 left-[11px] w-px bg-linia" />
                  )}
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-linia bg-powierzchnia font-mono text-[10px] text-akcent">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-mono text-sm text-tekst">{k.co}</p>
                    <p className="mt-1 text-sm text-tekst-miekki">{k.opis}</p>
                  </div>
                </li>
              </Odsloniecie>
            ))}
          </ol>
          <div className="overflow-hidden rounded-xl border border-linia bg-powierzchnia">
            <div className="border-b border-linia px-4 py-2 font-mono text-[11px] text-tekst-miekki">terraform/iam.tf</div>
            <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-tekst-miekki">
              <code>{TERRAFORM}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
