import { createFileRoute } from "@tanstack/react-router";
import { Cloud, Mail, Scan, Webhook, Search, CheckCircle2, Plus, ExternalLink } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    meta: [
      { title: "Intégrations — ArchiveSafe Enterprise" },
      { name: "description", content: "Connectez ArchiveSafe à vos outils : cloud, email, scanners, API." },
    ],
  }),
  component: IntegrationsPage,
});

type Integration = {
  name: string; cat: string; desc: string; color: string; badge: string;
  connected: boolean; lastSync?: string;
};

const items: Integration[] = [
  { name: "Google Drive", cat: "Cloud", desc: "Synchronisez vos fichiers Drive.", color: "#0F9D58", badge: "GD", connected: true, lastSync: "il y a 4 min" },
  { name: "Dropbox", cat: "Cloud", desc: "Import bidirectionnel Dropbox Business.", color: "#0061FF", badge: "DB", connected: true, lastSync: "il y a 12 min" },
  { name: "OneDrive", cat: "Cloud", desc: "SharePoint et OneDrive Enterprise.", color: "#0364B8", badge: "OD", connected: false },
  { name: "Email IMAP", cat: "Email", desc: "Importez les pièces jointes automatiquement.", color: "#EA4335", badge: "@", connected: true, lastSync: "il y a 1 min" },
  { name: "Microsoft 365", cat: "Email", desc: "Outlook + Teams + SharePoint.", color: "#D83B01", badge: "MS", connected: false },
  { name: "Scanner réseau", cat: "Scanner", desc: "Ricoh, Xerox, Canon (protocole SMB).", color: "#6B7280", badge: "SC", connected: true, lastSync: "il y a 34 s" },
  { name: "Webhooks", cat: "API", desc: "POST temps réel sur événements.", color: "#8B5CF6", badge: "WH", connected: true, lastSync: "streaming" },
  { name: "Zapier", cat: "API", desc: "6 000+ apps sans code.", color: "#FF4A00", badge: "ZP", connected: false },
  { name: "Slack", cat: "Notification", desc: "Notifications sur canaux Slack.", color: "#4A154B", badge: "SL", connected: true, lastSync: "il y a 8 min" },
  { name: "DocuSign", cat: "Signature", desc: "Import/export enveloppes DocuSign.", color: "#FFCC22", badge: "DS", connected: false },
  { name: "Chorus Pro", cat: "Facturation", desc: "Dépôt automatique secteur public FR.", color: "#000091", badge: "CP", connected: true, lastSync: "il y a 2 h" },
  { name: "SAP Ariba", cat: "ERP", desc: "Rapprochement factures ↔ commandes.", color: "#0FAAFF", badge: "SA", connected: false },
];

function IntegrationsPage() {
  const active = items.filter((i) => i.connected).length;
  return (
    <AppShell>
      <PageHeader
        eyebrow="Écosystème"
        title="Connecteurs & intégrations"
        description={`${active} connexions actives sur ${items.length} intégrations disponibles.`}
        actions={
          <>
            <Button variant="outline" size="sm"><Webhook className="h-4 w-4" /> Créer un webhook</Button>
            <Button size="sm"><Plus className="h-4 w-4" /> Demander une intégration</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Rechercher une intégration…" className="pl-8" />
          </div>
          {["Toutes", "Cloud", "Email", "Scanner", "API", "Notification", "Signature", "ERP"].map((c, i) => (
            <Badge key={c} variant={i === 0 ? "default" : "outline"} className="cursor-pointer">{c}</Badge>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <Card key={it.name} className="group transition hover:border-primary/40 hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm"
                      style={{ background: it.color }}
                    >{it.badge}</div>
                    <div>
                      <div className="text-sm font-semibold">{it.name}</div>
                      <Badge variant="outline" className="mt-0.5 text-[10px]">{it.cat}</Badge>
                    </div>
                  </div>
                  {it.connected ? (
                    <Badge className="gap-1 bg-success/15 text-success hover:bg-success/20">
                      <CheckCircle2 className="h-3 w-3" /> Connecté
                    </Badge>
                  ) : (
                    <Badge variant="outline">Disponible</Badge>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">{it.desc}</p>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-[11px] text-muted-foreground">
                    {it.connected ? `Sync : ${it.lastSync}` : "Non configuré"}
                  </div>
                  <Button size="sm" variant={it.connected ? "outline" : "default"} className="h-7 text-xs">
                    {it.connected ? "Configurer" : "Connecter"}
                    {!it.connected && <ExternalLink className="h-3 w-3" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}