"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { MainFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentPageProps {
  params: {
    docId: string;
    "doc-category": string;
  };
}

const LoadingSpinner = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <Loader2 className="animate-spin" />
  </div>
);

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function DocumentPage({ params }: DocumentPageProps) {
  const { docId, "doc-category": category } = params;
  const doc = useQuery(api.docs.getDoc, { docId });

  useEffect(() => {
    if (doc && doc.category.toLowerCase() !== category.toLowerCase()) {
      notFound();
    }
  }, [doc, category]);

  if (doc === undefined) {
    return <LoadingSpinner />;
  }

  if (!doc) {
    notFound();
  }

  return (
    <div className="bg-background">
      <div className="px-3 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-[#3f3f3f] dark:text-[#cfcfcf] tracking-tighter">
            {doc.title}
          </h1>
        </div>
        <div className="mb-8">
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="editor-wrapper">
                <Editor
                  key={doc.content}
                  editable={false}
                  onChange={() => {}}
                  initialContent={doc.content}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MainFooter />
      <style jsx>{`
        :global(.ProseMirror.bn-editor.bn-default-styles) {
          padding: 0 !important;
          background: white !important;
        }
        :global(.dark .bn-block-group) {
          background: #0c0a09 !important;
        }
      `}</style>
    </div>
  );
}
