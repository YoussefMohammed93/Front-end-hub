"use client";

import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Edit,
  Trash,
  Share2,
} from "lucide-react";

import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/footer";
import { useQuery, useMutation } from "convex/react";
import { notFound, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentPageProps {
  params: {
    docId: string;
    "doc-category": string;
  };
}

const LoadingSpinner = () => (
  <div className="w-full h-[85vh] flex items-center justify-center">
    <Loader2 className="animate-spin" />
  </div>
);

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function DocumentPage({ params }: DocumentPageProps) {
  const router = useRouter();
  const { docId, "doc-category": category } = params;

  const userRole = useQuery(api.users.getUserRole);

  const doc = useQuery(api.docs.getDoc, { docId });
  const allDocs = useQuery(api.docs.getAllDocs);

  const updateDoc = useMutation(api.docs.updateDoc);
  const deleteDoc = useMutation(api.docs.deleteDoc);

  const [isSaving, setIsSaving] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Document link copied to clipboard");
    } catch (error) {
      console.warn(error);
      toast.error("Failed to copy link");
    }
  }, []);

  useEffect(() => {
    if (doc && doc.category.toLowerCase() !== category.toLowerCase()) {
      notFound();
    }
  }, [doc, category]);

  useEffect(() => {
    if (doc) {
      setEditedTitle(doc.title);
      setEditedContent(doc.content);
    }
  }, [doc]);

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

  const handleDeleteDoc = async () => {
    try {
      await deleteDoc({ docId });

      toast.success("Document deleted successfully!");
      router.push("/");
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDoc({
        docId,
        title: editedTitle,
        content: editedContent,
      });

      toast.success("Document updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Failed to update document:", error);
      toast.error("Failed to update document");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background">
      <div className="px-3 max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row gap-8 sm:gap-0 justify-between sm:items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3f3f3f] dark:text-[#cfcfcf] tracking-tighter">
            {doc.title}
          </h1>
          <div className="flex items-center gap-2">
            <div>
              <Badge
                variant="outline"
                onClick={handleShare}
                className="cursor-pointer px-4 py-2.5 text-sm font-medium gap-2 hover:bg-secondary"
              >
                <Share2 className="size-4" />
              </Badge>
            </div>
            {userRole === "admin" && (
              <div className="flex gap-2">
                <AlertDialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(true)}
                    >
                      <Edit />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[370px] sm:max-w-fit max-h-[600px] overflow-x-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Update the title and content of your document.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4 my-4">
                      <div>
                        <label
                          className="text-sm font-medium mb-1"
                          htmlFor="doc-title"
                        >
                          Title
                        </label>
                        <Input
                          id="doc-title"
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <label
                          className="text-sm font-medium mb-1"
                          htmlFor="doc-content"
                        >
                          Content
                        </label>
                        <Editor
                          editable={true}
                          onChange={(content) => setEditedContent(content)}
                          initialContent={editedContent}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="animate-spin" /> Saving...
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[370px] sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this document? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDeleteDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDeleteDoc}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
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
                <Button variant="default" className="text-left">
                  <ArrowLeft />
                  Previous
                </Button>
              </Link>
            ) : (
              <Button variant="default" disabled>
                <ArrowLeft />
                Previous
              </Button>
            )}
          </div>
          <div>
            {nextDoc ? (
              <Link href={`/docs/${nextDoc.category}/${nextDoc.docId}`}>
                <Button variant="default" className="text-right">
                  <ArrowRight />
                  Next
                </Button>
              </Link>
            ) : (
              <Button variant="default" disabled>
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
