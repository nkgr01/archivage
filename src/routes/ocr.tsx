import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ScanText, Sparkles, CheckCircle2, AlertCircle, Loader2, RefreshCcw,
  Download, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight,
  FileText, Calendar, Building2, Euro, Tag as TagIcon, User, Hash,
  Wand2, Save, Edit3, Copy, Eye, Languages, ListChecks, Highlighter,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/ocr")({
  head: () => ({
    meta: [
      { title: "OCR & Extraction IA — ArchiveSafe" },
      { name: "description", content: "Traitement OCR et extraction automatique de métadonnées par IA avec indicateur de confiance." },
    ],
  }),
  component: OcrPage,
});

type FieldKey = "title" | "date" | "issuer" | "amount" | "reference" | "tva" | "dueDate";

interface ExtractedField {
  key: FieldKey;
  label: string;
  value: string;
  confidence: number;
  icon: typeof FileText;
}

const initialFields: ExtractedField[] = [
  { key: "title", label: "Titre du document", value: "Facture Orange Business — Novembre 2025", confidence: 98, icon: FileText },
  { key: "issuer", label: "Émetteur", value: "Orange SA", confidence: 96, icon: Building2 },
  { key: "date", label: "Date d'émission", value: "28/11/2025", confidence: 99, icon: Calendar },
  { key: "dueDate", label: "Date d'échéance", value: "15/12/2025", confidence: 92, icon: Calendar },
  { key: "amount", label: "Montant TTC", value: "1 284,50 €", confidence: 97, icon: Euro },
  { key: "tva", label: "TVA (20%)", value: "214,08 €", confidence: 88, icon: Euro },
  { key: "reference", label: "N° de facture", value: "FR-2025-118842", confidence: 94, icon: Hash },
];

const suggestedTags = [
  { label: "facture", conf: 99 },
  { label: "télécom", conf: 96 },
  { label: "orange", conf: 95 },
  { label: "2025", conf: 91 },
  { label: "urgent", conf: 72 },
];

const queue = [
  { id: "DOC-10428", name: "Facture Orange — Nov. 2025", status: "active" as const, progress: 100 },
  { id: "DOC-10429", name: "Contrat cadre — Dupont SA.pdf", status: "processing" as const, progress: 64 },
  { id: "DOC-10430", name: "Bon de livraison BL-88214.jpg", status: "queued" as const, progress: 0 },
  { id: "DOC-10431", name: "Scan courrier DGCCRF.pdf", status: "queued" as const, progress: 0 },
  { id: "DOC-10432", name: "Rapport audit Q2.pdf", status: "done" as const, progress: 100 },
  { id: "DOC-10433", name: "CV Camille Petit.pdf", status: "error" as const, progress: 42 },
];

