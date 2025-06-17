
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, ListChecks, BarChart2, History, Settings } from "lucide-react"; // Updated icons
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/salary", label: "Salary", icon: DollarSign },
  { href: "/products", label: "Products", icon: ListChecks },
  { href: "/results", label: "Results", icon: BarChart2 },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.label}>
          <SidebarMenuButton
            asChild
            className={cn(
              "w-full justify-start",
              pathname === item.href || (pathname === '/' && item.href === '/salary') // Highlight Salary if on root
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "hover:bg-sidebar-accent/50"
            )}
            isActive={pathname === item.href || (pathname === '/' && item.href === '/salary')}
            tooltip={{ children: item.label, side: "right", align: "center" }}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
