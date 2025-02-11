"use client";

import {
  IconBrandTailwind,
  IconBrandHtml5,
  IconBrandCss3,
  IconBrandJavascript,
  IconBrandNextjs,
  IconBrandReact,
  IconBrandBootstrap,
  IconBrandGithub,
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
    name: "BootStrap",
    icon: IconBrandBootstrap,
  },
  {
    name: "Github",
    icon: IconBrandGithub,
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
    const startDate = new Date(2022, 0, 1);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <motion.div
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-16"
        >
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent leading-tight"
          >
            About Frontend Hub
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mt-6 font-light"
          >
            Empowering developers with modern tools and practical knowledge
          </motion.p>
        </motion.div>
        <motion.section
          variants={staggerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          className="mb-20"
        >
          <Card className="group relative overflow-hidden border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 group-hover:bg-primary/5 transition-colors">
              <motion.div
                variants={itemVariants}
                className="relative w-52 h-52 rounded-2xl bg-gradient-to-br from-primary to-accent p-1.5"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 blur-xl" />
                <Image
                  src="/me.svg"
                  alt="Youssef Mohammed"
                  width={208}
                  height={208}
                  priority
                  className="object-cover rounded-2xl"
                />
              </motion.div>
              <motion.div
                variants={staggerVariants}
                className="flex-1 space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Youssef Mohammed
                  </h2>
                </motion.div>
                <motion.div
                  variants={staggerVariants}
                  className="flex flex-wrap gap-3"
                >
                  {[
                    {
                      icon: AcademicCapIcon,
                      label: "Computer Science Student",
                    },
                    { icon: CodeIcon, label: "Frontend Developer" },
                    { icon: ClockIcon, label: `${yearsExperience}+ Years Exp` },
                    { icon: Crown, label: "Founder" },
                  ].map((item, index) => (
                    <motion.div key={index} variants={itemVariants}>
                      <Badge className="gap-2 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/15 border border-primary/20 text-foreground">
                        <item.icon className="w-4 h-4 text-primary" />
                        {item.label}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground leading-relaxed text-lg font-light"
                >
                  Passionate 19-year-old developer from Egypt bridging academic
                  theory with real-world application through immersive learning
                  experiences and cutting-edge curriculum design.
                </motion.p>
              </motion.div>
            </div>
          </Card>
        </motion.section>
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <Card className="relative overflow-hidden border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
              <div className="p-8 group-hover:bg-primary/10 transition-colors">
                <CardHeader className="pb-0">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <CodeBracketIcon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      Modern Tech Stack
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground text-lg font-light">
                    Master industry-standard tools through project-based
                    learning and interactive documentation.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {techStack.map((tech, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="gap-2 px-4 py-2 rounded-full border-primary/20 bg-primary/5"
                      >
                        <tech.icon className="w-5 h-5 text-primary" />
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
            <Card className="relative overflow-hidden border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
              <div className="p-8 group-hover:bg-primary/10 transition-colors">
                <CardHeader className="pb-0">
                  <div className="mb-6 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <BookOpenIcon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-2xl">
                      Learning Pathways
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { label: "Core Fundamentals", value: 90 },
                      { label: "Advanced Concepts", value: 75 },
                      { label: "Project Readiness", value: 85 },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">
                            {item.label}
                          </span>
                          <span className="text-primary font-medium">
                            {item.value}%
                          </span>
                        </div>
                        <Progress
                          value={item.value}
                          className="h-2.5 bg-primary/10"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="h-full border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm">
              <div className="p-5 sm:p-8 group-hover:bg-primary/10 transition-colors">
                <CardContent className="p-0 space-y-8">
                  <div className="space-y-2">
                    <FlagIcon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-3xl font-bold">Our Philosophy</h3>
                    <p className="text-muted-foreground text-lg font-light">
                      Bridging the gap between theoretical knowledge and
                      professional implementation through immersive learning
                      experiences.
                    </p>
                  </div>
                  <div className="space-y-6">
                    {[
                      {
                        icon: UserGroupIcon,
                        title: "Community First",
                        content:
                          "Collaborative environment with peer reviews and mentorship",
                      },
                      {
                        icon: CodeIcon,
                        title: "Real-World Focus",
                        content:
                          "Project-based curriculum mirroring industry standards",
                      },
                      {
                        icon: AcademicCapIcon,
                        title: "Progressive Learning",
                        content: "Structured pathways with milestone tracking",
                      },
                      {
                        icon: FlagIcon,
                        title: "Career Support",
                        content:
                          "Resume reviews, interview prep, and job placement guidance",
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex gap-4 p-4 rounded-xl bg-popover/50 border hover:border-primary/30 transition-colors group"
                      >
                        <div className="flex items-center justify-center p-4 px-5 sm:px-4 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <item.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold">
                            {item.title}
                          </h4>
                          <p className="text-muted-foreground font-light">
                            {item.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          </motion.div>
        </div>
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {[
            { value: "1000+", label: "Active Learners", icon: UserGroupIcon },
            { value: "50+", label: "Learning Hours", icon: BookOpenIcon },
            { value: "95%", label: "Satisfaction Rate", icon: Crown },
          ].map((stat, index) => (
            <Card
              key={index}
              className="group relative border hover:border-primary/30 transition-colors bg-card/50 backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 rounded-xl to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="p-6 group-hover:bg-primary/5 transition-colors">
                <CardContent className="p-0 flex items-center gap-6">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground font-light">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </motion.section>
      </main>
      <MainFooter />
    </motion.div>
  );
}
