"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/login");
        router.refresh();
    } catch (error) {
        console.error("Logout failed", error);
    }
  };

  const navItems = [
    { label: "Invitation", href: "/dashboard", icon: "ph:envelope-simple-open" },
    // Future expansion: { label: "Comments", href: "/dashboard/comments", icon: "ph:chat-circle-text" },
    // Future expansion: { label: "Settings", href: "/dashboard/settings", icon: "ph:gear" },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-background border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
            {isSidebarOpen && <span className="font-heading text-xl font-bold">CMS</span>}
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Icon icon={isSidebarOpen ? "ph:caret-left" : "ph:caret-right"} />
            </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
                <Link 
                    key={item.href} 
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        pathname === item.href 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                >
                    <Icon icon={item.icon} className="text-xl shrink-0" />
                    {isSidebarOpen && <span>{item.label}</span>}
                </Link>
            ))}
        </nav>

        <div className="p-4 border-t border-border">
             <Button 
                variant="outline" 
                className={`w-full justify-start ${!isSidebarOpen && "justify-center px-0"}`}
                onClick={handleLogout}
            >
                <Icon icon="ph:sign-out" className="text-xl shrink-0" />
                {isSidebarOpen && <span className="ml-2">Logout</span>}
            </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
