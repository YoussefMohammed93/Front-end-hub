"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/footer";
import { MainHeader } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Edit, Loader2, Undo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateDocsPage() {
  const { userId } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = useQuery(api.users.getUserRole);
  const createDocMutation = useMutation(api.docs.createDoc);

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
        loading: () => (
          <div className="w-full animate-pulse">
            <Skeleton className="h-40 w-full" />
          </div>
        ),
      }),
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!userId) {
      toast.error("User not authenticated");
      setIsSubmitting(false);
      return;
    }

    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      setIsSubmitting(false);
      return;
    }

    try {
      const doc = await createDocMutation({
        title: title.trim(),
        category,
        content,
      });

      if (!doc?.docId) {
        throw new Error("Document creation failed - no document ID returned");
      }

      toast.success("Document created successfully!");

      setTitle("");
      setCategory("");
      setContent("");

      router.push(`/docs/${doc.category}/${doc.docId}`);
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userRole !== "admin") {
    return (
      <motion.div
        className="flex items-center justify-center h-screen"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] mx-5 text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-3 text-destructive text-xl">
              <AlertTriangle className="size-6" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You do not have permission to access this page.
            </p>
            <Button className="mt-4">
              <Link href="/" className="flex items-center gap-3">
                <Undo className="size-5" />
                Go back to home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <MainHeader />
      <motion.div
        className="max-w-4xl mx-auto p-4 sm:p-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent leading-loose mb-10">
          <span className="inline-block">Create a new document</span>
        </motion.h1>
        <motion.form
          className="flex flex-col gap-6 sm:gap-8 bg-card dark:bg-muted/50 p-5 rounded-xl border"
          onSubmit={handleSubmit}
        >
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Document Title</Label>
            <Input
              placeholder="Enter document title..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 text-lg rounded-lg transition-shadow focus:ring-2 focus:ring-primary bg-background dark:bg-popover"
            />
          </div>
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="p-3 rounded-lg border focus:ring-2 focus:ring-primary bg-background dark:bg-popover">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>c
                <SelectItem value="HTML">HTML</SelectItem>
                <SelectItem value="CSS">CSS</SelectItem>
                <SelectItem value="Javascript">Javascript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label className="text-lg font-semibold">Content</Label>
            <Editor
              editable={true}
              onChange={(content) => setContent(content)}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-3"
            >
              {isSubmitting ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Edit className="size-5" />
              )}
              {isSubmitting ? "Publishing..." : "Publish Document"}
            </Button>
          </div>
        </motion.form>
      </motion.div>
      <MainFooter />
    </main>
  );
}
