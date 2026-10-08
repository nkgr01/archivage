import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, UserPlus, Shield, Search, MoreHorizontal, Check, Minus, Crown } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Utilisateurs & rôles — ArchiveSafe Enterprise" },
      { name: "description", content: "Gérez membres, invitations et permissions RBAC par dossier." },
    ],
  }),
  component: AdminPage,
});

const members = [
  { name: "Amélie Rousseau", email: "amelie@acme.fr", role: "Administrateur", dept: "Direction", status: "Actif", last: "il y a 3 min" },
  { name: "Sophie Martin", email: "sophie.m@acme.fr", role: "Éditeur", dept: "Comptabilité", status: "Actif", last: "il y a 12 min" },
  { name: "Karim Benali", email: "karim.b@acme.fr", role: "Éditeur", dept: "Juridique", status: "Actif", last: "il y a 1 h" },
  { name: "Julie Fabre", email: "julie.f@acme.fr", role: "Lecteur", dept: "RH", status: "Actif", last: "hier" },
  { name: "Marc Petit", email: "marc.p@acme.fr", role: "Lecteur", dept: "Logistique", status: "Inactif", last: "il y a 3 j" },
  { name: "Nadia Cheikh", email: "nadia.c@acme.fr", role: "Éditeur", dept: "IT", status: "Actif", last: "il y a 8 h" },
];

const invites = [
  { email: "paul.durand@acme.fr", role: "Lecteur", sent: "il y a 2 j", status: "En attente" },
  { email: "stagiaire@acme.fr", role: "Lecteur", sent: "il y a 5 j", status: "Expirée" },
];

const folders = ["Comptabilité", "Juridique", "RH", "IT", "Direction", "Logistique"];
const permissions = [
  { key: "view", label: "Consulter" },
  { key: "edit", label: "Modifier" },
  { key: "delete", label: "Supprimer" },
  { key: "share", label: "Partager" },
  { key: "admin", label: "Administrer" },
];

const grid: Record<string, Record<string, string[]>> = {
  Administrateur: Object.fromEntries(folders.map((f) => [f, ["view", "edit", "delete", "share", "admin"]])),
  Éditeur: Object.fromEntries(folders.map((f) => [f, ["view", "edit", "share"]])),
  Lecteur: Object.fromEntries(folders.map((f) => [f, ["view"]])),
};

const roleColor: Record<string, string> = {
  Administrateur: "bg-primary/15 text-primary",
  Éditeur: "bg-info/15 text-info",
  Lecteur: "bg-muted text-muted-foreground",
};

function AdminPage() {
  const [role, setRole] = useState<"Administrateur" | "Éditeur" | "Lecteur">("Éditeur");

  return (
    <AppShell>
      <PageHeader
        eyebrow="Administration"
        title="Utilisateurs & permissions (RBAC)"
        description="24 membres actifs sur 30 sièges. Contrôlez les accès par dossier avec une granularité fine."
        actions={
          <>
            <Button variant="outline" size="sm"><Shield className="h-4 w-4" /> SSO SAML</Button>
            <Button size="sm"><UserPlus className="h-4 w-4" /> Inviter</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Membres", v: "24 / 30", i: Users },
            { l: "Administrateurs", v: "3", i: Crown },
            { l: "Invitations", v: "2", i: UserPlus },
            { l: "Groupes", v: "8", i: Shield },
          ].map((k) => (
            <Card key={k.l}><CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <k.i className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground">{k.l}</div>
                <div className="text-lg font-semibold">{k.v}</div>
              </div>
            </CardContent></Card>
          ))}
        </div>

        <Tabs defaultValue="members">
          <TabsList>
            <TabsTrigger value="members">Membres</TabsTrigger>
            <TabsTrigger value="invites">Invitations</TabsTrigger>
            <TabsTrigger value="permissions">Grille de permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card><CardContent className="p-0">
              <div className="flex items-center gap-3 border-b p-4">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Rechercher un membre…" className="pl-8" />
                </div>
                <select className="rounded-md border bg-background px-3 py-2 text-sm">
                  <option>Tous les rôles</option>
                  <option>Administrateur</option><option>Éditeur</option><option>Lecteur</option>
                </select>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Membre</TableHead>
                    <TableHead>Département</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Dernière activité</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((m) => (
                    <TableRow key={m.email}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {m.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback></Avatar>
                          <div>
                            <div className="text-sm font-medium">{m.name}</div>
                            <div className="text-xs text-muted-foreground">{m.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{m.dept}</TableCell>
                      <TableCell><Badge className={roleColor[m.role]}>{m.role}</Badge></TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 text-xs ${m.status === "Actif" ? "text-success" : "text-muted-foreground"}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${m.status === "Actif" ? "bg-success" : "bg-muted-foreground"}`} />
                          {m.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.last}</TableCell>
                      <TableCell><Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="invites">
            <Card><CardContent className="p-0">
              <Table>
                <TableHeader><TableRow>
                  <TableHead>Email</TableHead><TableHead>Rôle</TableHead>
                  <TableHead>Envoyée</TableHead><TableHead>Statut</TableHead><TableHead></TableHead>
                </TableRow></TableHeader>
                <TableBody>
                  {invites.map((i) => (
                    <TableRow key={i.email}>
                      <TableCell className="font-medium">{i.email}</TableCell>
                      <TableCell><Badge className={roleColor[i.role]}>{i.role}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{i.sent}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={i.status === "Expirée" ? "text-destructive" : "text-warning"}>{i.status}</Badge>
                      </TableCell>
                      <TableCell><Button size="sm" variant="outline">Renvoyer</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent></Card>
          </TabsContent>

          <TabsContent value="permissions">
            <Card><CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm font-medium">Rôle :</span>
                {(["Administrateur", "Éditeur", "Lecteur"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${role === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
                  >{r}</button>
                ))}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground">
                      <th className="p-2 text-left">Dossier</th>
                      {permissions.map((p) => <th key={p.key} className="p-2 text-center">{p.label}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {folders.map((f) => (
                      <tr key={f} className="border-b hover:bg-muted/30">
                        <td className="p-2 font-medium">{f}</td>
                        {permissions.map((p) => (
                          <td key={p.key} className="p-2 text-center">
                            {grid[role][f].includes(p.key)
                              ? <Check className="mx-auto h-4 w-4 text-success" />
                              : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" />}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}