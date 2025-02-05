"use client";

import {
  IconBrandTailwind,
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandReact,
} from "@tabler/icons-react";

import {
  CodeBracketIcon,
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  FlagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { CodeIcon, Crown } from "lucide-react";
import { MainHeader } from "@/components/header";
import { MainFooter } from "@/components/footer";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const techStack = [
  {
    name: "HTML",
    icon: IconBrandHtml5,
  },
  {
    name: "CSS",
    icon: IconBrandCss3,
  },
  {
    name: "Javascript",
    icon: IconBrandJavascript,
  },
  {
    name: "Tailwind CSS",
    icon: IconBrandTailwind,
  },
  {
    name: "React",
    icon: IconBrandReact,
  },
  {
    name: "Next.js",
    icon: IconBrandNextjs,
  },
] as const;

const fadeInUpVariant = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: { opacity: 0, y: -20 },
};

const staggerVariants = {
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function About() {
  const [yearsExperience, setYearsExperience] = useState(0);

  useEffect(() => {
    const startDate = new Date(2023, 0, 1);
    const currentDate = new Date();
    const years = currentDate.getFullYear() - startDate.getFullYear();
    setYearsExperience(years);
  }, []);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-background text-foreground"
    >
      <MainHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-12 sm:mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent leading-tight"
          >
            About Frontend Hub
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mt-3 sm:mt-5"
          >
            Your comprehensive roadmap to mastering modern frontend development
          </motion.p>
        </motion.div>
        <motion.section
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mb-16 sm:mb-20"
        >
          <Card className="group relative flex flex-col md:flex-row items-center gap-6 p-6 sm:p-8 shadow-none border hover:border-primary/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <motion.div
              variants={itemVariants}
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-primary to-accent p-1 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/me.svg"
                alt="Youssef Mohammed"
                width={192}
                height={192}
                priority
                className="object-cover rounded-full"
              />
            </motion.div>
            <motion.div
              variants={staggerVariants}
              className="flex-1 relative z-10"
            >
              <CardHeader className="p-2 sm:p-6">
                <motion.div variants={itemVariants}>
                  <CardTitle className="text-2xl sm:text-3xl">
                    Youssef Mohammed
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                <motion.div
                  variants={staggerVariants}
                  className="flex flex-wrap gap-2 mb-4"
                >
                  <motion.div variants={itemVariants}>
                    <Badge className="flex items-center gap-1 text-xs sm:text-sm">
                      <AcademicCapIcon className="w-4 h-4" />
                      Computer Science Student
                    </Badge>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <CodeIcon className="w-4 h-4" />
                      Front End Developer
                    </Badge>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <ClockIcon className="w-4 h-4" />
                      {yearsExperience}+ Years Experience
                    </Badge>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Badge
                      variant="gold"
                      className="flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <Crown className="w-4 h-4" />
                      Owner of Frontend hub
                    </Badge>
                  </motion.div>
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground leading-relaxed text-sm sm:text-base"
                >
                  A 19-year-old frontend enthusiast from Mansoura University,
                  Egypt. Dedicated to creating quality educational content that
                  bridges the gap between academic theory and real-world
                  development.
                </motion.p>
              </CardContent>
            </motion.div>
          </Card>
        </motion.section>
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="group relative overflow-hidden hover:border-primary/30 transition-all shadow-none h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2 px-4 sm:px-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-fit p-2 sm:p-3 rounded-lg bg-primary/10"
                >
                  <CodeBracketIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl mt-3 sm:mt-4">
                  Comprehensive Documentation
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-lg">
                  Master web development fundamentals with our interactive
                  guides. Learn HTML, CSS, and JavaScript through clear
                  tutorials and real-world projects. We simplify complex
                  concepts, blending theory with hands-on practice. Explore best
                  practices and essential tools to build responsive, dynamic
                  websites with confidence.
                </p>
                <motion.div
                  className="flex flex-wrap gap-2 mt-auto"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.1 },
                    },
                  }}
                >
                  {techStack.map((tech, index) => (
                    <motion.div
                      key={index}
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                      }}
                    >
                      <Badge
                        variant="outline"
                        className="gap-1 rounded-lg font-medium text-xs"
                      >
                        <tech.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                        {tech.name}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card className="group relative overflow-hidden hover:border-primary/30 transition-all shadow-none h-full">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="pb-2 px-4 sm:px-6">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-fit p-2 sm:p-3 rounded-lg bg-primary/10"
                >
                  <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>
                <CardTitle className="text-xl sm:text-2xl mt-3 sm:mt-4">
                  Expert-curated Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 sm:px-6">
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-lg">
                  Stay updated with in-depth tutorials and industry insights on
                  cutting-edge frontend technologies.
                </p>
                <div className="space-y-4 sm:space-y-6">
                  <motion.div
                    className="space-y-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: { staggerChildren: 0.2 },
                      },
                    }}
                  >
                    <div>
                      <div className="flex justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-sm sm:text-base">
                          Learning Progress
                        </h4>
                      </div>
                      <motion.div
                        variants={{
                          hidden: { width: 0 },
                          visible: { width: "100%" },
                        }}
                      >
                        <Progress
                          value={85}
                          className="h-2 sm:h-2.5 bg-secondary"
                        />
                      </motion.div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-2 sm:mb-3">
                        <h4 className="font-semibold text-sm sm:text-base">
                          Advanced Concepts
                        </h4>
                      </div>
                      <motion.div
                        variants={{
                          hidden: { width: 0 },
                          visible: { width: "100%" },
                        }}
                      >
                        <Progress
                          value={70}
                          className="h-2 sm:h-2.5 bg-secondary"
                        />
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="relative overflow-hidden"
          aria-label="Our Core Mission Section"
        >
          <Card className="relative border-0 dark:border">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="mx-auto mb-4 sm:mb-6 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    type: "spring",
                    stiffness: 100,
                    damping: 10,
                  }}
                >
                  <FlagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                </motion.div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-center">
                Our Core Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8">
              <motion.div
                className="grid gap-6 sm:gap-8 md:grid-cols-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
              >
                <motion.div
                  variants={fadeInUpVariant}
                  className="group relative border overflow-hidden hover:border-primary/30 transition-all shadow-none h-full rounded-xl p-5 dark:bg-popover"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 px-4 sm:px-6 relative z-10">
                    <motion.div className="w-fit p-2 sm:p-3 rounded-lg bg-primary/10">
                      <BookOpenIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl sm:text-2xl mt-3 sm:mt-4">
                      Structured Learning
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 relative z-10">
                    <p className="text-muted-foreground text-sm sm:text-lg">
                      Curated pathways with milestone tracking and progress
                      validation
                    </p>
                  </CardContent>
                </motion.div>
                <motion.div
                  variants={fadeInUpVariant}
                  className="group relative border overflow-hidden hover:border-primary/30 transition-all shadow-none h-full rounded-xl p-5 dark:bg-popover"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 px-4 sm:px-6 relative z-10">
                    <motion.div className="w-fit p-2 sm:p-3 rounded-lg bg-primary/10">
                      <CodeBracketIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl sm:text-2xl mt-3 sm:mt-4">
                      Real-World Practice
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 relative z-10">
                    <p className="text-muted-foreground text-sm sm:text-lg">
                      Project-based learning with industry-standard requirements
                    </p>
                  </CardContent>
                </motion.div>
                <motion.div
                  variants={fadeInUpVariant}
                  className="group relative border overflow-hidden hover:border-primary/30 transition-all shadow-none h-full rounded-xl p-5 dark:bg-popover"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CardHeader className="pb-2 px-4 sm:px-6 relative z-10">
                    <motion.div className="w-fit p-2 sm:p-3 rounded-lg bg-primary/10">
                      <UserGroupIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                    </motion.div>
                    <CardTitle className="text-xl sm:text-2xl mt-3 sm:mt-4">
                      Community Growth
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 sm:px-6 relative z-10">
                    <p className="text-muted-foreground text-sm sm:text-lg">
                      Collaborative learning environment with peer reviews
                    </p>
                  </CardContent>
                </motion.div>
              </motion.div>
              <div className="mt-8 sm:mt-12 max-w-4xl mx-auto text-center">
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
                  We empower developers through immersive learning experiences
                  that combine cutting-edge curriculum with practical
                  application, bridging the gap between theoretical knowledge
                  and professional implementation.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <MainFooter />
    </motion.div>
  );
}
