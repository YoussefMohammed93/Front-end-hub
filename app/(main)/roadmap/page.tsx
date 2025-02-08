/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/footer";
import { MainHeader } from "@/components/header";
import { useQuery, useMutation } from "convex/react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Loader2, Share2, Trash } from "lucide-react";
import React, { useState, useEffect, useCallback, memo } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[85vh] flex items-center justify-center">
      <Loader2 className="animate-spin" />
    </div>
  ),
});

const ResourceHeader = memo(function ResourceHeader({
  resource,
  userRole,
  isEditMode,
  isSaving,
  handleShare,
  onEdit,
  onDelete,
  editedTitle,
  onTitleChange,
  handleSave,
}: {
  resource: any;
  userRole: string;
  isEditMode: boolean;
  isSaving: boolean;
  handleShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  editedTitle: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}) {
  if (userRole === "admin") {
    return !isEditMode ? (
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#3f3f3f] dark:text-[#d6dad8]">
          {resource.title}
        </h1>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            onClick={handleShare}
            className="cursor-pointer px-4 py-2.5 text-sm font-medium gap-2 hover:bg-secondary"
          >
            <Share2 className="size-4" />
          </Badge>
          <Button variant="outline" onClick={onEdit}>
            <Edit className="size-5" />
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash className="size-5" />
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex justify-between items-center mb-6">
        <Input
          value={editedTitle}
          onChange={onTitleChange}
          className="text-4xl font-bold"
        />
        <div className="flex gap-2 items-center">
          {isSaving && (
            <Loader2 className="animate-spin text-primary ml-5 sm:ml-10" />
          )}
          <Button
            variant="outline"
            className="ml-5 sm:ml-10"
            onClick={handleSave}
          >
            Done
          </Button>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-[#3f3f3f] dark:text-[#d6dad8]">
          {resource.title}
        </h1>
        <Badge
          variant="outline"
          onClick={handleShare}
          className="cursor-pointer px-4 py-2.5 text-sm font-medium gap-2 hover:bg-secondary"
        >
          <Share2 className="size-4" />
        </Badge>
      </div>
    );
  }
});

const ResourceEditor = memo(function ResourceEditor({
  editable,
  initialContent,
  onChange,
}: {
  editable: boolean;
  initialContent: string;
  onChange: (content: string) => void;
}) {
  return (
    <Card className="shadow-none border-none">
      <CardContent className="p-0 shadow-none">
        <div className="editor-wrapper">
          <Editor
            editable={editable}
            initialContent={initialContent}
            onChange={onChange}
          />
        </div>
      </CardContent>
    </Card>
  );
});

const CreateResourceForm = memo(function CreateResourceForm({
  createTitle,
  createContent,
  onTitleChange,
  onContentChange,
  onSubmit,
  isCreating,
}: {
  createTitle: string;
  createContent: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onContentChange: (content: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-6 bg-card dark:bg-muted/50 p-5 rounded-xl border"
    >
      <div className="space-y-3">
        <Label htmlFor="title" className="text-lg font-semibold">
          Roadmap Title
        </Label>
        <Input
          id="title"
          placeholder="Enter Roadmap title..."
          type="text"
          value={createTitle}
          onChange={onTitleChange}
          className="p-3 text-lg rounded-lg transition-shadow focus:ring-2 focus:ring-primary"
        />
      </div>
      <div className="space-y-3">
        <Label htmlFor="content" className="text-lg font-semibold">
          Content
        </Label>
        <Editor
          editable={true}
          initialContent={createContent}
          onChange={onContentChange}
        />
      </div>
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isCreating}
          className="flex items-center gap-2 px-6 py-3"
        >
          {isCreating ? <Loader2 className="animate-spin" /> : "Create Roadmap"}
        </Button>
      </div>
    </form>
  );
});

export default function RoadmapPage() {
  const { userId } = useAuth();

  const [createTitle, setCreateTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createContent, setCreateContent] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const [editedTitle, setEditedTitle] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const userRole = useQuery(api.users.getUserRole);
  const resource = useQuery(api.resources.getUserResource);

  const createResourceMutation = useMutation(api.resources.createResource);
  const updateResourceMutation = useMutation(api.resources.updateResource);
  const deleteResourceMutation = useMutation(api.resources.deleteResource);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Roadmap link copied to clipboard");
    } catch (error) {
      console.warn(error);
      toast.error("Failed to copy link");
    }
  }, []);

  useEffect(() => {
    if (resource) {
      setEditedTitle(resource.title);
      setEditedContent(resource.content);
    }
  }, [resource]);

  const handleCreate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }
      if (!createTitle.trim() || !createContent.trim()) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsCreating(true);
      try {
        const res = await createResourceMutation({
          title: createTitle.trim(),
          content: createContent,
        });

        if (!res?.resourceId) {
          throw new Error("Resource creation failed");
        }

        toast.success("Resource created successfully!");
        setCreateTitle("");
        setCreateContent("");
      } catch (error) {
        console.error("Error creating resource:", error);
        toast.error("Failed to create resource. Please try again.");
      } finally {
        setIsCreating(false);
      }
    },
    [userId, createTitle, createContent, createResourceMutation]
  );

  const handleSave = useCallback(async () => {
    if (!resource) return;
    setIsSaving(true);
    try {
      await updateResourceMutation({
        resourceId: resource.resourceId,
        title: editedTitle,
        content: editedContent,
      });
      toast.success("Resource updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to update resource:", error);
      toast.error("Failed to update resource");
    } finally {
      setIsSaving(false);
    }
  }, [resource, updateResourceMutation, editedTitle, editedContent]);

  const handleDelete = useCallback(async () => {
    if (resource) {
      try {
        await deleteResourceMutation({ resourceId: resource.resourceId });
        toast.success("Resource deleted successfully!");
      } catch (error) {
        console.error("Failed to delete resource:", error);
        toast.error("Failed to delete resource");
      } finally {
        setIsDeleteDialogOpen(false);
        setIsEditMode(false);
      }
    } else {
      toast.error("Resource not found");
    }
  }, [resource, deleteResourceMutation]);

  if (userRole === undefined || resource === undefined) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-popover">
      <MainHeader />
      <div className="max-w-7xl mx-auto px-5 sm:px-10 sm:p-8 mb-12 bg-popover">
        {resource ? (
          <>
            <ResourceHeader
              resource={resource}
              userRole={userRole}
              isEditMode={isEditMode}
              isSaving={isSaving}
              handleShare={handleShare}
              onEdit={() => setIsEditMode(true)}
              onDelete={() => setIsDeleteDialogOpen(true)}
              editedTitle={editedTitle}
              onTitleChange={(e) => setEditedTitle(e.target.value)}
              handleSave={handleSave}
            />
            <ResourceEditor
              editable={userRole === "admin" && isEditMode}
              initialContent={
                userRole === "admin" && isEditMode
                  ? editedContent
                  : resource.content
              }
              onChange={(content) => {
                if (userRole === "admin" && isEditMode) {
                  setEditedContent(content);
                }
              }}
            />
            {userRole === "admin" && (
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogContent className="max-w-[370px] sm:max-w-lg">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this Roadmap? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </>
        ) : (
          <CreateResourceForm
            createTitle={createTitle}
            createContent={createContent}
            onTitleChange={(e) => setCreateTitle(e.target.value)}
            onContentChange={(content) => setCreateContent(content)}
            onSubmit={handleCreate}
            isCreating={isCreating}
          />
        )}
      </div>
      <MainFooter />
      <style jsx>{`
        :global(.ProseMirror.bn-editor.bn-default-styles) {
          padding: 0 !important;
          background: white !important;
        }
        :global(.dark .bn-block-group) {
          background: #171717 !important;
        }
      `}</style>
    </div>
  );
}
