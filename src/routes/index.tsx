import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  FileText, ScanText, Sparkles, Star, TrendingUp, TrendingDown,
  Upload, FolderPlus, Search, ScanLine, Users, ArrowUpRight,
  CheckCircle2, AlertTriangle, Info, XCircle, Clock,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  uploadTrend, docsByType, departmentUsage, recentActivity, notifications, documents,
} from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — ArchiveSafe Enterprise" },
      { name: "description", content: "Vue d'ensemble de votre gestion documentaire intelligente." },
      { property: "og:title", content: "ArchiveSafe Enterprise" },
      { property: "og:description", content: "Plateforme de gestion documentaire avec OCR et IA." },
    ],
  }),
  component: Dashboard,
});

const kpis = [
  { label: "Documents totaux", value: "12 480", delta: "+8,2%", up: true, icon: FileText, color: "text-primary", bg: "bg-primary/10" },
  { label: "Ajoutés aujourd'hui", value: "148", delta: "+24", up: true, icon: Upload, color: "text-info", bg: "bg-info/10" },
  { label: "OCR en attente", value: "24", delta: "-6", up: false, icon: ScanText, color: "text-warning", bg: "bg-warning/15" },
  { label: "Extractions IA", value: "1 862", delta: "+12,4%", up: true, icon: Sparkles, color: "text-chart-5", bg: "bg-[color:var(--chart-5)]/10" },
];

const levelIcon = {
  success: CheckCircle2,
  warning: AlertTriangle,
  info: Info,
  destructive: XCircle,
} as const;

const levelColor = {
  success: "text-success bg-success/10",
  warning: "text-warning bg-warning/15",
  info: "text-info bg-info/10",
  destructive: "text-destructive bg-destructive/10",
} as const;

function Dashboard() {
  const favorites = documents.filter((d) => d.favorite).slice(0, 4);
  const recent = documents.slice(0, 5);
  return (
    <AppShell>
      <div className="mx-auto max-w-[1600px] space-y-5 p-4 lg:p-6">
        {/* Greeting */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Mercredi 1 juillet 2026</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span>Acme Corporation</span>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Bonjour Sophie 👋</h1>
            <p className="text-sm text-muted-foreground">Voici ce qui se passe sur votre espace documentaire aujourd'hui.</p>
          </div>
          <Tabs defaultValue="7j">
            <TabsList className="h-9">
              <TabsTrigger value="24h" className="text-xs">24h</TabsTrigger>
              <TabsTrigger value="7j" className="text-xs">7 jours</TabsTrigger>
              <TabsTrigger value="30j" className="text-xs">30 jours</TabsTrigger>
              <TabsTrigger value="90j" className="text-xs">90 jours</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* KPI row */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            const Trend = k.up ? TrendingUp : TrendingDown;
            return (
              <Card key={k.label} className="relative overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${k.bg}`}>
                      <Icon className={`h-5 w-5 ${k.color}`} />
                    </div>
                    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${k.up ? "text-success" : "text-destructive"}`}>
                      <Trend className="h-3 w-3" /> {k.delta}
                    </span>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
                    <div className="text-xs text-muted-foreground">{k.label}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick actions */}
        <Card className="border-dashed bg-gradient-to-br from-primary-soft/60 to-transparent">
          <CardContent className="flex flex-wrap items-center gap-2 p-3">
            <span className="mr-2 pl-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Raccourcis</span>
            {[
              { label: "Importer", icon: Upload },
              { label: "Scanner", icon: ScanLine },
              { label: "Nouveau dossier", icon: FolderPlus },
              { label: "Recherche IA", icon: Sparkles },
              { label: "Recherche avancée", icon: Search },
              { label: "Administration", icon: Users },
            ].map((a) => (
              <Button key={a.label} variant="outline" size="sm" className="gap-1.5 bg-background/80">
                <a.icon className="h-3.5 w-3.5" /> {a.label}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-base">Activité documentaire</CardTitle>
                <p className="text-xs text-muted-foreground">Uploads et OCR sur les 7 derniers jours</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--chart-1)]" /> Uploads</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[var(--chart-2)]" /> OCR</span>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={uploadTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="upload" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ocr" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="uploads" stroke="var(--chart-1)" strokeWidth={2} fill="url(#upload)" />
                  <Area type="monotone" dataKey="ocr" stroke="var(--chart-2)" strokeWidth={2} fill="url(#ocr)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Répartition par type</CardTitle>
              <p className="text-xs text-muted-foreground">10 780 documents classés</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={docsByType} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3} strokeWidth={0}>
                    {docsByType.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-1.5">
                {docsByType.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                    <span className="font-medium tabular-nums">{d.value.toLocaleString("fr-FR")}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments + Activity */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Documents par département</CardTitle>
              <p className="text-xs text-muted-foreground">Volumes archivés</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={departmentUsage} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="dep" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="docs" fill="var(--chart-1)" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-base">Activité récente</CardTitle>
                <p className="text-xs text-muted-foreground">Événements en temps réel</p>
              </div>
              <Button variant="ghost" size="sm" className="text-xs">Voir tout <ArrowUpRight className="ml-1 h-3 w-3" /></Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-muted/50">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`text-[11px] font-semibold ${a.initials === "IA" ? "bg-primary/15 text-primary" : "bg-muted"}`}>
                      {a.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-sm">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.time}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Bottom row: favorites, recent, notifications */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Star className="h-4 w-4 text-warning fill-warning" /> Favoris</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs">Tout voir</Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {favorites.map((d) => (
                <div key={d.id} className="flex items-center gap-3 rounded-md border p-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary text-[10px] font-bold">PDF</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.title}</div>
                    <div className="text-[11px] text-muted-foreground">{d.department} · {d.size}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Récemment consultés</CardTitle>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <Link to="/documents">Documents <ArrowUpRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-1">
              {recent.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-3 rounded-md p-2 text-sm hover:bg-muted/50">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{d.title}</div>
                    <div className="text-[11px] text-muted-foreground">{d.id} · {d.author}</div>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{d.type}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Notifications</CardTitle>
              <Badge variant="secondary" className="text-[10px]">5 nouvelles</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
              {notifications.map((n, i) => {
                const Icon = levelIcon[n.level];
                return (
                  <div key={i} className="flex items-start gap-3 rounded-md border p-2.5">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${levelColor[n.level]}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium">{n.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{n.detail}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground/70">{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
