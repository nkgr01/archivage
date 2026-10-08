import { createFileRoute } from "@tanstack/react-router";
import { PenTool, Send, CheckCircle2, Clock, User, FileSignature, Download } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/signature")({
  head: () => ({
    meta: [
      { title: "Signature électronique — ArchiveSafe Enterprise" },
      { name: "description", content: "Signez et faites signer vos documents avec valeur légale eIDAS." },
    ],
  }),
  component: SignaturePage,
});

const signers = [
  { name: "Amélie Rousseau", role: "Direction Générale", status: "signed", at: "01/07/2026 14:22" },
  { name: "Karim Benali", role: "Directeur Juridique", status: "signed", at: "01/07/2026 15:41" },
  { name: "Jean Dupont", role: "Dupont SA · CEO", status: "pending", at: "en attente" },
  { name: "Marie Lefèvre", role: "Dupont SA · CFO", status: "pending", at: "en attente" },
];

function SignaturePage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Contractualisation"
        title="Signature électronique"
        description="Contrat cadre — Fournisseur Dupont SA · 24 pages · eIDAS Avancée"
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Télécharger</Button>
            <Button size="sm"><Send className="h-4 w-4" /> Relancer signataires</Button>
          </>
        }
      />

      <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="p-4">
            <div className="relative mx-auto aspect-[210/297] w-full max-w-2xl overflow-hidden rounded-lg border bg-white shadow-lg">
              <div className="absolute inset-0 p-10 text-[9px] leading-relaxed text-neutral-800">
                <div className="mb-4 text-center">
                  <div className="text-sm font-bold">CONTRAT CADRE DE PRESTATIONS</div>
                  <div className="mt-1 text-[8px] text-neutral-500">Entre Acme Corp. et Dupont SA — Réf. CT-2026-0442</div>
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="h-1.5 rounded bg-neutral-200" style={{ width: `${60 + ((i * 13) % 40)}%` }} />
                  ))}
                </div>
                <div className="mt-6 space-y-1.5">
                  <div className="font-bold text-[9px]">Article 4 — Signatures</div>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-1.5 rounded bg-neutral-200" style={{ width: `${70 + ((i * 7) % 30)}%` }} />
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-md border-2 border-success bg-success/5 p-3">
                    <div className="text-[8px] font-semibold text-success">✓ SIGNÉ</div>
                    <div className="mt-1 font-['Brush_Script_MT',cursive] text-2xl italic text-primary/80">A. Rousseau</div>
                    <div className="text-[7px] text-neutral-500">Amélie Rousseau · 01/07/2026</div>
                  </div>
                  <div className="rounded-md border-2 border-dashed border-primary bg-primary/5 p-3">
                    <div className="text-[8px] font-semibold text-primary">EN ATTENTE</div>
                    <div className="mt-2 flex h-8 items-center justify-center rounded bg-white/60 text-[9px] text-primary/70">
                      Glissez votre signature ici
                    </div>
                    <div className="mt-1 text-[7px] text-neutral-500">Jean Dupont · Dupont SA</div>
                  </div>
                </div>
              </div>
              <Badge className="absolute right-3 top-3 bg-warning/90 text-warning-foreground">2 / 4 signés</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <FileSignature className="h-4 w-4 text-primary" /> Progression
              </div>
              <div className="mb-1 flex justify-between text-xs">
                <span>2 / 4 signatures</span><span className="text-primary font-medium">50 %</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: "50%" }} />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded border p-2">
                  <div className="text-muted-foreground">Envoyé</div>
                  <div className="font-medium">30/06/2026</div>
                </div>
                <div className="rounded border p-2">
                  <div className="text-muted-foreground">Expire</div>
                  <div className="font-medium">14/07/2026</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="mb-3 text-sm font-semibold">Signataires</div>
              <div className="space-y-3">
                {signers.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {s.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium">{s.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{s.role}</div>
                    </div>
                    {s.status === "signed" ? (
                      <Badge className="gap-1 bg-success/15 text-success"><CheckCircle2 className="h-3 w-3" /> Signé</Badge>
                    ) : (
                      <Badge className="gap-1 bg-warning/15 text-warning-foreground"><Clock className="h-3 w-3" /> Attente</Badge>
                    )}
                  </div>
                ))}
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full"><User className="h-4 w-4" /> Ajouter un signataire</Button>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <PenTool className="h-4 w-4" /> Votre action
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Vous êtes autorisé à signer cette page en tant que représentant Acme.
              </p>
              <Button className="mt-3 w-full"><PenTool className="h-4 w-4" /> Signer maintenant</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}