import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, HardDrive, Zap, Download, Clock } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reporting")({
  head: () => ({
    meta: [
      { title: "Statistiques & reporting — ArchiveSafe Enterprise" },
      { name: "description", content: "Analytique avancée sur le volume, la précision OCR et les temps de traitement." },
    ],
  }),
  component: ReportingPage,
});

const storage = [
  { m: "Jan", go: 78 }, { m: "Fév", go: 84 }, { m: "Mar", go: 92 },
  { m: "Avr", go: 101 }, { m: "Mai", go: 112 }, { m: "Jui", go: 124 },
];
const ocr = [
  { m: "Jan", precision: 91.2, temps: 3.4 }, { m: "Fév", precision: 92.1, temps: 3.1 },
  { m: "Mar", precision: 93.8, temps: 2.9 }, { m: "Avr", precision: 94.4, temps: 2.6 },
  { m: "Mai", precision: 95.2, temps: 2.4 }, { m: "Jui", precision: 96.1, temps: 2.2 },
];
const types = [
  { name: "Factures", value: 4218, c: "var(--chart-1)" },
  { name: "Contrats", value: 1872, c: "var(--chart-2)" },
  { name: "Rapports", value: 942, c: "var(--chart-3)" },
  { name: "Courriers", value: 613, c: "var(--chart-4)" },
  { name: "Autres", value: 287, c: "var(--chart-5)" },
];
const depts = [
  { d: "Compta", v: 3120 }, { d: "Juridique", v: 984 }, { d: "RH", v: 612 },
  { d: "IT", v: 421 }, { d: "Direction", v: 328 }, { d: "Logistique", v: 214 },
];

function ReportingPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Analytique"
        title="Statistiques & reporting"
        description="Vision consolidée de la performance de votre archivage sur 6 mois glissants."
        actions={
          <>
            <select className="rounded-md border bg-background px-3 py-2 text-sm">
              <option>6 derniers mois</option><option>Année 2026</option><option>Personnalisée</option>
            </select>
            <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Exporter PDF</Button>
          </>
        }
      />

      <div className="space-y-6 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            { l: "Stockage utilisé", v: "124 Go", d: "+11 Go ce mois", i: HardDrive, c: "text-primary" },
            { l: "Précision OCR", v: "96,1 %", d: "+0,9 pt", i: Zap, c: "text-success" },
            { l: "Temps moyen", v: "2,2 s", d: "-8 % vs mois -1", i: Clock, c: "text-info" },
            { l: "Documents traités", v: "12 486", d: "+842 ce mois", i: TrendingUp, c: "text-chart-5" },
          ].map((k) => (
            <Card key={k.l}><CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">{k.l}</div>
                <k.i className={`h-4 w-4 ${k.c}`} />
              </div>
              <div className="mt-1 text-2xl font-semibold">{k.v}</div>
              <div className="text-[11px] text-success">{k.d}</div>
            </CardContent></Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">Croissance du stockage</div>
                  <div className="text-xs text-muted-foreground">En Go, 6 mois</div>
                </div>
                <Badge variant="outline" className="text-success">+59 % YoY</Badge>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={storage}>
                  <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="go" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-sm font-semibold">Répartition par type</div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={types} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {types.map((t) => <Cell key={t.name} fill={t.c} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-sm font-semibold">Précision OCR</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ocr}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} domain={[88, 100]} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="precision" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 text-sm font-semibold">Temps de traitement moyen (s)</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={ocr}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="m" fontSize={11} /><YAxis fontSize={11} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Line type="monotone" dataKey="temps" stroke="var(--chart-4)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                <BarChart3 className="h-4 w-4" /> Volume par département
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={depts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis type="number" fontSize={11} />
                  <YAxis dataKey="d" type="category" fontSize={11} width={70} />
                  <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Bar dataKey="v" fill="var(--chart-1)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}