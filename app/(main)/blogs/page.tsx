"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import { MainHeader } from "@/components/header";
import { MainFooter } from "@/components/footer";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const categories = [
  {
    name: "HTML",
    slug: "HTML",
    imageSrc: "/html.png",
  },
  {
    name: "CSS",
    slug: "CSS",
    imageSrc: "/css.png",
  },
  {
    name: "Javascript",
    slug: "Javascript",
    imageSrc: "/js.png",
  },
  {
    name: "Tailwind CSS",
    slug: "Tailwind CSS",
    imageSrc: "/tailwind-css.png",
  },
  {
    name: "React.Js",
    slug: "React.Js",
    imageSrc: "/react-js.png",
  },
  {
    name: "Next.Js",
    slug: "Next.Js",
    imageSrc: "/next-js.png",
  },
];

const carouselVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
};

export default function BlogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <MainHeader />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={carouselVariants}
        className="flex-1 container mx-auto px-4 py-8 md:py-12"
      >
        <motion.h1
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center"
        >
          Blogs Categories
        </motion.h1>

        <div className="relative w-full max-w-6xl mx-auto px-8 md:px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {categories.map((category) => (
                <CarouselItem
                  key={category.slug}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-5"
                >
                  <motion.div variants={itemVariants}>
                    <Link href={`/categories/${category.slug}`}>
                      <Card className="relative h-full overflow-hidden group dark:bg-popover">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                          transition={{ duration: 0.4 }}
                        />
                        <motion.div
                          className="h-full p-2.5"
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <CardContent className="p-3 md:p-6 h-full">
                            <div className="aspect-square mb-3 md:mb-4 overflow-hidden rounded-lg relative">
                              <Image
                                src={category.imageSrc}
                                alt={category.name}
                                fill
                                priority
                                className="object-cover"
                              />
                            </div>
                            <CardTitle className="text-lg md:text-xl font-semibold text-center">
                              {category.name}
                            </CardTitle>
                          </CardContent>
                        </motion.div>
                      </Card>
                    </Link>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-[44px] lg:-left-16 bg-background hover:bg-secondary dark:bg-popover dark:hover:bg-secondary" />
            <CarouselNext className="absolute -right-8 lg:-right-12 bg-background hover:bg-secondary dark:bg-popover dark:hover:bg-secondary" />
          </Carousel>
        </div>
      </motion.div>
      <MainFooter />
    </div>
  );
}
