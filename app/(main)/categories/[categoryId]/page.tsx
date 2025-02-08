/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useQuery } from "convex/react";
import { Clock, Heart } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MainHeader } from "@/components/header";
import { MainFooter } from "@/components/footer";
import { VALID_CATEGORIES } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const ITEMS_PER_PAGE = 8;

const BlogCard = React.memo(function BlogCard({ blog }: { blog: any }) {
  return (
    <motion.div
      key={blog.blogId}
      variants={itemVariants}
      layout
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blog/${blog.blogId}`}>
        <Card className="h-full shadow-none relative overflow-hidden group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
            transition={{ duration: 0.4 }}
          />
          <CardHeader className="p-0 relative">
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4 / 3" }}
            >
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>
            <Badge className="absolute top-2 left-2 z-10">
              {blog.category}
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-2">
            <motion.div
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <CardTitle className="line-clamp-2 text-lg font-semibold relative z-10">
                {blog.title}
              </CardTitle>
            </motion.div>
            <motion.div initial={{ opacity: 0.8 }} whileHover={{ opacity: 1 }}>
              <p className="text-muted-foreground line-clamp-3 text-sm relative z-10">
                {blog.description}
              </p>
            </motion.div>
            <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
              <div className="flex items-center gap-2">
                <Clock className="size-4" />
                <span className="font-medium text-foreground/80">
                  {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                </span>
              </div>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 mt-1"
              >
                <Heart className="size-4 text-red-500" />
                <span className="font-medium">{blog.likes}</span>
              </Badge>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
});

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryId = params.categoryId as string;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!VALID_CATEGORIES.includes(categoryId)) {
      router.push("/404");
    }
  }, [categoryId, router]);

  const results = useQuery(api.blogs.getBlogsByCategory, {
    category: categoryId,
  });

  const isLoading = !results;

  const totalPages = useMemo(() => {
    return results?.length ? Math.ceil(results.length / ITEMS_PER_PAGE) : 0;
  }, [results]);

  const paginatedBlogs = useMemo(() => {
    if (!results) return [];
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const handlePageChange = useCallback((newPage: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(newPage);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-8 text-center capitalize"
        >
          {categoryId} Blogs
        </motion.h1>
        <motion.div className="text-center mb-10">
          {isLoading ? (
            <Skeleton className="h-6 w-20 inline-block" />
          ) : (
            <Badge variant="secondary" className="ml-4 text-sm font-medium">
              {results.length} blogs
            </Badge>
          )}
        </motion.div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Card key={i} className="shadow-none rounded-lg">
                <Skeleton className="aspect-video rounded-b-none" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="text-center text-muted-foreground"
          >
            No blogs found in this category.
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="wait">
                {paginatedBlogs.map((blog) => (
                  <BlogCard key={blog.blogId} blog={blog} />
                ))}
              </AnimatePresence>
            </div>
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center mt-12"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="rounded-lg"
                      >
                        <PaginationPrevious />
                      </Button>
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => {
                      const page = i + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              isActive={page === currentPage}
                              className="rounded-lg cursor-pointer h-10 w-10"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                      if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return <PaginationEllipsis key={page} />;
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <Button
                        variant="ghost"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="rounded-lg"
                      >
                        <PaginationNext />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
      <MainFooter />
    </div>
  );
}
