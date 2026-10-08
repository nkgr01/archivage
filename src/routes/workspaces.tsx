import { createFileRoute } from "@tanstack/react-router";
import { Building2, Check, Plus, Users, FileText, HardDrive, Globe } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/workspaces")({
  head: () => ({
    meta: [
      { title: "Espaces de travail — ArchiveSafe Enterprise" },
      { name: "description", content: "Basculez entre vos filiales et entités juridiques." },
    ],
  }),
  component: WorkspacesPage,
});

const workspaces = [
  { id: "acme-fr", name: "Acme Corp. France", country: "🇫🇷 France", plan: "Enterprise", docs: "12,4 k", members: 24, storage: "124 / 200 Go", color: "#5B5FE9", current: true },
  { id: "acme-de", name: "Acme GmbH", country: "🇩🇪 Allemagne", plan: "Enterprise", docs: "8,1 k", members: 18, storage: "84 / 200 Go", color: "#10B981" },
  { id: "acme-us", name: "Acme Inc. US", country: "🇺🇸 États-Unis", plan: "Enterprise+", docs: "22,8 k", members: 41, storage: "312 / 500 Go", color: "#F59E0B" },
  { id: "acme-lab", name: "Acme Labs (R&D)", country: "🇫🇷 France", plan: "Business", docs: "3,2 k", members: 9, storage: "42 / 100 Go", color: "#EC4899" },
];

function WorkspacesPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Multi-tenancy"
        title="Espaces de travail"
        description="Chaque entité juridique dispose de son propre stockage isolé, ses règles et sa base OCR. Les données ne sont jamais mélangées."
        actions={<Button size="sm"><Plus className="h-4 w-4" /> Nouvel espace</Button>}
      />

      <div className="space-y-6 px-6 py-6">
        <Card className="glass border-primary/20">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground text-lg font-bold shadow">A</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="text-base font-semibold">Acme Corp. France</div>
                <Badge className="bg-success/15 text-success">Espace actif</Badge>
              </div>
              <div className="text-xs text-muted-foreground">acme-fr.archivesafe.com · Fuseau Europe/Paris · Résidence des données : 🇫🇷 France</div>
            </div>
            <Button variant="outline" size="sm">Paramètres de l'espace</Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {workspaces.map((w) => (
            <Card key={w.id} className={`transition ${w.current ? "border-primary shadow-md" : "hover:border-primary/40"}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white shadow"
                    style={{ background: w.color }}
                  >{w.name[0]}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="truncate text-sm font-semibold">{w.name}</div>
                      {w.current && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" /> {w.country} · <Badge variant="outline" className="text-[10px]">{w.plan}</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-lg border p-2">
                    <div className="flex items-center gap-1 text-muted-foreground"><FileText className="h-3 w-3" /> Docs</div>
                    <div className="mt-0.5 font-semibold text-foreground">{w.docs}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> Membres</div>
                    <div className="mt-0.5 font-semibold text-foreground">{w.members}</div>
                  </div>
                  <div className="rounded-lg border p-2">
                    <div className="flex items-center gap-1 text-muted-foreground"><HardDrive className="h-3 w-3" /> Stockage</div>
                    <div className="mt-0.5 font-semibold text-foreground">{w.storage}</div>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full"
                  size="sm"
                  variant={w.current ? "secondary" : "default"}
                  disabled={w.current}
                >
                  <Building2 className="h-4 w-4" />
                  {w.current ? "Espace en cours" : "Basculer vers cet espace"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}