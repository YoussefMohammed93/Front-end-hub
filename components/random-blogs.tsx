import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Heart, Loader2 } from "lucide-react";
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

export const RandomBlogs = () => {
  const allBlogs = useQuery(api.blogs.getAllBlogs, {});
  const randomBlogsRef = useRef<
    (typeof allBlogs extends undefined ? null : typeof allBlogs) | null
  >(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (allBlogs && !randomBlogsRef.current) {
      const shuffled = [...allBlogs].sort(() => 0.5 - Math.random());
      randomBlogsRef.current = shuffled.slice(0, 4);
      setInitialized(true);
    }
  }, [allBlogs]);

  if (!initialized) {
    return (
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Loader2 className="size-5 animate-spin" />
      </div>
    );
  }

  const randomBlogs = randomBlogsRef.current!;

  return (
    <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl md:text-4xl mb-10 text-center font-semibold md:font-bold">
        Blogs you may like
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {randomBlogs.map(
          (blog: {
            blogId: string;
            coverImage: string;
            title: string;
            category?: string;
            description: string;
            createdAt: number;
            likes: number;
          }) => (
            <div key={blog.blogId}>
              <Link href={`/blog/${blog.blogId}`}>
                <Card className="h-full shadow-none relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
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
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                    </div>
                    <Badge className="absolute top-2 left-2 z-10">
                      {blog.category || "Uncategorized"}
                    </Badge>
                  </CardHeader>
                  <CardContent className="p-4 space-y-2">
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="w-full cursor-pointer">
                          <CardTitle className="line-clamp-1 text-lg font-semibold relative z-10">
                            {blog.title}
                          </CardTitle>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-auto max-w-sm">
                        <p className="text-sm font-medium">{blog.title}</p>
                      </HoverCardContent>
                    </HoverCard>
                    <div>
                      <p className="text-muted-foreground line-clamp-3 text-sm relative z-10">
                        {blog.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                      <span className="font-medium text-foreground/80">
                        {format(new Date(blog.createdAt), "MMM dd, yyyy")}
                      </span>
                      <Badge
                        variant="secondary"
                        className="flex items-center gap-2"
                      >
                        <Heart className="size-4 text-red-500" />
                        <span className="font-medium">{blog.likes}</span>
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          )
        )}
      </div>
    </section>
  );
};
