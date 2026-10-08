import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, Upload, ShieldCheck, FileText, Clock, CheckCircle2, AlertCircle, Link as LinkIcon, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Portail fournisseurs — ArchiveSafe Enterprise" },
      { name: "description", content: "Permettez à vos tiers de déposer leurs factures et documents en toute sécurité." },
    ],
  }),
  component: PortalPage,
});

const submissions = [
  { supp: "Dupont SA", doc: "FAC-2026-1128", type: "Facture", date: "il y a 12 min", amount: "1 240,00 €", status: "review" },
  { supp: "Orange Business", doc: "OR-88213", type: "Facture", date: "il y a 1 h", amount: "890,50 €", status: "ok" },
  { supp: "Cabinet Meyer", doc: "MEY-2026-04", type: "Contrat", date: "il y a 3 h", amount: "—", status: "ok" },
  { supp: "EDF Entreprises", doc: "EDF-77213", type: "Facture", date: "hier", amount: "3 210,80 €", status: "err" },
  { supp: "Bureau Vallée", doc: "BV-2026-041", type: "Bon livraison", date: "hier", amount: "—", status: "ok" },
];

const statusBadge = {
  ok: <Badge className="bg-success/15 text-success"><CheckCircle2 className="h-3 w-3" /> Reçu</Badge>,
  review: <Badge className="bg-warning/15 text-warning-foreground"><Clock className="h-3 w-3" /> À valider</Badge>,
  err: <Badge className="bg-destructive/15 text-destructive"><AlertCircle className="h-3 w-3" /> Erreur OCR</Badge>,
};

function PortalPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Externe"
        title="Portail fournisseurs & tiers"
        description="Vos fournisseurs déposent directement leurs documents via un portail sécurisé, sans compte à créer."
        actions={
          <>
            <Button variant="outline" size="sm"><LinkIcon className="h-4 w-4" /> Copier lien portail</Button>
            <Button size="sm"><Send className="h-4 w-4" /> Inviter un fournisseur</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Fournisseurs actifs", v: "84", i: ExternalLink },
            { l: "Dépôts / 30 j", v: "1 214", i: Upload },
            { l: "En attente validation", v: "12", i: Clock, c: "text-warning" },
            { l: "Rejets ce mois", v: "8", i: AlertCircle, c: "text-destructive" },
          ].map((k) => (
            <Card key={k.l}><CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ${k.c ?? "text-primary"}`}>
                <k.i className="h-5 w-5" />
              </div>
              <div><div className="text-xs text-muted-foreground">{k.l}</div><div className="text-lg font-semibold">{k.v}</div></div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <Card className="glass border-primary/20">
            <CardContent className="p-6">
              <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Aperçu portail public</div>
              <div className="rounded-2xl border bg-background p-6 shadow-inner">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <div className="text-base font-semibold">Portail fournisseurs — Acme Corp.</div>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Déposez vos factures. Chiffrement TLS 1.3, aucun compte requis.
                </p>
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs font-medium">Votre nom / société</label>
                    <Input defaultValue="Dupont SA" className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Email de contact</label>
                    <Input defaultValue="contact@dupont-sa.fr" className="mt-1" />
                  </div>
                  <div className="rounded-xl border-2 border-dashed p-6 text-center">
                    <Upload className="mx-auto h-8 w-8 text-primary" />
                    <div className="mt-2 text-sm font-medium">Glissez vos documents ici</div>
                    <div className="text-xs text-muted-foreground">PDF, JPG, PNG — max 25 Mo</div>
                  </div>
                  <Button className="w-full"><Send className="h-4 w-4" /> Envoyer sécurisé</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div className="border-b p-4">
                <div className="text-sm font-semibold">Dépôts récents</div>
                <div className="text-xs text-muted-foreground">Bandeau temps réel des documents reçus.</div>
              </div>
              <div className="divide-y">
                {submissions.map((s) => (
                  <div key={s.doc} className="flex items-center gap-3 p-3 hover:bg-muted/30">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{s.supp}</div>
                      <div className="text-xs text-muted-foreground">{s.doc} · {s.type} · {s.date}</div>
                    </div>
                    <div className="hidden text-sm font-medium sm:block">{s.amount}</div>
                    {statusBadge[s.status as keyof typeof statusBadge]}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}