import { createFileRoute } from "@tanstack/react-router";
import { Share2, Link as LinkIcon, Copy, Lock, Calendar, Eye, Plus, Trash2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/sharing")({
  head: () => ({
    meta: [
      { title: "Partage externe — ArchiveSafe Enterprise" },
      { name: "description", content: "Créez des liens de partage sécurisés avec mot de passe et expiration." },
    ],
  }),
  component: SharingPage,
});

const links = [
  { doc: "Rapport annuel 2025", url: "as.link/x9K2p", views: 42, exp: "31/07/2026", pw: true, active: true },
  { doc: "Contrat cadre Dupont", url: "as.link/mQ8vT", views: 3, exp: "14/07/2026", pw: true, active: true },
  { doc: "Facture Orange nov.", url: "as.link/aB7nL", views: 128, exp: "expiré", pw: false, active: false },
  { doc: "Certificat ISO 27001", url: "as.link/rP4yU", views: 8, exp: "31/12/2026", pw: false, active: true },
];

function SharingPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Partage sécurisé"
        title="Liens de partage externes"
        description="Contrôlez qui accède à vos documents en dehors d'ArchiveSafe. Chaque accès est journalisé."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Nouveau lien</Button>}
      />
      <div className="space-y-6 px-6 py-6">
        <Card className="glass">
          <CardContent className="p-6">
            <div className="mb-4 text-sm font-semibold">Créer un lien de partage</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm"><Lock className="h-4 w-4 text-primary" /> Protéger par mot de passe</div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-primary" /> Expiration : 30 jours</div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm"><Eye className="h-4 w-4 text-primary" /> Lecture seule (bloque téléchargement)</div>
                <Switch />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm"><Share2 className="h-4 w-4 text-primary" /> Notification à chaque ouverture</div>
                <Switch defaultChecked />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <code className="flex-1 truncate text-xs">https://as.link/x9K2p — mot de passe : ••••••</code>
              <Button size="sm" variant="outline"><Copy className="h-3.5 w-3.5" /> Copier</Button>
            </div>
          </CardContent>
        </Card>

        <Card><CardContent className="p-0">
          <div className="border-b p-4 text-sm font-semibold">Liens actifs</div>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Document</TableHead><TableHead>Lien</TableHead>
              <TableHead>Sécurité</TableHead><TableHead>Vues</TableHead>
              <TableHead>Expiration</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {links.map((l) => (
                <TableRow key={l.url}>
                  <TableCell className="font-medium">{l.doc}</TableCell>
                  <TableCell><code className="text-xs">{l.url}</code></TableCell>
                  <TableCell>{l.pw
                    ? <Badge className="gap-1 bg-success/15 text-success"><Lock className="h-3 w-3" /> Protégé</Badge>
                    : <Badge variant="outline">Public</Badge>}</TableCell>
                  <TableCell>{l.views}</TableCell>
                  <TableCell><span className={l.exp === "expiré" ? "text-destructive" : ""}>{l.exp}</span></TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent></Card>
      </div>
    </AppShell>
  );
}