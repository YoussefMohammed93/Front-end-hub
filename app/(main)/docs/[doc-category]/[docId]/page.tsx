"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { DOCS_VALID_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DocumentIdPageProps {
  params: {
    docId: string;
    "doc-category": string;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const { docId, "doc-category": category } = params;
  const router = useRouter();

  useEffect(() => {
    if (
      !DOCS_VALID_CATEGORIES.map((cat) => cat.toLowerCase()).includes(
        category.toLowerCase()
      )
    ) {
      notFound();
    }
  }, [category, router]);

  const doc = useQuery(api.docs.getDoc, { docId });

  if (doc === undefined) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  if (doc === null || doc.category.toLowerCase() !== category.toLowerCase()) {
    notFound();
  }

  return (
    <div className="m-5 space-y-5">
      <h1 className="text-5xl font-bold">{doc.title}</h1>
      <h2 className="text-3xl font-semibold text-muted-foreground">
        Category: {doc.category}
      </h2>
    </div>
  );
}
