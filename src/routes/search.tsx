import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search, Sparkles, FileText, Filter, Clock, X, ArrowRight,
  Building2, Tag as TagIcon, Calendar, User, Command,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { documents } from "@/lib/mock-data";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Recherche IA — ArchiveSafe Enterprise" },
      { name: "description", content: "Recherche sémantique et facettée sur l'ensemble de vos documents." },
    ],
  }),
  component: SearchPage,
});

const facets = {
  Types: [
    { label: "Facture", count: 4218 },
    { label: "Contrat", count: 1872 },
    { label: "Rapport", count: 942 },
    { label: "Courrier", count: 613 },
    { label: "CV", count: 287 },
  ],
  Tags: [
    { label: "urgent", count: 148 },
    { label: "2026", count: 2140 },
    { label: "client", count: 812 },
    { label: "rh", count: 306 },
    { label: "audit", count: 92 },
  ],
  Départements: [
    { label: "Comptabilité", count: 3120 },
    { label: "Juridique", count: 984 },
    { label: "RH", count: 612 },
    { label: "IT", count: 421 },
  ],
};

const suggestions = [
  "Toutes les factures Orange de plus de 500€ payées en 2026",
  "Contrats fournisseurs arrivant à échéance dans les 90 jours",
  "Documents RH signés par Karim Benali le mois dernier",
  "Rapports d'audit sécurité contenant 'ISO 27001'",
];

function SearchPage() {
  const [query, setQuery] = useState("factures télécom > 200€");
  const [selectedFacets, setSelectedFacets] = useState<string[]>(["Facture", "2026"]);

  const toggle = (v: string) =>
    setSelectedFacets((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="Recherche sémantique"
        description="Interrogez vos 12 486 documents en langage naturel. L'IA comprend le contexte, les entités et les intentions."
        actions={
          <Badge variant="outline" className="gap-1.5 border-primary/30 text-primary">
            <Sparkles className="h-3 w-3" /> Neural search v2.4
          </Badge>
        }
      />

      <div className="px-6 py-6">
        <Card className="glass overflow-hidden border-primary/20 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 rounded-lg border bg-background px-4 py-3">
              <Search className="h-5 w-5 text-primary" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Posez votre question en français ou tapez des mots-clés…"
                className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
              />
              <Badge variant="secondary" className="gap-1 font-mono text-[10px]">
                <Command className="h-3 w-3" />K
              </Badge>
              <Button size="sm" className="gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Rechercher
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium">Suggestions :</span>
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  className="rounded-full border bg-background px-2.5 py-1 text-xs hover:border-primary/40 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Filter className="h-4 w-4" /> Filtres
                  </div>
                  <button className="text-xs text-primary hover:underline">Réinitialiser</button>
                </div>
                {selectedFacets.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5 border-b pb-3">
                    {selectedFacets.map((f) => (
                      <Badge key={f} className="gap-1 bg-primary/10 text-primary hover:bg-primary/20">
                        {f}
                        <button onClick={() => toggle(f)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                <div className="space-y-4">
                  {Object.entries(facets).map(([group, items]) => (
                    <div key={group}>
                      <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group}
                      </div>
                      <div className="space-y-1">
                        {items.map((it) => (
                          <button
                            key={it.label}
                            onClick={() => toggle(it.label)}
                            className={`flex w-full items-center justify-between rounded px-2 py-1 text-xs hover:bg-muted ${
                              selectedFacets.includes(it.label) ? "bg-primary/10 text-primary" : ""
                            }`}
                          >
                            <span>{it.label}</span>
                            <span className="text-muted-foreground">{it.count}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Période
                    </div>
                    <div className="space-y-1">
                      {["Aujourd'hui", "7 derniers jours", "30 derniers jours", "2026", "Personnalisée"].map((p) => (
                        <button key={p} className="flex w-full items-center gap-2 rounded px-2 py-1 text-xs hover:bg-muted">
                          <Calendar className="h-3 w-3 text-muted-foreground" /> {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="flex items-start gap-3 p-4">
                <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1 text-sm">
                  <div className="font-semibold">Réponse IA</div>
                  <p className="mt-1 text-muted-foreground">
                    J'ai trouvé <strong className="text-foreground">28 factures télécom</strong> supérieures à 200€ en 2026,
                    principalement d'Orange (18) et de SFR (7). Le montant cumulé est de{" "}
                    <strong className="text-foreground">14 820,50 €</strong>. La facture la plus élevée est celle d'Orange de novembre (1 240€).
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" className="h-7 text-xs">Exporter la liste</Button>
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Sources (28)</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div><strong className="text-foreground">28</strong> résultats · 0,12 s</div>
              <select className="rounded-md border bg-background px-2 py-1 text-xs">
                <option>Pertinence</option>
                <option>Date récente</option>
                <option>Date ancienne</option>
              </select>
            </div>

            {documents.slice(0, 6).map((d) => (
              <Card key={d.id} className="group cursor-pointer transition hover:border-primary/40 hover:shadow-md">
                <CardContent className="flex items-start gap-4 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold group-hover:text-primary">{d.title}</div>
                      <Badge variant="outline" className="text-[10px]">{d.type}</Badge>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      …le montant total <mark className="rounded bg-warning/40 px-1 text-foreground">télécom</mark> pour ce trimestre s'élève à
                      <mark className="rounded bg-warning/40 px-1 text-foreground"> 1 240,80 €</mark>, incluant l'abonnement fibre pro et les
                      lignes mobiles du service commercial…
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {d.author}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {d.department}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(d.updatedAt).toLocaleDateString("fr-FR")}</span>
                      <Separator orientation="vertical" className="h-3" />
                      {d.tags.map((t) => (
                        <span key={t} className="flex items-center gap-0.5"><TagIcon className="h-2.5 w-2.5" /> {t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className="bg-success/15 text-success hover:bg-success/20">98 % match</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}