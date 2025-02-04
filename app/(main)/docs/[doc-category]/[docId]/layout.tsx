import { DocumentationHeader } from "./_components/header";
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
      <div className="w-full flex flex-col">
        <DocumentationHeader />
        <main className="w-full">
          <div className="p-1 inline-block">
            <SidebarTrigger />
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
