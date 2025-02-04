/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
"use client";

import {
  Edit,
  HeartIcon,
  Loader2,
  MessageCircleMore,
  MoreHorizontal,
  Share2,
  Trash,
} from "lucide-react";

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { toast } from "sonner";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/header";
import { MainFooter } from "@/components/footer";
import { Id } from "@/convex/_generated/dataModel";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "convex/react";
import { RandomBlogs } from "@/components/random-blogs";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BlogIdPageProps {
  params: {
    blogId: Id<"blogs">;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 20,
    },
  },
};

const commentVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export default function BlogIdPage({ params }: BlogIdPageProps) {
  const { user } = useUser();

  const router = useRouter();
  const blogId = params?.blogId as string;

  const userRole = useQuery(api.users.getUserRole);
  const blog = useQuery(api.blogs.getBlog, { blogId });
  const deleteBlog = useMutation(api.blogs.deleteBlog);
  const updateBlog = useMutation(api.blogs.updateBlog);
  const toggleLikeMutation = useMutation(api.blogs.toggleLike);
  const addCommentMutation = useMutation(api.blogs.addComment);
  const deleteCommentMutation = useMutation(api.blogs.deleteComment);

  const blogData = useQuery(api.blogs.getBlog, { blogId });

  const [isLiked, setIsLiked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLikePending, setIsLikePending] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState(blog?.comments || []);
  const [localLikes, setLocalLikes] = useState(blog?.likes || 0);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog?.title || "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editedContent, setEditedContent] = useState(blog?.content || "");
  const [editedCategory, setEditedCategory] = useState(blog?.category || "");
  const [editedDescription, setEditedDescription] = useState(
    blog?.description || ""
  );
  const [expandedComments, setExpandedComments] = useState<
    Record<string, boolean>
  >({});

  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor"), {
        ssr: false,
        loading: () => <Skeleton className="h-40 w-full" />,
      }),
    []
  );

  const sortedComments = useMemo(
    () => [...comments].sort((a, b) => b.timestamp - a.timestamp),
    [comments]
  );

  const displayedComments = useMemo(
    () => (showAllComments ? sortedComments : sortedComments.slice(0, 3)),
    [showAllComments, sortedComments]
  );

  useEffect(() => {
    if (blog) {
      setLocalLikes(blog.likes);
      setComments(blog.comments);
      if (user && blog.likedBy) {
        setIsLiked(blog.likedBy.includes(user.id));
      }
    }
  }, [blog, user]);

  useEffect(() => {
    if (blog) {
      setEditedTitle(blog.title);
      setEditedDescription(blog.description);
      setEditedCategory(blog.category || "");
      setEditedContent(blog.content);
    }
  }, [blog]);

  const handleDeleteBlog = useCallback(async () => {
    try {
      await deleteBlog({ blogId });
      toast.success("Blog deleted successfully!");
      router.push("/blogs");
    } catch (error) {
      console.error("Failed to delete blog:", error);
      toast.error("Failed to delete blog");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  }, [blogId, router]);

  const handleLike = useCallback(async () => {
    if (isLikePending) return;

    setIsLikePending(true);
    const newLikeState = !isLiked;

    setIsLiked(newLikeState);
    setLocalLikes((prev) => (newLikeState ? prev + 1 : prev - 1));

    try {
      const newLikes = await toggleLikeMutation({
        blogId,
        liked: newLikeState,
      });
      setLocalLikes(newLikes);
      toast.success(newLikeState ? "Liked" : "Unliked");
    } catch (error) {
      console.warn(error);
      setIsLiked(!newLikeState);
      setLocalLikes((prev) => (newLikeState ? prev - 1 : prev + 1));
      toast.error("Failed to toggle like");
    } finally {
      setIsLikePending(false);
    }
  }, [blogId, isLiked, isLikePending, toggleLikeMutation]);

  const handleCommentClick = useCallback(() => {
    setShowCommentInput((prev) => !prev);
  }, []);

  const handlePublishComment = useCallback(async () => {
    if (!commentText.trim()) return;

    const tempId = `temp-${Date.now()}`;
    const tempComment = {
      id: tempId,
      userId: user?.id!,
      firstName: user?.firstName!,
      lastName: user?.lastName!,
      userImage: user?.imageUrl!,
      comment: commentText,
      timestamp: Date.now(),
    };

    setComments((prev) => [tempComment, ...prev]);
    setCommentText("");

    try {
      const newComment = await addCommentMutation({
        blogId,
        comment: commentText,
        timestamp: Date.now(),
      });

      setComments((prev) =>
        prev.map((c) => (c.id === tempId ? newComment : c))
      );
      toast.success("Comment added");
    } catch (error) {
      console.warn(error);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      toast.error("Failed to add comment");
    }
  }, [blogId, commentText, user, addCommentMutation]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBlog({
        blogId,
        title: editedTitle,
        description: editedDescription,
        content: editedContent,
        category: editedCategory,
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      toast.success("Blog updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update blog");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = useCallback(
    async (commentId: string) => {
      try {
        await deleteCommentMutation({ blogId, commentId });
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        toast.success("Comment deleted");
      } catch (error) {
        console.warn(error);
        toast.error("Failed to delete comment");
      }
    },
    [blogId, deleteCommentMutation]
  );

  const toggleCommentExpansion = useCallback((commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  }, []);

  const handleShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Blog link copied to clipboard");
    } catch (error) {
      console.warn(error);
      toast.error("Failed to copy link");
    }
  }, []);

  if (!blog) {
    return <BlogSkeleton />;
  }

  return (
    <div>
      <MainHeader />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 sm:mb-0"
        >
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-6 tracking-tighter"
            transition={{ type: "spring", stiffness: 200 }}
          >
            {blog.title}
          </motion.h1>
          {userRole === "admin" && (
            <div className="flex items-center gap-3 justify-end sm:justify-start">
              <div className="flex items-center gap-3 justify-end sm:justify-start">
                <AlertDialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => setIsEditDialogOpen(true)}
                        >
                          <Edit className="size-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="text-sm">
                        Edit Blog
                      </TooltipContent>
                    </Tooltip>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[370px] sm:max-w-fit max-h-[600px] overflow-x-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Blog</AlertDialogTitle>
                      <AlertDialogDescription>
                        Make changes to the blog post below.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="title"
                          className="text-sm font-medium mb-1"
                        >
                          Title
                        </Label>
                        <Input
                          id="title"
                          type="text"
                          value={editedTitle}
                          onChange={(e) => setEditedTitle(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium mb-1"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="description"
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="category"
                          className="text-sm font-medium mb-1"
                        >
                          Category
                        </Label>
                        <Input
                          id="category"
                          type="text"
                          value={editedCategory}
                          onChange={(e) => setEditedCategory(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="content"
                          className="text-sm font-medium mb-1"
                        >
                          Content
                        </Label>
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
                            <Loader2 className="animate-spin size-5" /> Saving
                          </span>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      <Trash className="size-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-sm">
                    Delete Blog
                  </TooltipContent>
                </Tooltip>
                <AlertDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <AlertDialogContent className="max-w-[370px] sm:max-w-lg">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this blog? This action
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
                      <Button variant="destructive" onClick={handleDeleteBlog}>
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </motion.div>
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            className="relative w-full rounded-lg overflow-hidden"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AspectRatio ratio={21 / 9}>
              <Image
                src={blog.coverImage}
                alt={blog.title || "Blog cover image"}
                className="object-cover"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </AspectRatio>
          </motion.div>
        </motion.div>
        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-none shadow-none bg-secondary dark:bg-[#202022]">
            <CardContent className="p-0 border-none shadow-none">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="px-8 pt-8"
              >
                <Badge
                  variant="default"
                  onClick={handleShare}
                  className="cursor-pointer text-sm font-medium gap-2"
                >
                  {blog.category}
                </Badge>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-justify sm:text-lg text-muted-foreground p-8 pt-4"
              >
                {blog.description}
              </motion.p>
              <motion.div
                className="max-w-full prose dark:prose-invert bg-secondary rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className="max-w-full prose dark:prose-invert bg-secondary rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <Editor
                    key={blog.content}
                    editable={false}
                    onChange={() => {}}
                    initialContent={blog.content}
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div className="flex items-center gap-3 border-b pb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={blogData?.user?.imageUrl} />
            <AvatarFallback>
              {blogData?.user?.firstName?.[0] ?? ""}
              {blogData?.user?.lastName?.[0] ?? ""}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold">
              {blogData?.user?.firstName} {blogData?.user?.lastName}
            </h2>
            <p className="text-muted-foreground">Frontend developer</p>
          </div>
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3 pb-4 pt-7"
        >
          <motion.div>
            <Badge
              variant="outline"
              onClick={handleLike}
              className={`cursor-pointer px-4 py-2 text-sm font-medium gap-2 hover:bg-secondary ${isLiked ? "text-red-500" : ""}`}
            >
              <HeartIcon className={`size-4 ${isLiked && "fill-current"}`} />
              <span>{localLikes}</span>
            </Badge>
          </motion.div>
          <motion.div>
            <Badge
              variant="outline"
              onClick={handleCommentClick}
              className="cursor-pointer px-4 py-2 text-sm font-medium gap-2 hover:bg-secondary"
            >
              <MessageCircleMore className="size-4" />
              <span>{comments.length}</span>
            </Badge>
          </motion.div>
          <motion.div>
            <Badge
              variant="outline"
              onClick={handleShare}
              className="cursor-pointer px-5 py-2.5 text-sm font-medium gap-2 hover:bg-secondary"
            >
              <Share2 className="size-4" />
            </Badge>
          </motion.div>
        </motion.div>
        <AnimatePresence>
          {showCommentInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <Textarea
                className="w-full p-3 border rounded-md resize-none dark:border-secondary dark:bg-popover"
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-2 mt-4"
              >
                <Button
                  onClick={handlePublishComment}
                  className="flex items-center gap-2"
                >
                  <Edit className="size-4" />
                  Publish
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCommentInput(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {comments.length > 0 && (
          <motion.div className="mt-4 space-y-2">
            <LayoutGroup>
              <AnimatePresence>
                {displayedComments.map((c) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={commentVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-3 rounded-xl group shadow-none hover:bg-accent/50 transition-colors dark:bg-popover">
                      <div className="flex gap-3 items-start">
                        <Avatar className="h-10 w-10 mt-2">
                          <AvatarImage src={c.userImage} />
                          <AvatarFallback>
                            {c.firstName[0]}
                            {c.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="flex items-baseline gap-2">
                              <h4 className="text-sm font-semibold">
                                {c.firstName} {c.lastName}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(c.timestamp), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            {user?.id === c.userId && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="ml-auto opacity-0 group-hover:opacity-100"
                                  >
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                  >
                                    <AlertDialog>
                                      <AlertDialogTrigger className="flex items-center gap-2 w-full text-left text-red-500">
                                        <Trash className="size-4" />
                                        Delete Comment
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle>
                                            Delete Comment?
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            This will permanently delete this
                                            comment from the blog.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <Button
                                            variant="destructive"
                                            onClick={() =>
                                              handleDeleteComment(c.id)
                                            }
                                          >
                                            Delete
                                          </Button>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                          <p className="text-sm text-foreground">
                            {expandedComments[c.id]
                              ? c.comment
                              : c.comment.length > 220
                                ? `${c.comment.substring(0, 220)}......`
                                : c.comment}
                            {c.comment.length > 220 && (
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 ml-2 text-muted-foreground hover:text-foreground"
                                onClick={() => toggleCommentExpansion(c.id)}
                              >
                                {expandedComments[c.id]
                                  ? "Show less"
                                  : "Show more"}
                              </Button>
                            )}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </LayoutGroup>
            {comments.length > 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground mt-2"
                  onClick={() => setShowAllComments(!showAllComments)}
                >
                  {showAllComments
                    ? "Show fewer comments"
                    : `Show all ${comments.length} comments`}
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
      <RandomBlogs />
      <MainFooter />
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-20">
      <div className="space-y-8">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[320px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
