"use client";

import Link from "next/link";
import { useEffect } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { notFound } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

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
  const allDocs = useQuery(api.docs.getAllDocs);

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

  const currentCategoryDocs = (allDocs || []).filter(
    (d) => d.category === doc.category
  );
  const currentIndex = currentCategoryDocs.findIndex((d) => d._id === doc._id);
  const previousDoc =
    currentIndex > 0 ? currentCategoryDocs[currentIndex - 1] : null;
  const nextDoc =
    currentIndex < currentCategoryDocs.length - 1
      ? currentCategoryDocs[currentIndex + 1]
      : null;

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
        <div className="flex justify-between gap-4 mb-8 flex-wrap">
          <div>
            {previousDoc ? (
              <Link href={`/docs/${previousDoc.category}/${previousDoc.docId}`}>
                <Button
                  variant="outline"
                  className="text-left dark:bg-popover dark:hover:bg-secondary"
                >
                  <ArrowLeft />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled className="dark:bg-popover">
                <ArrowLeft />
                Previous
              </Button>
            )}
          </div>
          <div>
            {nextDoc ? (
              <Link href={`/docs/${nextDoc.category}/${nextDoc.docId}`}>
                <Button
                  variant="outline"
                  className="text-right dark:bg-popover dark:hover:bg-secondary"
                >
                  <ArrowRight />
                  Next
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled className="dark:bg-popover">
                <ArrowRight />
                Next
              </Button>
            )}
          </div>
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
