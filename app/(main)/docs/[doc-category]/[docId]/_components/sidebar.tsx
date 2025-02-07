"use client";

import {
  Sidebar,
  SidebarGroup,
  SidebarContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { usePathname } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function WebsiteSidebar() {
  const pathname = usePathname();
  const docs = useQuery(api.docs.getAllDocs);
  const categories = ["HTML", "CSS", "Javascript"];

  useEffect(() => {
    if (docs) {
      const activeLink = document.querySelector('a[data-active="true"]');
      if (activeLink) {
        activeLink.scrollIntoView({ block: "nearest", behavior: "auto" });
      }
    }
  }, [docs, pathname]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documentation</SidebarGroupLabel>
          <div>
            {categories.map((category) => {
              const isCategoryActive = pathname.startsWith(
                `/docs/${category}/`
              );
              return (
                <div key={category}>
                  <h3
                    className={cn(
                      "px-3 py-0.5 text-base font-semibold text-muted-foreground",
                      isCategoryActive && "bg-muted-foreground/20"
                    )}
                  >
                    {category}
                  </h3>
                  <div>
                    {!docs
                      ? Array(3)
                          .fill(0)
                          .map((_, i) => (
                            <Skeleton
                              key={i}
                              className="h-6 w-full rounded-none"
                            />
                          ))
                      : docs
                          .filter((doc) => doc.category === category)
                          .map((doc) => {
                            const docPath = `/docs/${doc.category}/${doc.docId}`;
                            const isActive = pathname === docPath;

                            return (
                              <Link
                                key={doc._id}
                                href={docPath}
                                data-active={isActive}
                                className={cn(
                                  "block px-2 py-1 border-l-4 border-transparent text-sm transition-colors text-foreground/80 hover:text-foreground",
                                  isActive
                                    ? "bg-primary dark:bg-primary/50 border-l-4 border-green-900 dark:border-green-500 text-white hover:text-white font-semibold"
                                    : "hover:bg-muted-foreground/20"
                                )}
                              >
                                {doc.title}
                              </Link>
                            );
                          })}
                  </div>
                </div>
              );
            })}
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