function confidenceTone(c: number) {
  if (c >= 95) return { text: "text-success", bg: "bg-success/10", border: "border-success/30", ring: "stroke-success", label: "Excellente" };
  if (c >= 85) return { text: "text-info", bg: "bg-info/10", border: "border-info/30", ring: "stroke-info", label: "Bonne" };
  if (c >= 70) return { text: "text-warning", bg: "bg-warning/10", border: "border-warning/30", ring: "stroke-warning", label: "Moyenne" };
  return { text: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", ring: "stroke-destructive", label: "Faible" };
}

function ConfidenceRing({ value, size = 44 }: { value: number; size?: number }) {
  const tone = confidenceTone(value);
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={3} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={3}
          strokeLinecap="round"
          className={`fill-none ${tone.ring} transition-all`}
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-semibold ${tone.text}`}>
        {value}%
      </span>
    </div>
  );
}

function OcrPage() {
  const [fields, setFields] = useState(initialFields);
  const [editing, setEditing] = useState<FieldKey | null>(null);
  const [validated, setValidated] = useState(false);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const overall = Math.round(fields.reduce((a, f) => a + f.confidence, 0) / fields.length);
  const lowConfidence = fields.filter((f) => f.confidence < 90).length;

  const updateField = (key: FieldKey, value: string) => {
    setFields((prev) => prev.map((f) => (f.key === key ? { ...f, value, confidence: 100 } : f)));
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-4 p-4 lg:p-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ScanText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold tracking-tight">OCR & Extraction IA</h1>
                <Badge variant="outline" className="h-5 gap-1 border-success/30 bg-success/10 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> Modèle v4.2 actif
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                DOC-10428 · Facture Orange — Novembre 2025 · Analysé en 2,4 s par Tesseract + IA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <RefreshCcw className="h-3.5 w-3.5" /> Relancer OCR
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Wand2 className="h-3.5 w-3.5" /> Re-extraire IA
            </Button>
            <Button
              size="sm"
              className="gap-2"
              variant={validated ? "secondary" : "default"}
              onClick={() => setValidated(true)}
            >
              {validated ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {validated ? "Extraction validée" : "Valider l'extraction"}
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid gap-3 md:grid-cols-4">
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <ConfidenceRing value={overall} size={52} />
              <div>
                <div className="text-xs text-muted-foreground">Confiance globale</div>
                <div className="text-sm font-semibold">{confidenceTone(overall).label}</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-info/10 text-info">
                <ListChecks className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold leading-none">{fields.length}</div>
                <div className="text-xs text-muted-foreground">Champs extraits</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10 text-warning">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="text-lg font-semibold leading-none">{lowConfidence}</div>
                <div className="text-xs text-muted-foreground">À vérifier (&lt; 90%)</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Languages className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold leading-none">Français · 99%</div>
                <div className="text-xs text-muted-foreground">Langue détectée</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main split */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_420px] xl:grid-cols-[minmax(0,1fr)_460px]">
          {/* Left: preview */}
          <Card className="overflow-hidden shadow-none">
            <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-2">
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs tabular-nums text-muted-foreground">Page {page} / 3</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setPage((p) => Math.min(3, p + 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{zoom}%</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
                  <Highlighter className="h-3.5 w-3.5" /> Zones détectées
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Maximize2 className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="h-4 w-4" /></Button>
              </div>
            </div>

            <ScrollArea className="h-[720px] bg-[radial-gradient(circle_at_1px_1px,hsl(var(--border))_1px,transparent_0)] bg-[length:16px_16px]">
              <div className="flex justify-center p-6">
                <div
                  className="relative rounded-md border bg-white text-slate-900 shadow-lg transition-transform"
                  style={{ width: 560, minHeight: 780, transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                >
                  {/* Fake invoice */}
                  <div className="p-10">
                    <div className="flex items-start justify-between border-b pb-6">
                      <div>
                        <div className="text-2xl font-bold tracking-tight text-orange-600">orange</div>
                        <div className="mt-1 text-[11px] text-slate-500">Orange SA · 111 quai du Président Roosevelt · 92130 Issy-les-Moulineaux</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs uppercase tracking-wider text-slate-400">Facture</div>
                        <div className="mt-1 text-sm font-semibold">N° FR-2025-118842</div>
                        <div className="text-[11px] text-slate-500">Émise le 28/11/2025</div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6 text-[11px]">
                      <div>
                        <div className="mb-1 font-semibold text-slate-500">Facturé à</div>
                        <div className="font-medium">Acme Corp SAS</div>
                        <div className="text-slate-500">42 rue de la Paix<br />75002 Paris — France</div>
                      </div>
                      <div>
                        <div className="mb-1 font-semibold text-slate-500">Échéance</div>
                        <div className="font-medium">15/12/2025</div>
                        <div className="text-slate-500">Prélèvement automatique</div>
                      </div>
                    </div>

                    <table className="mt-8 w-full text-[11px]">
                      <thead>
                        <tr className="border-b text-left text-slate-500">
                          <th className="py-2 font-medium">Désignation</th>
                          <th className="py-2 text-right font-medium">Qté</th>
                          <th className="py-2 text-right font-medium">P.U. HT</th>
                          <th className="py-2 text-right font-medium">Total HT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr><td className="py-2">Forfait Pro Business Illimité</td><td className="py-2 text-right">24</td><td className="py-2 text-right">39,90</td><td className="py-2 text-right">957,60</td></tr>
                        <tr><td className="py-2">Fibre entreprise 1 Gbps</td><td className="py-2 text-right">1</td><td className="py-2 text-right">89,00</td><td className="py-2 text-right">89,00</td></tr>
                        <tr><td className="py-2">Options sécurité avancée</td><td className="py-2 text-right">1</td><td className="py-2 text-right">23,82</td><td className="py-2 text-right">23,82</td></tr>
                      </tbody>
                    </table>

                    <div className="mt-6 flex justify-end">
                      <div className="w-56 space-y-1 text-[11px]">
                        <div className="flex justify-between"><span className="text-slate-500">Total HT</span><span>1 070,42 €</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">TVA 20%</span><span>214,08 €</span></div>
                        <div className="flex justify-between border-t pt-1 text-sm font-semibold"><span>Total TTC</span><span>1 284,50 €</span></div>
                      </div>
                    </div>
                  </div>

                  {/* AI detection overlays */}
                  <div className="pointer-events-none absolute left-10 top-[92px] h-6 w-52 rounded border-2 border-success/70 bg-success/10">
                    <span className="absolute -top-4 left-0 rounded-t bg-success px-1 py-0.5 text-[9px] font-semibold text-white">Émetteur · 96%</span>
                  </div>
                  <div className="pointer-events-none absolute right-10 top-[92px] h-6 w-40 rounded border-2 border-success/70 bg-success/10">
                    <span className="absolute -top-4 left-0 rounded-t bg-success px-1 py-0.5 text-[9px] font-semibold text-white">N° facture · 94%</span>
                  </div>
                  <div className="pointer-events-none absolute right-10 top-[130px] h-4 w-24 rounded border-2 border-success/70 bg-success/10">
                    <span className="absolute -top-4 left-0 rounded-t bg-success px-1 py-0.5 text-[9px] font-semibold text-white">Date · 99%</span>
                  </div>
                  <div className="pointer-events-none absolute right-10 bottom-[112px] h-5 w-24 rounded border-2 border-warning/70 bg-warning/10">
                    <span className="absolute -top-4 left-0 rounded-t bg-warning px-1 py-0.5 text-[9px] font-semibold text-white">TVA · 88%</span>
                  </div>
                  <div className="pointer-events-none absolute right-10 bottom-[76px] h-6 w-28 rounded border-2 border-success/70 bg-success/10">
                    <span className="absolute -top-4 left-0 rounded-t bg-success px-1 py-0.5 text-[9px] font-semibold text-white">Montant · 97%</span>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </Card>

          {/* Right: extraction */}
          <div className="flex flex-col gap-4">
            <Card className="shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Métadonnées extraites</CardTitle>
                </div>
                <Badge variant="outline" className="h-5 text-[10px]">Auto-IA</Badge>
              </CardHeader>
              <CardContent className="space-y-2.5 pt-0">
                {fields.map((f) => {
                  const tone = confidenceTone(f.confidence);
                  const isEditing = editing === f.key;
                  const Icon = f.icon;
                  return (
                    <div
                      key={f.key}
                      className={`group rounded-lg border p-2.5 transition-colors ${tone.border} ${isEditing ? "bg-muted/40" : "bg-card hover:bg-muted/30"}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <Label className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                          <Icon className="h-3 w-3" /> {f.label}
                        </Label>
                        <div className="flex items-center gap-1.5">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${tone.bg} ${tone.text}`}>
                            {f.confidence}%
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => setEditing(isEditing ? null : f.key)}
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {isEditing ? (
                        <div className="mt-1.5 flex gap-1.5">
                          <Input
                            autoFocus
                            defaultValue={f.value}
                            className="h-8 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                updateField(f.key, (e.target as HTMLInputElement).value);
                                setEditing(null);
                              }
                              if (e.key === "Escape") setEditing(null);
                            }}
                          />
                          <Button size="sm" className="h-8 px-2" onClick={() => setEditing(null)}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="mt-0.5 text-sm font-medium tabular-nums">{f.value}</div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <TagIcon className="h-4 w-4 text-primary" />
                  <CardTitle className="text-sm">Tags suggérés</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px]"><Wand2 className="h-3 w-3" />Régénérer</Button>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTags.map((t) => {
                    const tone = confidenceTone(t.conf);
                    return (
                      <button
                        key={t.label}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${tone.border} ${tone.bg} hover:brightness-95`}
                      >
                        <span>#{t.label}</span>
                        <span className={`text-[10px] ${tone.text}`}>{t.conf}%</span>
                      </button>
                    );
                  })}
                  <button className="flex items-center gap-1 rounded-full border border-dashed px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
                    + Ajouter
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <Tabs defaultValue="summary">
                <CardHeader className="pb-2">
                  <TabsList className="grid h-8 w-full grid-cols-3">
                    <TabsTrigger value="summary" className="text-xs">Résumé IA</TabsTrigger>
                    <TabsTrigger value="text" className="text-xs">Texte OCR</TabsTrigger>
                    <TabsTrigger value="queue" className="text-xs">File</TabsTrigger>
                  </TabsList>
                </CardHeader>
                <CardContent className="pt-0">
                  <TabsContent value="summary" className="mt-0 space-y-2">
                    <div className="rounded-lg border bg-gradient-to-br from-primary-soft/60 to-transparent p-3">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                        <Sparkles className="h-3 w-3" /> Synthèse générée
                      </div>
                      <p className="text-xs leading-relaxed text-foreground/80">
                        Facture mensuelle d'Orange SA d'un montant de <b>1 284,50 € TTC</b>, couvrant 24 forfaits Pro Business,
                        une ligne fibre 1 Gbps et des options de sécurité. Échéance au <b>15/12/2025</b>, prélèvement automatique.
                        Aucun litige détecté ; ligne de TVA cohérente avec les précédentes factures Orange.
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Généré par ArchiveSafe IA · GPT-class</span>
                      <Button variant="ghost" size="sm" className="h-6 gap-1 text-[11px]"><Copy className="h-3 w-3" />Copier</Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="text" className="mt-0">
                    <Textarea
                      readOnly
                      className="h-40 resize-none font-mono text-[11px] leading-relaxed"
                      defaultValue={`ORANGE SA\n111 quai du Président Roosevelt\n92130 Issy-les-Moulineaux\n\nFACTURE N° FR-2025-118842\nÉmise le 28/11/2025 — Échéance 15/12/2025\n\nFacturé à: Acme Corp SAS, 42 rue de la Paix, 75002 Paris\n\nForfait Pro Business Illimité   24   39,90   957,60\nFibre entreprise 1 Gbps          1   89,00    89,00\nOptions sécurité avancée         1   23,82    23,82\n\nTotal HT: 1 070,42 €\nTVA 20%:    214,08 €\nTotal TTC: 1 284,50 €`}
                    />
                  </TabsContent>
                  <TabsContent value="queue" className="mt-0">
                    <ScrollArea className="h-48">
                      <div className="space-y-1.5 pr-2">
                        {queue.map((q) => (
                          <div key={q.id} className={`rounded-md border p-2 ${q.status === "active" ? "border-primary/40 bg-primary/5" : ""}`}>
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                                <span className="truncate text-xs font-medium">{q.name}</span>
                              </div>
                              <QueueBadge status={q.status} />
                            </div>
                            {q.status === "processing" && (
                              <Progress value={q.progress} className="mt-2 h-1" />
                            )}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </div>

        {/* Validation footer */}
        <Card className={`shadow-none transition-colors ${validated ? "border-success/40 bg-success/5" : "border-primary/30 bg-primary/5"}`}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">SM</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-medium">
                  {validated ? "Extraction validée par Sophie Martin" : "Prêt pour la validation manuelle"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {validated
                    ? "Document indexé et archivé — workflow comptabilité déclenché."
                    : `${lowConfidence} champ(s) sous 90% de confiance — vérifiez avant validation.`}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2"><Eye className="h-3.5 w-3.5" /> Comparer versions</Button>
              <Button variant="outline" size="sm" className="gap-2"><User className="h-3.5 w-3.5" /> Assigner un relecteur</Button>
              <Button
                size="sm"
                className="gap-2"
                variant={validated ? "secondary" : "default"}
                onClick={() => setValidated((v) => !v)}
              >
                {validated ? (
                  <><RefreshCcw className="h-3.5 w-3.5" /> Annuler la validation</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" /> Valider l'extraction</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function QueueBadge({ status }: { status: "active" | "processing" | "queued" | "done" | "error" }) {
  const map = {
    active:     { label: "En cours",  cls: "bg-primary/10 text-primary border-primary/30", icon: Loader2, spin: true },
    processing: { label: "OCR…",       cls: "bg-info/10 text-info border-info/30",           icon: Loader2, spin: true },
    queued:     { label: "En file",    cls: "bg-muted text-muted-foreground border-border",  icon: null,    spin: false },
    done:       { label: "Terminé",    cls: "bg-success/10 text-success border-success/30",  icon: CheckCircle2, spin: false },
    error:      { label: "Erreur",     cls: "bg-destructive/10 text-destructive border-destructive/30", icon: AlertCircle, spin: false },
  } as const;
  const it = map[status];
  const Icon = it.icon;
  return (
    <Badge variant="outline" className={`h-5 gap-1 text-[10px] ${it.cls}`}>
      {Icon && <Icon className={`h-3 w-3 ${it.spin ? "animate-spin" : ""}`} />}
      {it.label}
    </Badge>
  );
}