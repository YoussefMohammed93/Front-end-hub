"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface DocumentIdPageProps {
  params: {
    docId: string;
    category: string;
  };
}

export default function DocumentIdPage({ params }: DocumentIdPageProps) {
  const { docId } = params;
  const doc = useQuery(api.docs.getDoc, { docId });

  return (
    <div className="m-10 space-y-5">
      <h1 className="text-5xl font-bold">
        Hello, {doc ? doc.title : "Loading..."}
      </h1>
      <h2 className="text-3xl font-semibold">
        Category : {doc ? doc.category : "Loading..."}
      </h2>
    </div>
  );
}
