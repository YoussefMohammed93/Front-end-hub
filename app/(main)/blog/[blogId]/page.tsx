"use client";

import Image from "next/image";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { MainHeader } from "@/components/header";
import { MainFooter } from "@/components/footer";
import { Id } from "@/convex/_generated/dataModel";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { HeartIcon, MessageCircleMore, Share2 } from "lucide-react";

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
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function BlogIdPage({ params }: BlogIdPageProps) {
  const blogId = params?.blogId as string;
  const blog = useQuery(api.blogs.getBlog, { blogId });

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

  if (!blog) {
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

  return (
    <div>
      <MainHeader />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tighter">
            {blog.title}
          </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <div className="relative w-full rounded-lg overflow-hidden">
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
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <Card className="border-none shadow-none bg-secondary dark:bg-popovercursor-pointer ">
            <CardContent className="p-0 border-none shadow-none">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-base md:text-justify sm:text-lg text-muted-foreground mb-6 p-8"
              >
                {blog.description}
              </motion.p>

              <div className="max-w-full prose dark:prose-invert bg-secondary rounded-xl">
                <Editor
                  editable={false}
                  onChange={() => {}}
                  initialContent={blog.content}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="flex items-center justify-end gap-3"
        >
          <Badge
            variant="secondary"
            className="cursor-pointer px-4 py-2 text-sm font-medium gap-2"
          >
            <HeartIcon className="size-4" />
            <span>0</span>
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer px-4 py-2 text-sm font-medium gap-2"
          >
            <MessageCircleMore className="size-4" />
            <span>0</span>
          </Badge>
          <Badge
            variant="secondary"
            className="cursor-pointer px-5 py-2.5 text-sm font-medium gap-2"
          >
            <Share2 className="size-4" />
          </Badge>
        </motion.div>
      </motion.div>
      <MainFooter />
    </div>
  );
}
