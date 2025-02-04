import { WebsiteSidebar } from "./_components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <WebsiteSidebar />
      <main className="w-full">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
