import { createFileRoute } from "@tanstack/react-router";
import {
  ScrollText, Shield, Eye, Edit, Trash2, Download, Share2, LogIn,
  Filter, Search, Lock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit & conformité — ArchiveSafe Enterprise" },
      { name: "description", content: "Historique immuable de toutes les actions utilisateurs et système." },
    ],
  }),
  component: AuditPage,
});

type Action = "view" | "edit" | "delete" | "download" | "share" | "login";
const actionMeta: Record<Action, { label: string; icon: typeof Eye; color: string }> = {
  view: { label: "Consultation", icon: Eye, color: "text-info bg-info/10" },
  edit: { label: "Modification", icon: Edit, color: "text-warning bg-warning/15" },
  delete: { label: "Suppression", icon: Trash2, color: "text-destructive bg-destructive/10" },
  download: { label: "Téléchargement", icon: Download, color: "text-primary bg-primary/10" },
  share: { label: "Partage", icon: Share2, color: "text-chart-5 bg-chart-5/10" },
  login: { label: "Connexion", icon: LogIn, color: "text-success bg-success/10" },
};

const events = [
  { t: "10:42:18", d: "2026-07-02", user: "Sophie Martin", ip: "10.0.4.12", action: "download" as Action, target: "DOC-10428 · Facture Orange", hash: "0x8f3a…c21b" },
  { t: "10:38:04", d: "2026-07-02", user: "Karim Benali", ip: "10.0.4.24", action: "edit" as Action, target: "DOC-10427 · Contrat cadre Dupont", hash: "0x2d1c…a887" },
  { t: "10:15:52", d: "2026-07-02", user: "Amélie Rousseau", ip: "82.65.11.9", action: "share" as Action, target: "DOC-10426 · Rapport annuel 2025 → CAC", hash: "0xf12e…9c04" },
  { t: "09:52:11", d: "2026-07-02", user: "Julie Fabre", ip: "10.0.4.31", action: "view" as Action, target: "DOC-10420 · Contrat travail", hash: "0x774a…22bd" },
  { t: "09:44:00", d: "2026-07-02", user: "system", ip: "—", action: "delete" as Action, target: "DOC-09122 · Brouillon (règle rétention)", hash: "0xaa10…f0e2" },
  { t: "09:12:07", d: "2026-07-02", user: "Nadia Cheikh", ip: "10.0.4.44", action: "login" as Action, target: "Session SSO SAML", hash: "0x33c9…b1de" },
  { t: "23:58:41", d: "2026-07-01", user: "Sophie Martin", ip: "10.0.4.12", action: "view" as Action, target: "DOC-10417 · Facture EDF Lyon", hash: "0x91ee…4400" },
];

function AuditPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Sécurité"
        title="Audit & conformité"
        description="Journal immuable horodaté et signé cryptographiquement. Conforme RGPD, ISO 27001 et SOX."
        actions={
          <>
            <Badge variant="outline" className="gap-1.5 border-success/40 text-success"><Lock className="h-3 w-3" /> Intégrité vérifiée</Badge>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Exporter</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Événements / 24 h", v: "8 421" },
            { l: "Utilisateurs actifs", v: "22" },
            { l: "Alertes sécurité", v: "0", c: "text-success" },
            { l: "Hachages vérifiés", v: "100 %", c: "text-success" },
          ].map((k) => (
            <Card key={k.l}><CardContent className="p-4">
              <div className="text-xs text-muted-foreground">{k.l}</div>
              <div className={`mt-1 text-2xl font-semibold ${k.c ?? ""}`}>{k.v}</div>
            </CardContent></Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Filtrer par utilisateur, IP, document…" className="pl-8" />
              </div>
              {(Object.keys(actionMeta) as Action[]).map((a) => (
                <Badge key={a} variant="outline" className="cursor-pointer gap-1 hover:bg-muted">
                  {(() => { const I = actionMeta[a].icon; return <I className="h-3 w-3" />; })()}
                  {actionMeta[a].label}
                </Badge>
              ))}
              <Button variant="outline" size="sm"><Filter className="h-4 w-4" /> Plus</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" />
              <div className="text-sm font-semibold">Timeline des événements</div>
              <Badge variant="secondary" className="ml-auto text-[10px]">Chaîne signée SHA-256</Badge>
            </div>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
              <div className="space-y-4">
                {events.map((e, i) => {
                  const meta = actionMeta[e.action];
                  const Icon = meta.icon;
                  return (
                    <div key={i} className="relative flex gap-4 pl-10">
                      <div className={`absolute left-1.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-background ${meta.color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                      <div className="flex-1 rounded-lg border bg-card p-3 text-sm">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium">{e.user}</span>
                          <span className="text-muted-foreground">a effectué une</span>
                          <Badge variant="outline" className={meta.color}>{meta.label}</Badge>
                          <span className="text-muted-foreground">sur</span>
                          <span className="font-medium text-foreground">{e.target}</span>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                          <span>{e.d} · {e.t}</span>
                          <span>IP {e.ip}</span>
                          <Shield className="h-3 w-3 text-success" />
                          <span className="font-mono">{e.hash}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}