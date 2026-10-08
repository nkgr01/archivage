import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, FileText, ScanText, Sparkles, Search, GitBranch,
  MessageSquare, Bell, Shield, ScrollText, Activity, Settings,
  PlugZap, Cloud, Users, ShieldCheck, ChevronDown, Clock, BarChart3,
  Building2, ExternalLink, PenTool, Share2, History,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const workspace = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Documents", url: "/documents", icon: FileText, badge: "12,4k" },
  { title: "Recherche IA", url: "/search", icon: Search },
  { title: "Workflows", url: "/workflows", icon: GitBranch, badge: "3" },
  { title: "Signature", url: "/signature", icon: PenTool, badge: "2" },
  { title: "Partage externe", url: "/sharing", icon: Share2 },
  { title: "Versions", url: "/versions", icon: History },
];

const intelligence = [
  { title: "OCR", url: "/ocr", icon: ScanText, badge: "24" },
  { title: "Portail fournisseurs", url: "/portal", icon: ExternalLink },
];

const system = [
  { title: "Audit", url: "/audit", icon: ScrollText },
  { title: "Rétention", url: "/retention", icon: Clock },
  { title: "Reporting", url: "/reporting", icon: BarChart3 },
];

const admin = [
  { title: "Utilisateurs & rôles", url: "/admin", icon: Users },
  { title: "Espaces de travail", url: "/workspaces", icon: Building2 },
  { title: "Intégrations", url: "/integrations", icon: Cloud },
  { title: "Paramètres", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string) => (url === "/" ? pathname === "/" : pathname.startsWith(url));

  const renderGroup = (label: string, items: typeof workspace) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-[0.68rem] font-semibold uppercase tracking-wider text-muted-foreground/70">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title} className="h-9">
                <Link to={item.url} className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-sm">{item.title}</span>
                      {"badge" in item && item.badge && (
                        <Badge variant="secondary" className="h-5 rounded-full px-2 text-[10px] font-medium">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold tracking-tight">ArchiveSafe</span>
                <Badge variant="outline" className="h-4 rounded px-1 text-[9px] font-semibold text-primary border-primary/30">ENT</Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="truncate">Acme Corp.</span>
                <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-0">
        {renderGroup("Espace de travail", workspace)}
        {renderGroup("Intelligence", intelligence)}
        {renderGroup("Système", system)}
        {renderGroup("Configuration", admin)}
      </SidebarContent>
      <SidebarFooter className="border-t p-3">
        {!collapsed ? (
          <div className="rounded-lg border bg-gradient-to-br from-primary-soft to-transparent p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold">Stockage</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: "62%" }} />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>124 Go / 200 Go</span>
              <span className="font-medium text-foreground">62%</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}