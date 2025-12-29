"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Image as ImageIcon,
  FileText,
  Bot,
  Info,
  Mail,
  LifeBuoy,
  UserCircle,
} from "lucide-react";

const navItems = [
  { href: "/converters/image", label: "Image Converter", icon: ImageIcon },
  { href: "/converters/pdf", label: "PDF Converter", icon: FileText },
  { href: "/ai-suggester", label: "AI Suggester", icon: Bot },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: Mail },
];

export function SidebarNav() {
  const pathname = usePathname();

  const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 28V4H24V8H16V14H22V18H16V28H12Z" fill="currentColor"/>
        <path d="M8 28V4H4V28H8Z" fill="hsl(var(--accent))"/>
    </svg>
  );

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
                <Logo />
            </div>
            <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">FileFlex</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: 'Support' }}>
                    <LifeBuoy />
                    <span>Support</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                 <SidebarMenuButton tooltip={{ children: 'Account' }}>
                    <UserCircle />
                    <span>Account</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
