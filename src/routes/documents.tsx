import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Upload, Search, Filter, LayoutGrid, List, Star, MoreHorizontal,
  FileText, Download, Trash2, Share2, Eye, Sparkles, Tag as TagIcon,
  Users, Building2, Calendar, ChevronRight, Plus, CheckCircle2,
  Loader2, AlertCircle, Clock, X,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { documents, tags, correspondents, type DocStatus, type MockDocument } from "@/lib/mock-data";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Documents — ArchiveSafe Enterprise" },
      { name: "description", content: "Explorez, filtrez et gérez tous vos documents archivés." },
    ],
  }),
  component: DocumentsPage,
});

const statusMap: Record<DocStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  traité: { label: "Traité", className: "text-success bg-success/10 border-success/20", icon: CheckCircle2 },
  en_cours: { label: "En cours", className: "text-info bg-info/10 border-info/20", icon: Loader2 },
  en_attente: { label: "En attente", className: "text-warning bg-warning/15 border-warning/25", icon: Clock },
  erreur: { label: "Erreur", className: "text-destructive bg-destructive/10 border-destructive/20", icon: AlertCircle },
};

const typeColor: Record<string, string> = {
  Facture: "bg-[var(--chart-1)]/15 text-[var(--chart-1)]",
  Contrat: "bg-[var(--chart-2)]/15 text-[var(--chart-2)]",
  Rapport: "bg-[var(--chart-3)]/15 text-[var(--chart-3)]",
  Courrier: "bg-[var(--chart-4)]/15 text-[var(--chart-4)]",
  CV: "bg-[var(--chart-5)]/15 text-[var(--chart-5)]",
  "Bon livraison": "bg-muted text-foreground",
  Certificat: "bg-primary/10 text-primary",
};

function DocumentsPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [selected, setSelected] = useState<string[]>([]);
  const [preview, setPreview] = useState<MockDocument | null>(documents[0]);

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <AppShell>
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Filters sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-background p-4 xl:block">
          <div className="mb-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vues rapides</h3>
            <div className="mt-2 space-y-0.5">
              {[
                { label: "Tous les documents", count: 12480, active: true },
                { label: "Favoris", count: 87 },
                { label: "Récents", count: 148 },
                { label: "Partagés avec moi", count: 42 },
                { label: "Corbeille", count: 23 },
              ].map((v) => (
                <button
                  key={v.label}
                  className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm ${v.active ? "bg-primary/10 font-medium text-primary" : "hover:bg-muted"}`}
                >
                  <span>{v.label}</span>
                  <span className="text-[11px] text-muted-foreground tabular-nums">{v.count.toLocaleString("fr-FR")}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator className="my-3" />

          <FilterSection icon={TagIcon} title="Tags" onAdd>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge key={t.label} variant="secondary" className="cursor-pointer text-[11px] font-normal hover:bg-primary/15">
                  #{t.label} <span className="ml-1 text-muted-foreground">{t.count}</span>
                </Badge>
              ))}
            </div>
          </FilterSection>

          <FilterSection icon={Users} title="Correspondants" onAdd>
            <div className="space-y-0.5">
              {correspondents.map((c) => (
                <label key={c.name} className="flex items-center justify-between rounded px-1.5 py-1 text-sm hover:bg-muted">
                  <span className="flex items-center gap-2">
                    <Checkbox className="h-3.5 w-3.5" />
                    {c.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{c.count}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection icon={Building2} title="Départements">
            <div className="space-y-0.5">
              {["Comptabilité", "Juridique", "RH", "IT", "Direction"].map((d) => (
                <label key={d} className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted">
                  <Checkbox className="h-3.5 w-3.5" /> {d}
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection icon={Calendar} title="Période">
            <div className="space-y-0.5">
              {["Aujourd'hui", "7 derniers jours", "30 derniers jours", "Cette année", "Personnalisé…"].map((d) => (
                <label key={d} className="flex items-center gap-2 rounded px-1.5 py-1 text-sm hover:bg-muted">
                  <input type="radio" name="period" className="h-3 w-3 accent-primary" /> {d}
                </label>
              ))}
            </div>
          </FilterSection>
        </aside>

        {/* Center: list */}
        <section className="flex min-w-0 flex-1 flex-col">
          {/* Toolbar */}
          <div className="border-b bg-background p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Espace</span>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-foreground">Documents</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">Gestion documentaire</h1>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">12 480</span> documents · <span className="font-medium text-foreground">124 Go</span> utilisés
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5"><Sparkles className="h-3.5 w-3.5 text-primary" /> Recherche IA</Button>
                <Button size="sm" className="gap-1.5"><Upload className="h-3.5 w-3.5" /> Importer</Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="relative min-w-[240px] flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher dans les documents, contenu OCR, tags…" className="h-9 pl-9 bg-muted/40 border-transparent focus-visible:bg-background" />
              </div>
              <Tabs defaultValue="tous">
                <TabsList className="h-9">
                  <TabsTrigger value="tous" className="text-xs">Tous</TabsTrigger>
                  <TabsTrigger value="factures" className="text-xs">Factures</TabsTrigger>
                  <TabsTrigger value="contrats" className="text-xs">Contrats</TabsTrigger>
                  <TabsTrigger value="rapports" className="text-xs">Rapports</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" className="gap-1.5"><Filter className="h-3.5 w-3.5" /> Filtres</Button>
              <div className="flex overflow-hidden rounded-md border">
                <Button variant={view === "list" ? "secondary" : "ghost"} size="sm" className="rounded-none border-0 h-9 px-2.5" onClick={() => setView("list")}>
                  <List className="h-4 w-4" />
                </Button>
                <Button variant={view === "grid" ? "secondary" : "ghost"} size="sm" className="rounded-none border-0 h-9 px-2.5" onClick={() => setView("grid")}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Active filters chips */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Filtres actifs :</span>
              {["Type: Facture", "Département: Comptabilité", "Période: 30 derniers jours"].map((f) => (
                <Badge key={f} variant="outline" className="gap-1 pl-2 pr-1 text-xs font-normal">
                  {f}
                  <button className="rounded-full p-0.5 hover:bg-muted"><X className="h-3 w-3" /></button>
                </Badge>
              ))}
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">Effacer tout</Button>
            </div>
          </div>

          {/* Bulk actions bar */}
          {selected.length > 0 && (
            <div className="flex items-center gap-2 border-b bg-primary/5 px-4 py-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="font-medium">{selected.length} sélectionné(s)</span>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-8 gap-1.5"><Download className="h-3.5 w-3.5" /> Télécharger</Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5"><Share2 className="h-3.5 w-3.5" /> Partager</Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5"><TagIcon className="h-3.5 w-3.5" /> Tagger</Button>
                <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Supprimer</Button>
                <Button variant="ghost" size="sm" className="h-8" onClick={() => setSelected([])}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* List / grid */}
          <div className="flex-1 overflow-auto p-4">
            {view === "list" ? (
              <Card className="overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-10 pl-4">
                        <Checkbox
                          checked={selected.length === documents.length}
                          onCheckedChange={(c) => setSelected(c ? documents.map((d) => d.id) : [])}
                        />
                      </TableHead>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Auteur</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Modifié</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((d) => {
                      const status = statusMap[d.status];
                      const StatusIcon = status.icon;
                      const isSel = selected.includes(d.id);
                      const isPreview = preview?.id === d.id;
                      return (
                        <TableRow
                          key={d.id}
                          className={`cursor-pointer ${isPreview ? "bg-primary/5" : ""}`}
                          onClick={() => setPreview(d)}
                        >
                          <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isSel} onCheckedChange={() => toggle(d.id)} />
                          </TableCell>
                          <TableCell>
                            <Star className={`h-4 w-4 ${d.favorite ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-[9px] font-bold text-primary">PDF</div>
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium">{d.title}</div>
                                <div className="text-[11px] text-muted-foreground">{d.id} · {d.pages} pages · {d.size}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${typeColor[d.type]} border-0 font-normal`}>{d.type}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6"><AvatarFallback className="bg-muted text-[10px]">{d.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                              <span className="text-sm">{d.author}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{d.department}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {d.tags.slice(0, 2).map((t) => (
                                <Badge key={t} variant="outline" className="text-[10px] font-normal">#{t}</Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`gap-1 border ${status.className} font-normal`}>
                              <StatusIcon className={`h-3 w-3 ${d.status === "en_cours" ? "animate-spin" : ""}`} />
                              {status.label}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {new Date(d.updatedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-between border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                  <span>Affichage de <span className="font-medium text-foreground">1–12</span> sur <span className="font-medium text-foreground">12 480</span></span>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-7">Précédent</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 bg-primary text-primary-foreground hover:bg-primary/90">1</Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">2</Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">3</Button>
                    <Button variant="outline" size="sm" className="h-7">Suivant</Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {documents.map((d) => (
                  <Card
                    key={d.id}
                    className={`group cursor-pointer overflow-hidden transition-all hover:border-primary/40 hover:shadow-md ${preview?.id === d.id ? "border-primary/60 ring-1 ring-primary/30" : ""}`}
                    onClick={() => setPreview(d)}
                  >
                    <div className="relative flex h-32 items-center justify-center bg-gradient-to-br from-muted to-muted/40">
                      <FileText className="h-12 w-12 text-muted-foreground/40" />
                      <Star className={`absolute right-2 top-2 h-4 w-4 ${d.favorite ? "fill-warning text-warning" : "text-muted-foreground/40"}`} />
                      <Badge className={`absolute left-2 top-2 ${typeColor[d.type]} border-0 text-[10px] font-normal`}>{d.type}</Badge>
                    </div>
                    <CardContent className="p-3">
                      <div className="truncate text-sm font-medium">{d.title}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">{d.department} · {d.size}</div>
                      <div className="mt-2 flex items-center justify-between">
                        <Avatar className="h-5 w-5"><AvatarFallback className="bg-muted text-[9px]">{d.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback></Avatar>
                        <span className="text-[10px] text-muted-foreground">{new Date(d.updatedAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right: preview panel */}
        {preview && (
          <aside className="hidden w-80 shrink-0 border-l bg-background 2xl:block">
            <div className="flex items-center justify-between border-b p-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Aperçu</span>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPreview(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="flex h-52 items-center justify-center border-b bg-muted/30">
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-16 w-16 text-muted-foreground/40" />
                <Badge variant="outline" className="text-[10px]">Aperçu PDF</Badge>
              </div>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-sm font-semibold leading-snug">{preview.title}</h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{preview.id}</p>
              </div>

              <div className="flex gap-1.5">
                <Button size="sm" className="h-8 flex-1 gap-1.5"><Eye className="h-3.5 w-3.5" /> Ouvrir</Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Download className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0"><Share2 className="h-3.5 w-3.5" /></Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-semibold text-primary">Résumé IA</span>
                </div>
                <p className="text-xs leading-relaxed text-foreground/80">
                  Facture émise par Orange SA pour les services télécom de novembre 2025.
                  Montant total : <span className="font-semibold">1 284,50 €</span>. Échéance : <span className="font-semibold">15 décembre 2025</span>.
                </p>
                <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs text-primary">Voir l'analyse complète →</Button>
              </div>

              <div className="space-y-2">
                <MetaRow label="Type" value={<Badge className={`${typeColor[preview.type]} border-0 font-normal`}>{preview.type}</Badge>} />
                <MetaRow label="Auteur" value={preview.author} />
                <MetaRow label="Département" value={preview.department} />
                <MetaRow label="Taille" value={`${preview.size} · ${preview.pages} pages`} />
                <MetaRow label="Modifié" value={new Date(preview.updatedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} />
                <MetaRow
                  label="Statut"
                  value={
                    <Badge variant="outline" className={`gap-1 border ${statusMap[preview.status].className} font-normal`}>
                      {statusMap[preview.status].label}
                    </Badge>
                  }
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground">Tags</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="h-3 w-3" /></Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {preview.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px] font-normal">#{t}</Badge>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1.5 text-xs font-semibold text-muted-foreground">Documents liés</div>
                <div className="space-y-1">
                  {documents.slice(1, 3).map((d) => (
                    <div key={d.id} className="flex items-center gap-2 rounded border p-1.5 text-xs hover:bg-muted/50">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{d.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </AppShell>
  );
}

function FilterSection({
  title, icon: Icon, children, onAdd,
}: { title: string; icon: typeof TagIcon; children: React.ReactNode; onAdd?: boolean }) {
  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {title}
        </div>
        {onAdd && (
          <Button variant="ghost" size="icon" className="h-5 w-5"><Plus className="h-3 w-3" /></Button>
        )}
      </div>
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}