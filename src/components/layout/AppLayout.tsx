
"use client";

import React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppLogo } from "@/components/AppLogo";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from '@/hooks/use-toast'; // Added for logout toast

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function AppLayout({ children, title }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const { toast } = useToast(); // Added for logout toast

  const handleLogout = () => {
    // In a real app, you would call an API to logout, clear session, etc.
    // For this demo, we'll just show a toast.
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // Potentially redirect to a login page if one exists:
    // router.push('/login');
  };

  return (
    <SidebarProvider defaultOpen={true} open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <Sidebar collapsible="icon" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between">
          <AppLogo className="group-data-[collapsible=icon]:hidden" />
          <SidebarTrigger className="md:hidden" />
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
           <Button variant="ghost" className="w-full justify-start group-data-[collapsible=icon]:justify-center" onClick={handleLogout}>
             <LogOut className="mr-2 h-5 w-5 group-data-[collapsible=icon]:mr-0" />
             <span className="group-data-[collapsible=icon]:hidden">Logout</span>
           </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
          <SidebarTrigger className="hidden md:flex" />
          {title && <h1 className="text-lg md:text-xl font-semibold font-headline">{title}</h1>}
        </header>
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
