import { createFileRoute } from "@tanstack/react-router";
import {
  GitBranch, Plus, Play, Pause, Zap, Mail, Tag, UserCheck, ArrowRight,
  FileText, Building2, MoreHorizontal, CheckCircle2, Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/workflows")({
  head: () => ({
    meta: [
      { title: "Workflows — ArchiveSafe Enterprise" },
      { name: "description", content: "Automatisez le classement, l'assignation et la notification des documents." },
    ],
  }),
  component: WorkflowsPage,
});

const rules = [
  { id: "WF-001", name: "Factures Orange → Comptabilité", desc: "Émetteur contient 'Orange' ET Type = Facture", runs: 214, success: 100, active: true },
  { id: "WF-002", name: "Contrats > 100 k€ → Validation Direction", desc: "Type = Contrat ET Montant > 100 000 €", runs: 12, success: 91, active: true },
  { id: "WF-003", name: "CV entrants → RH", desc: "Type = CV → assigner à RH + notifier recruteur", runs: 47, success: 100, active: true },
  { id: "WF-004", name: "Archivage automatique 5 ans", desc: "Documents 'Brouillon' non modifiés depuis 90 jours", runs: 3, success: 100, active: false },
];

function WorkflowsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Automatisation"
        title="Workflows & règles conditionnelles"
        description="Décrivez ce que vos documents doivent devenir. ArchiveSafe applique la règle en moins de 200 ms."
        actions={
          <>
            <Button variant="outline" size="sm"><Zap className="h-4 w-4" /> Modèles</Button>
            <Button size="sm"><Plus className="h-4 w-4" /> Nouveau workflow</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Actifs", v: "17", c: "text-success" },
            { l: "Exécutions / 24 h", v: "1 284", c: "text-primary" },
            { l: "Taux de succès", v: "99,2 %", c: "text-info" },
            { l: "Temps moyen", v: "180 ms", c: "text-warning" },
          ].map((k) => (
            <Card key={k.l}><CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.l}</div>
              <div className={`mt-1 text-2xl font-semibold ${k.c}`}>{k.v}</div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">Éditeur visuel</div>
                <div className="text-xs text-muted-foreground">Assemblez déclencheurs, conditions et actions.</div>
              </div>
              <Badge variant="outline" className="gap-1"><GitBranch className="h-3 w-3" /> WF-002 · Contrats {'>'}  100 k€</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <NodeBox tone="primary" icon={FileText} title="DÉCLENCHEUR" body="Nouveau document ajouté" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <NodeBox tone="warning" icon={GitBranch} title="CONDITION" body="Type = Contrat ET Montant > 100 000 €" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <NodeBox tone="info" icon={Tag} title="ACTION" body="Ajouter tag 'à-valider'" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <NodeBox tone="info" icon={UserCheck} title="ACTION" body="Assigner à Direction" />
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <NodeBox tone="success" icon={Mail} title="NOTIFIER" body="direction@acme.fr" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" size="sm">Tester</Button>
              <Button size="sm"><Play className="h-3.5 w-3.5" /> Activer</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div className="text-sm font-semibold">Règles existantes</div>
              <div className="text-xs text-muted-foreground">{rules.length} règles configurées</div>
            </div>
            <div className="divide-y">
              {rules.map((r) => (
                <div key={r.id} className="flex items-center gap-4 p-4 hover:bg-muted/30">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <GitBranch className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium">{r.name}</div>
                      <Badge variant="outline" className="font-mono text-[10px]">{r.id}</Badge>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{r.desc}</div>
                  </div>
                  <div className="hidden text-right md:block">
                    <div className="text-xs text-muted-foreground">Exécutions</div>
                    <div className="text-sm font-semibold">{r.runs}</div>
                  </div>
                  <div className="hidden w-28 md:block">
                    <div className="text-[10px] text-muted-foreground">Succès {r.success}%</div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-success" style={{ width: `${r.success}%` }} />
                    </div>
                  </div>
                  <Switch defaultChecked={r.active} />
                  <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="mb-3 text-sm font-semibold">Journal d'exécution</div>
            <div className="space-y-2 text-xs">
              {[
                { t: "il y a 2 min", w: "WF-001", d: "Facture Orange nov. 2025 → routée vers Comptabilité", ok: true },
                { t: "il y a 5 min", w: "WF-003", d: "CV Camille Petit → assigné à RH, mail envoyé", ok: true },
                { t: "il y a 12 min", w: "WF-002", d: "Contrat Dupont 240k€ → en attente Direction", ok: true },
                { t: "il y a 34 min", w: "WF-002", d: "Contrat sans montant détecté → ignoré", ok: false },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded border px-3 py-2">
                  {e.ok ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Clock className="h-4 w-4 text-warning" />}
                  <Badge variant="outline" className="font-mono text-[10px]">{e.w}</Badge>
                  <div className="flex-1">{e.d}</div>
                  <span className="text-muted-foreground">{e.t}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function NodeBox({
  tone, icon: Icon, title, body,
}: {
  tone: "primary" | "warning" | "info" | "success";
  icon: typeof FileText;
  title: string;
  body: string;
}) {
  const tones = {
    primary: "border-primary/40 bg-primary/5 text-primary",
    warning: "border-warning/50 bg-warning/10 text-warning-foreground",
    info: "border-info/40 bg-info/10 text-info",
    success: "border-success/40 bg-success/10 text-success",
  }[tone];
  return (
    <div className={`min-w-[180px] max-w-[220px] rounded-lg border-2 border-dashed p-3 ${tones}`}>
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="mt-1 text-xs font-medium text-foreground">{body}</div>
    </div>
  );
}