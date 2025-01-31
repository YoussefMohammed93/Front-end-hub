"use client";

import Link from "next/link";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "@/components/ui/button";
import UserButton from "@/components/UserButton";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "convex/react";
import { AlertTriangle, Edit, FileImage, Loader2, Undo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function CreateBlogPage() {
  const user = useAuth();
  const router = useRouter();

  const { userId } = useAuth();
  const { edgestore } = useEdgeStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userRole = useQuery(api.users.getUserRole);
  const createBlogMutation = useMutation(api.blogs.createBlog);

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

    if (!title.trim() || !description.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!coverImage) {
      toast.error("Please upload a cover image");
      setIsSubmitting(false);
      return;
    }

    if (coverImage.size > 5 * 1024 * 1024) {
      toast.error("Cover image must be less than 5MB");
      setIsSubmitting(false);
      return;
    }

    try {
      const coverImageUrl = await edgestore.publicFiles.upload({
        file: coverImage,
      });

      const blog = await createBlogMutation({
        title: title.trim(),
        description: description.trim(),
        coverImage: coverImageUrl.url,
        content,
      });

      if (!blog?.blogId) {
        throw new Error("Blog creation failed - no blog ID returned");
      }

      toast.success("Blog published successfully!");

      setTitle("");
      setDescription("");
      setContent("");
      setCoverImage(null);

      router.push(`/blog/${blog.blogId}`);
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Failed to create blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setCoverImage(file);
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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="sticky top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-4 group">
            <motion.img
              src="./logo.svg"
              alt="logo"
              className="size-10 group-hover:scale-110 transition-transform"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 1 }}
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent">
              Frontend Hub
            </span>
          </Link>
          {user.isSignedIn ? (
            <UserButton />
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                asChild
                variant="outline"
                className="rounded-full text-base font-medium"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </motion.header>
      <motion.div
        className="max-w-4xl mx-auto p-4 sm:p-8 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent leading-loose mb-10"
        >
          <span className="inline-block">Create a new blog</span>
        </motion.h1>
        <motion.form
          variants={containerVariants}
          className="flex flex-col gap-6 sm:gap-8 bg-card dark:bg-muted/50 p-5 rounded-xl border"
          onSubmit={handleSubmit}
        >
          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-lg font-semibold">Blog title</Label>
            <Input
              placeholder="Enter your blog title..."
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 text-lg rounded-lg transition-shadow focus:ring-2 focus:ring-primary bg-background dark:bg-popover"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-lg font-semibold">Blog description</Label>
            <Textarea
              placeholder="Write a compelling description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-3 text-lg rounded-lg min-h-[120px] transition-shadow focus:ring-2 focus:ring-primary bg-background dark:bg-popover"
            />
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-lg font-semibold">Cover Image</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground/25"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <FileImage className="size-12 mx-auto mb-4 text-muted-foreground" />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="cursor-pointer text-primary hover:text-primary/80 transition-colors"
              >
                Click to upload or drag and drop
              </Label>
              {coverImage && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Selected: {coverImage.name}
                </p>
              )}
              {coverImage && coverImage.size > 5 * 1024 * 1024 && (
                <div className="flex items-center gap-2 text-sm text-destructive mt-2 justify-center">
                  <AlertTriangle className="size-5" />
                  <p>Image must be less than 5MB</p>
                </div>
              )}
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="space-y-3">
            <Label className="text-lg font-semibold">Blog content</Label>
            <Editor
              editable={true}
              onChange={(content) => setContent(content)}
            />
          </motion.div>
          <motion.div variants={itemVariants} className="flex justify-end">
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
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </motion.div>
        </motion.form>
      </motion.div>
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t"
      >
        <div className="pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 place-items-start md:place-items-center max-w-7xl mx-auto gap-8 px-4 sm:px-6 md:px-8 text-sm">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Frontend Hub</h3>
              <p className="text-muted-foreground">
                Empowering developers with web development resources.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#faq" className="hover:text-primary">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="hover:text-primary">
                    Blogs
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/courses" className="hover:text-primary">
                    Courses
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-primary">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/examples" className="hover:text-primary">
                    Code Examples
                  </Link>
                </li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
            >
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/twitter" className="hover:text-primary">
                    Linked in
                  </Link>
                </li>
                <li>
                  <Link href="/github" className="hover:text-primary">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="/discord" className="hover:text-primary">
                    Instagram
                  </Link>
                </li>
              </ul>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-8 py-4 border-t text-center text-muted-foreground"
          >
            © {new Date().getFullYear()} Frontend Hub, All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </main>
  );
}
