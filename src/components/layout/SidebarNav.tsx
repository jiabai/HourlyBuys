
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings, ListChecks, DollarSign, BarChart2, History, ShoppingBag } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/products", label: "Products", icon: ListChecks },
  { href: "/salary", label: "Salary", icon: DollarSign },
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
          <Link href={item.href} asChild>
            <SidebarMenuButton
              className={cn(
                "w-full justify-start",
                pathname === item.href
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              )}
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: "right", align: "center" }}
            >
              <item.icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
