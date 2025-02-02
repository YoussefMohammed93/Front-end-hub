import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { format } from "date-fns";
import { Badge } from "./ui/badge";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

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

export const RandomBlogs = () => {
  const allBlogs = useQuery(api.blogs.getAllBlogs, {});

  const randomBlogs = useMemo(() => {
    if (!allBlogs) return [];
    const shuffled = [...allBlogs].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }, [allBlogs]);


  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5 }}
      className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8"
    >
      <motion.h2
        className="text-3xl md:text-4xl mb-10 text-center font-semibold md:font-bold"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Blogs you may like
      </motion.h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {randomBlogs?.map((blog) => (
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
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>
                  <Badge className="absolute top-2 left-2 z-10">
                    {blog.category}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <motion.div
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="w-full cursor-pointer"
                      >
                        <CardTitle className="line-clamp-1 text-lg font-semibold relative z-10">
                          {blog.title}
                        </CardTitle>
                      </motion.div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto max-w-sm">
                      <p className="text-sm font-medium">{blog.title}</p>
                    </HoverCardContent>
                  </HoverCard>
                  <motion.div
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <p className="text-muted-foreground line-clamp-3 text-sm relative z-10">
                      {blog.description}
                    </p>
                  </motion.div>
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
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
