import { createFileRoute } from "@tanstack/react-router";
import { Clock, Plus, Archive, Trash2, ShieldAlert, Calendar, FileText } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/retention")({
  head: () => ({
    meta: [
      { title: "Rétention & cycle de vie — ArchiveSafe Enterprise" },
      { name: "description", content: "Automatisez l'archivage légal et la purge conforme de vos documents." },
    ],
  }),
  component: RetentionPage,
});

const policies = [
  { id: "RET-01", name: "Factures — Conservation 10 ans", scope: "Type = Facture", action: "archive", after: "10 ans", docs: 4218, active: true },
  { id: "RET-02", name: "Brouillons — Purge 5 ans", scope: "Tag = 'brouillon'", action: "delete", after: "5 ans", docs: 312, active: true },
  { id: "RET-03", name: "Contrats — Archivage légal 30 ans", scope: "Type = Contrat", action: "archive", after: "30 ans", docs: 1872, active: true },
  { id: "RET-04", name: "CV rejetés — Purge RGPD 2 ans", scope: "Type = CV ET statut = rejeté", action: "delete", after: "2 ans", docs: 84, active: true },
  { id: "RET-05", name: "Courriers internes — Purge 3 ans", scope: "Type = Courrier", action: "delete", after: "3 ans", docs: 613, active: false },
];

function RetentionPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Cycle de vie"
        title="Rétention & purge automatique"
        description="Définissez la durée légale de conservation de chaque type de document. ArchiveSafe déclenche l'archivage ou la destruction à la date exacte."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Nouvelle règle</Button>}
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Règles actives", v: "12", i: Clock },
            { l: "À archiver ce mois", v: "284", i: Archive },
            { l: "À purger ce mois", v: "37", i: Trash2 },
            { l: "Hold légal", v: "4", i: ShieldAlert, c: "text-warning" },
          ].map((k) => (
            <Card key={k.l}><CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${k.c ?? "text-primary"}`}>
                <k.i className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{k.l}</div>
                <div className="text-lg font-semibold">{k.v}</div>
              </div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="border-b p-4">
              <div className="text-sm font-semibold">Politiques de rétention</div>
              <div className="text-xs text-muted-foreground">Les actions destructrices sont irréversibles et journalisées dans l'Audit.</div>
            </div>
            <div className="divide-y">
              {policies.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${p.action === "delete" ? "bg-destructive/10 text-destructive" : "bg-info/10 text-info"}`}>
                    {p.action === "delete" ? <Trash2 className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{p.name}</div>
                      <Badge variant="outline" className="font-mono text-[10px]">{p.id}</Badge>
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><FileText className="h-3 w-3" /> {p.scope}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Après {p.after}</span>
                      <span>{p.docs.toLocaleString("fr-FR")} documents concernés</span>
                    </div>
                  </div>
                  <Badge className={p.action === "delete" ? "bg-destructive/15 text-destructive" : "bg-info/15 text-info"}>
                    {p.action === "delete" ? "Destruction" : "Archivage"}
                  </Badge>
                  <Switch defaultChecked={p.active} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-sm font-semibold">Calendrier prévisionnel — 12 prochains mois</div>
              <div className="grid grid-cols-12 gap-1">
                {["Jui", "Aoû", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Jui"].map((m, i) => {
                  const arch = [28, 14, 42, 61, 39, 28, 84, 47, 52, 36, 71, 44][i];
                  const del = [4, 2, 6, 8, 5, 3, 12, 7, 9, 6, 11, 7][i];
                  const max = 100;
                  return (
                    <div key={m} className="flex flex-col items-center gap-1">
                      <div className="flex h-24 w-full flex-col justify-end gap-0.5">
                        <div className="w-full rounded-t bg-info" style={{ height: `${(arch / max) * 100}%` }} />
                        <div className="w-full rounded-t bg-destructive/70" style={{ height: `${(del / max) * 100}%` }} />
                      </div>
                      <div className="text-[10px] text-muted-foreground">{m}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-4 text-xs">
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-info" /> Archivage</div>
                <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-destructive/70" /> Destruction</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="h-4 w-4 text-warning" /> Legal holds actifs
              </div>
              <div className="space-y-3">
                {[
                  { case: "Litige Dupont SA", docs: 24, until: "31/12/2028" },
                  { case: "Contrôle URSSAF 2025", docs: 118, until: "01/07/2027" },
                  { case: "Enquête interne #442", docs: 6, until: "Indéterminée" },
                ].map((h) => (
                  <div key={h.case} className="flex items-center justify-between rounded-lg border bg-warning/5 p-3">
                    <div>
                      <div className="text-sm font-medium">{h.case}</div>
                      <div className="text-xs text-muted-foreground">{h.docs} documents · gel jusqu'au {h.until}</div>
                    </div>
                    <Badge className="bg-warning/20 text-warning-foreground">Bloqué</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}