import { SidebarNav } from "@/components/common/SidebarNav";
import { Header } from "@/components/common/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdsenseAd } from "@/components/common/AdsenseAd";
import { Card } from "@/components/ui/card";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SidebarNav />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        <footer className="p-4 sm:p-6 lg:p-8 pt-0">
            <Card>
                <AdsenseAd adSlot="YYYYYYYYYY" />
            </Card>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
