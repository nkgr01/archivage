import { createFileRoute } from "@tanstack/react-router";
import { Settings, Database, Key, Download, Palette, Bell, Shield, Save } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Paramètres — ArchiveSafe Enterprise" },
      { name: "description", content: "Configuration générale, stockage, API et sauvegardes." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Configuration"
        title="Paramètres système & sauvegarde"
        description="Ajustez le comportement global, gérez vos clés API et planifiez vos sauvegardes."
        actions={<Button size="sm"><Save className="h-4 w-4" /> Enregistrer</Button>}
      />

      <div className="px-6 py-6">
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general"><Settings className="h-3.5 w-3.5" /> Général</TabsTrigger>
            <TabsTrigger value="storage"><Database className="h-3.5 w-3.5" /> Stockage</TabsTrigger>
            <TabsTrigger value="api"><Key className="h-3.5 w-3.5" /> API</TabsTrigger>
            <TabsTrigger value="backup"><Download className="h-3.5 w-3.5" /> Sauvegarde</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="grid gap-4 md:grid-cols-2">
            <Card><CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold"><Palette className="h-4 w-4" /> Apparence</div>
              <div>
                <label className="text-xs font-medium">Thème par défaut</label>
                <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option>Système</option><option>Clair</option><option>Sombre</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Langue</label>
                <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                  <option>Français</option><option>English</option><option>Deutsch</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium">Fuseau horaire</label>
                <Input defaultValue="Europe/Paris (UTC+2)" className="mt-1" />
              </div>
            </CardContent></Card>

            <Card><CardContent className="space-y-3 p-6">
              <div className="flex items-center gap-2 text-sm font-semibold"><Bell className="h-4 w-4" /> Notifications</div>
              {[
                ["Nouveau document uploadé", true],
                ["Fin de workflow", true],
                ["Erreur OCR", true],
                ["Résumé quotidien par email", false],
                ["Alertes sécurité (SMS)", true],
              ].map(([l, v]) => (
                <div key={l as string} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                  <span>{l}</span><Switch defaultChecked={v as boolean} />
                </div>
              ))}
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="storage">
            <Card><CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Database className="h-4 w-4" /> Utilisation du stockage</div>
              <div className="mb-1 flex justify-between text-sm"><span>124 Go / 200 Go</span><span className="font-medium text-primary">62 %</span></div>
              <div className="h-3 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-info" style={{ width: "62%" }} />
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  { l: "Documents", v: "98 Go" }, { l: "Miniatures & OCR", v: "18 Go" }, { l: "Sauvegardes", v: "8 Go" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg border p-4">
                    <div className="text-xs text-muted-foreground">{s.l}</div>
                    <div className="mt-1 text-xl font-semibold">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <div className="text-sm font-medium">Provider de stockage</div>
                    <div className="text-xs text-muted-foreground">S3-compatible · eu-west-3 (Paris)</div>
                  </div>
                  <Badge className="bg-success/15 text-success">Chiffré AES-256</Badge>
                </div>
              </div>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="api">
            <Card><CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Key className="h-4 w-4" /> Clés API</div>
              <div className="space-y-3">
                {[
                  { name: "Production Laravel", key: "sk_live_••••••••••4a2c", created: "12/06/2026" },
                  { name: "Intégration Chorus Pro", key: "sk_live_••••••••••7f11", created: "02/05/2026" },
                  { name: "Sandbox", key: "sk_test_••••••••••9b8e", created: "01/03/2026" },
                ].map((k) => (
                  <div key={k.name} className="flex items-center gap-3 rounded-lg border p-3">
                    <Shield className="h-4 w-4 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{k.name}</div>
                      <code className="text-xs text-muted-foreground">{k.key}</code>
                    </div>
                    <div className="text-xs text-muted-foreground">créée le {k.created}</div>
                    <Button size="sm" variant="outline">Régénérer</Button>
                  </div>
                ))}
              </div>
              <Button size="sm" className="mt-4"><Key className="h-4 w-4" /> Nouvelle clé API</Button>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="backup">
            <Card><CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold"><Download className="h-4 w-4" /> Sauvegardes automatiques</div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Fréquence</div>
                  <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option>Quotidienne (02:00)</option><option>Hebdomadaire</option><option>Toutes les heures</option>
                  </select>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-xs text-muted-foreground">Rétention</div>
                  <select className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm">
                    <option>30 sauvegardes</option><option>90 jours</option><option>Illimité</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {[
                  { d: "02/07/2026 02:00", size: "12,4 Go", ok: true },
                  { d: "01/07/2026 02:00", size: "12,3 Go", ok: true },
                  { d: "30/06/2026 02:00", size: "12,1 Go", ok: true },
                  { d: "29/06/2026 02:00", size: "11,9 Go", ok: true },
                ].map((b) => (
                  <div key={b.d} className="flex items-center justify-between rounded border p-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-success/15 text-success">OK</Badge>
                      <span>{b.d}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{b.size}</span>
                      <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5" /> Restaurer</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}