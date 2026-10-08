import { useEffect, useState } from "react";
import { Bell, Search, Moon, Sun, Upload, Plus, HelpCircle } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export function AppHeader() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/80 px-3 backdrop-blur">
      <SidebarTrigger className="h-8 w-8" />
      <Separator orientation="vertical" className="mx-1 h-5" />
      <div className="relative hidden md:block">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un document, un tag, une IA…"
          className="h-9 w-[380px] pl-9 pr-16 bg-muted/40 border-transparent focus-visible:bg-background"
        />
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground lg:inline-flex">
          ⌘K
        </kbd>
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <Button variant="ghost" size="sm" className="hidden md:inline-flex gap-1.5">
          <Upload className="h-4 w-4" /> Importer
        </Button>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Nouveau
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 rounded-full px-1 text-[9px]">5</Badge>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-5" />
        <button className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-accent">
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">SM</AvatarFallback>
          </Avatar>
          <div className="hidden text-left lg:block">
            <div className="text-xs font-semibold leading-tight">Sophie Martin</div>
            <div className="text-[10px] leading-tight text-muted-foreground">Administratrice</div>
          </div>
        </button>
      </div>
    </header>
  );
}