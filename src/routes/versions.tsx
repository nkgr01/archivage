import { createFileRoute } from "@tanstack/react-router";
import { History, GitCommit, Download, RotateCcw, Eye, User } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/versions")({
  head: () => ({
    meta: [
      { title: "Versions — ArchiveSafe Enterprise" },
      { name: "description", content: "Historique complet des versions et comparaison visuelle." },
    ],
  }),
  component: VersionsPage,
});

const versions = [
  { v: "V4", date: "02/07/2026 10:22", author: "Karim Benali", note: "Ajout clause de confidentialité", size: "3.8 Mo", current: true },
  { v: "V3", date: "01/07/2026 16:04", author: "Amélie Rousseau", note: "Révision article 4", size: "3.6 Mo" },
  { v: "V2", date: "30/06/2026 09:12", author: "Karim Benali", note: "Correction montants", size: "3.4 Mo" },
  { v: "V1", date: "28/06/2026 14:47", author: "Sophie Martin", note: "Version initiale", size: "3.2 Mo" },
];

function VersionsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Historique"
        title="Versions de document"
        description="Contrat cadre — Fournisseur Dupont SA · 4 versions"
        actions={<Button variant="outline" size="sm"><Download className="h-4 w-4" /> Exporter historique</Button>}
      />
      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[280px_1fr]">
        <Card><CardContent className="p-0">
          <div className="border-b p-3 text-sm font-semibold">Historique</div>
          <div className="relative p-4">
            <div className="absolute left-6 top-6 bottom-6 w-px bg-border" />
            {versions.map((v) => (
              <div key={v.v} className="relative mb-4 flex gap-3 pl-8 last:mb-0">
                <div className={`absolute left-3 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-background ${v.current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  <GitCommit className="h-3 w-3" />
                </div>
                <div className={`flex-1 rounded-lg border p-2.5 text-xs ${v.current ? "border-primary/40 bg-primary/5" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{v.v}</span>
                    {v.current && <Badge className="bg-primary/15 text-primary text-[9px]">Actuelle</Badge>}
                  </div>
                  <div className="mt-0.5 text-muted-foreground">{v.date}</div>
                  <div className="mt-1 flex items-center gap-1 text-[11px]"><User className="h-3 w-3" /> {v.author}</div>
                  <div className="mt-1 text-[11px]">{v.note}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent></Card>

        <Card><CardContent className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <History className="h-4 w-4" /> Comparaison V3 ↔ V4
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline"><Eye className="h-3.5 w-3.5" /> Aperçu</Button>
              <Button size="sm" variant="outline"><RotateCcw className="h-3.5 w-3.5" /> Restaurer V3</Button>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {(["V3", "V4"] as const).map((label, idx) => (
              <div key={label} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase text-neutral-500">
                  <span>{label} — {versions[idx === 0 ? 1 : 0].date}</span>
                  <Badge variant="outline" className="text-[9px]">{versions[idx === 0 ? 1 : 0].size}</Badge>
                </div>
                <div className="space-y-1.5 text-[10px] leading-relaxed text-neutral-800">
                  <div className="h-1.5 rounded bg-neutral-200 w-4/5" />
                  <div className="h-1.5 rounded bg-neutral-200 w-full" />
                  <div className={`h-1.5 rounded w-3/4 ${idx === 1 ? "bg-success/50" : "bg-destructive/40"}`} />
                  <div className="h-1.5 rounded bg-neutral-200 w-5/6" />
                  {idx === 1 && <div className="h-1.5 rounded bg-success/50 w-2/3" />}
                  <div className="h-1.5 rounded bg-neutral-200 w-4/6" />
                  <div className={`h-1.5 rounded w-full ${idx === 1 ? "bg-success/50" : "bg-destructive/40"}`} />
                </div>
                <div className="mt-3 text-[10px] text-neutral-500">
                  {idx === 0 ? "3 lignes supprimées" : "5 lignes ajoutées · 2 modifiées"}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-success/50" /> Ajouté en V4</div>
            <div className="flex items-center gap-1.5"><span className="h-2 w-4 rounded-sm bg-destructive/40" /> Retiré / modifié</div>
          </div>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}