"use client";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentationLogo } from "./logo";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/user-button";

export function DocumentationHeader() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const docs = useQuery(api.docs.getAllDocs);

  // Toggle search with Cmd+K/Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredDocs = docs
    ? docs.filter((doc) =>
        search
          ? `${doc.title} ${doc.content}`
              .toLowerCase()
              .includes(search.toLowerCase())
          : true
      )
    : [];

  return (
    <header className="border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-5">
          <DocumentationLogo />
          <Button
            variant="outline"
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 text-muted-foreground shadow-none"
          >
            <Search className="h-4 w-4" />
            Search...
            <kbd className="ml-2 rounded bg-muted px-2 py-1 text-xs font-mono">
              ⌘ + K
            </kbd>
          </Button>
        </div>
        <UserButton />
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search documentation..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          {docs === undefined ? (
            <div className="p-4 text-sm text-muted-foreground">Loading...</div>
          ) : filteredDocs.length === 0 ? (
            <CommandEmpty>No results found.</CommandEmpty>
          ) : (
            <CommandGroup heading="Documents">
              {filteredDocs.map((doc) => (
                <CommandItem
                  key={doc._id}
                  value={`${doc.title} ${doc.content}`}
                  onSelect={() => {
                    router.push(`/docs/${doc.category}/${doc.docId}`);
                    setOpen(false);
                  }}
                  className="flex justify-between items-center"
                >
                  <span>{doc.title}</span>
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    {doc.category}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </header>
  );
}
