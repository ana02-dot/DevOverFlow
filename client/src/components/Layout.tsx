import { Sidebar } from "./Sidebar";
import { Bell, Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from "wouter";
import { MOCK_USERS } from "@/lib/mockData";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const currentUser = MOCK_USERS[0]; // Simulate logged in user
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground">
      {/* Desktop Sidebar */}
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center px-4 md:px-8 sticky top-0 z-20 justify-between gap-4">
          <div className="flex items-center gap-4 md:hidden">
             <Sheet>
               <SheetTrigger asChild>
                 <Button variant="ghost" size="icon" className="-ml-2">
                   <Menu className="w-5 h-5" />
                 </Button>
               </SheetTrigger>
               <SheetContent side="left" className="p-0 w-72">
                 <Sidebar />
               </SheetContent>
             </Sheet>
             <span className="font-bold text-lg">DevFlow</span>
          </div>

          <div className="hidden md:flex max-w-md w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search questions, projects, or tags..." 
              className="pl-9 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary"
            />
          </div>

          <div className="flex items-center gap-3 md:gap-4 ml-auto">
             <Link href="/ask">
               <Button className="hidden md:flex gap-2">
                 <Plus className="w-4 h-4" />
                 Ask Question
               </Button>
             </Link>
             <Button variant="ghost" size="icon" className="text-muted-foreground relative">
               <Bell className="w-5 h-5" />
               <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card" />
             </Button>
             
             <div className="flex items-center gap-3 pl-2 border-l border-border">
               <div className="hidden md:block text-right">
                 <div className="text-sm font-medium leading-none">{currentUser.name}</div>
                 <div className="text-xs text-muted-foreground mt-1">{currentUser.role}</div>
               </div>
               <Avatar className="w-8 h-8 cursor-pointer">
                 <AvatarImage src={currentUser.avatar} />
                 <AvatarFallback>AR</AvatarFallback>
               </Avatar>
             </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-background/50">
           <div className="max-w-5xl mx-auto p-4 md:p-8 w-full">
             {children}
           </div>
        </div>
      </main>
    </div>
  );
}
