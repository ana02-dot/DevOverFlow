import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  MessageSquare, 
  Hash, 
  Users, 
  Settings, 
  LogOut, 
  Folder,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function Sidebar() {
  const [location] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [projects, setProjects] = useState<{id: number; name: string; color: string}[]>([]);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsData = await api.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    }
    fetchProjects();
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/" },
    { icon: MessageSquare, label: "Questions", href: "/questions" },
    { icon: Hash, label: "Tags", href: "/tags" },
    { icon: Users, label: "Users", href: "/users" },
  ];

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-sidebar h-screen sticky top-0 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "h-16 flex items-center border-b border-sidebar-border",
        isCollapsed ? "justify-center px-2" : "px-6"
      )}>
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-sidebar-foreground overflow-hidden whitespace-nowrap">
           <div className="w-8 h-8 min-w-8 bg-primary rounded-lg flex items-center justify-center">
             <span className="text-primary-foreground">D</span>
           </div>
           {!isCollapsed && <span className="animate-in fade-in duration-300">DevFlow</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-none">
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 animate-in fade-in duration-300">
              Menu
            </div>
          )}
          {navItems.map((item) => {
            const isActive = location === item.href;
            
            const linkClasses = cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group",
              isActive 
                ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              isCollapsed && "justify-center px-2"
            );

            return isCollapsed ? (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link href={item.href} className={linkClasses}>
                    <item.icon className="w-4 h-4 min-w-4" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link key={item.href} href={item.href} className={linkClasses}>
                <item.icon className="w-4 h-4 min-w-4" />
                <span className="whitespace-nowrap overflow-hidden">{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 animate-in fade-in duration-300">
              Projects
            </div>
          )}
          {projects.map((project) => {
            const linkClasses = cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group",
              isCollapsed && "justify-center px-2"
            );

            return isCollapsed ? (
              <Tooltip key={project.id}>
                <TooltipTrigger asChild>
                  <Link href={`/project/${project.id}`} className={linkClasses}>
                    <span className={cn("w-2 h-2 min-w-2 rounded-full", project.color)} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {project.name}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link key={project.id} href={`/project/${project.id}`} className={linkClasses}>
                <span className={cn("w-2 h-2 min-w-2 rounded-full", project.color)} />
                <span className="whitespace-nowrap overflow-hidden">{project.name}</span>
              </Link>
            );
          })}
          
          {isCollapsed ? (
             <Tooltip>
               <TooltipTrigger asChild>
                 <button className="w-full flex items-center justify-center gap-3 px-2 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                   <Folder className="w-4 h-4" />
                 </button>
               </TooltipTrigger>
               <TooltipContent side="right">View All Projects</TooltipContent>
             </Tooltip>
          ) : (
             <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
               <Folder className="w-4 h-4" />
               View All Projects
             </button>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-sidebar-border flex flex-col gap-1">
        {isCollapsed ? (
           <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/settings" className="flex items-center justify-center w-full h-9 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
                  <Settings className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/login" className="flex items-center justify-center w-full h-9 rounded-md text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="w-4 h-4" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Sign Out</TooltipContent>
            </Tooltip>

            <div className="pt-2 mt-2 border-t border-sidebar-border/50">
              <Button 
                variant="ghost" 
                size="icon" 
                className="w-full h-9 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={toggleCollapse}
              >
                <PanelLeftOpen className="w-4 h-4" />
              </Button>
            </div>
           </>
        ) : (
           <>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <Link href="/login" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors mt-1">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
            
            <div className="pt-2 mt-2 border-t border-sidebar-border/50">
              <button 
                onClick={toggleCollapse}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <PanelLeftClose className="w-4 h-4" />
                Collapse Sidebar
              </button>
            </div>
           </>
        )}
      </div>
    </aside>
  );
}
