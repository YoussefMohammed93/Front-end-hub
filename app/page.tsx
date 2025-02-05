"use client";

import {
  FiArrowRight,
  FiAward,
  FiMail,
  FiMessageSquare,
  FiRefreshCcw,
} from "react-icons/fi";

import {
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiStripe,
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiFampay,
  SiFastapi,
  SiH3,
  SiMonica,
} from "react-icons/si";

import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MainFooter } from "@/components/footer";
import { MainHeader } from "@/components/header";
import { Textarea } from "@/components/ui/textarea";

export default function Main() {
  const faqs = [
    {
      question: "What technologies do you cover?",
      answer:
        "We cover modern frontend technologies including React, Next.js, TypeScript, Tailwind CSS, and state management libraries.",
    },
    {
      question: "How often is content updated?",
      answer:
        "New content is added weekly to keep up with the latest trends and updates in the frontend ecosystem.",
    },
    {
      question: "Is the roadmap suitable for beginners?",
      answer:
        "Yes! Our interactive roadmap is designed to guide beginners step by step, from the basics to advanced frontend development concepts.",
    },
  ];

  const learn = [
    {
      title: "HTML",
      description: "Learn the structure of web pages with semantic HTML.",
      badge: "Basic",
    },
    {
      title: "CSS",
      description: "Master the art of styling with Cascading Style Sheets.",
      badge: "Styling",
    },
    {
      title: "JavaScript",
      description: "Understand the fundamentals of programming for the web.",
      badge: "Core Concepts",
    },
    {
      title: "Tailwind CSS",
      description: "Modern utility-first CSS framework mastery.",
      badge: "Styling",
    },
    {
      title: "React Fundamentals",
      description: "Master component-based architecture and state management.",
      badge: "Core Concepts",
    },
    {
      title: "Next.js Optimization",
      description:
        "Server-side rendering and static site generation techniques.",
      badge: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen relative flex flex-col">
      {/* Vectors */}
      <div className="relative hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -50, y: 250 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute left-0 top-0 sm:top-16"
        >
          <Image
            src="/vector.png"
            width={200}
            height={200}
            alt="vector"
            className="opacity-10 sm:opacity-20"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 0, y: -250 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute right-0 -bottom-[700px] vector-2"
        >
          <Image
            src="/vector.png"
            width={200}
            height={200}
            alt="vector"
            className="opacity-10 sm:opacity-20 rotate-180"
          />
        </motion.div>
      </div>
      <div className="bg-background">
        {/* Header */}
        <MainHeader />

        <main className="flex-1 bg-background overflow-x-hidden">
          {/* Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-grow items-center max-w-7xl mx-auto min-h-screen py-12 lg:py-20 px-4 sm:px-6 lg:px-8"
          >
            <div className="w-full text-center space-y-6 md:space-y-8">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-6 md:space-y-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex justify-center gap-2 sm:gap-3 flex-wrap"
                >
                  <div className="flex items-center gap-2 cursor-default bg-primary/10 text-primary dark:text-primary/90 dark:bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-primary/20">
                    <FiAward className="h-4 w-4" />
                    Certified Curriculum
                  </div>
                  <div className="flex items-center gap-2 cursor-default bg-primary/10 text-primary dark:text-primary/90 dark:bg-secondary/50 px-4 py-2 rounded-full text-sm font-medium transition-all hover:bg-primary/20">
                    <FiRefreshCcw className="h-4 w-4" />
                    Updated 2025
                  </div>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent leading-tight"
                >
                  <span className="inline-block">
                    Master Frontend Development
                  </span>
                  <span className="block mt-5 sm:mt-3 text-xl md:text-2xl font-semibold text-muted-foreground">
                    From Zero to Professional in 2025
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-muted-foreground max-w-2xl md:max-w-3xl mx-auto text-sm sm:text-base leading-relaxed"
                >
                  I&apos;m passionate about creating blogs that dive deep into
                  the world of{" "}
                  <span className="font-semibold text-foreground">
                    frontend development
                  </span>
                  , focusing on cutting-edge technologies like{" "}
                  <span className="font-semibold text-foreground">HTML</span>,{" "}
                  <span className="font-semibold text-foreground">CSS</span>,{" "}
                  <span className="font-semibold text-foreground">
                    JavaScript
                  </span>
                  ,{" "}
                  <span className="font-semibold text-foreground">
                    Tailwind CSS
                  </span>
                  ,{" "}
                  <span className="font-semibold text-foreground">
                    React.js
                  </span>
                  , and{" "}
                  <span className="font-semibold text-foreground">Next.js</span>
                  . I share insights, tutorials, and best practices to help
                  developers of all levels master the{" "}
                  <span className="font-semibold text-foreground">
                    frontend track.
                  </span>
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-[170px] md:max-w-lg mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 mt-8"
                >
                  {[
                    SiHtml5,
                    SiCss3,
                    SiJavascript,
                    SiTailwindcss,
                    SiReact,
                    SiNextdotjs,
                  ].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.1 }}
                      className="flex justify-center p-2.5 bg-muted rounded-lg"
                    >
                      <Icon className="h-8 w-8 text-foreground/80" />
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                >
                  <Link href="/blogs">
                    <Button size="lg">
                      <span className="flex items-center gap-2">
                        Start Learning Now
                        <FiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </Button>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs sm:text-sm text-muted-foreground mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4"
                >
                  <span>Trusted by teams at</span>
                  <div className="flex gap-3 sm:gap-4 flex-wrap justify-center mt-3 sm:mt-0">
                    <SiFampay className="h-4 w-4 sm:h-5 sm:w-5 hover:text-foreground/80 transition-colors" />
                    <SiStripe className="h-4 w-4 sm:h-5 sm:w-5 hover:text-foreground/80 transition-colors" />
                    <SiFastapi className="h-4 w-4 sm:h-5 sm:w-5 hover:text-foreground/80 transition-colors" />
                    <SiH3 className="h-4 w-4 sm:h-5 sm:w-5 hover:text-foreground/80 transition-colors" />
                    <SiMonica className="h-4 w-4 sm:h-5 sm:w-5 hover:text-foreground/80 transition-colors" />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>

          {/* Featured Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="py-10 bg-muted/50 border-y dark:border-y-black/20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2,
                  duration: 0.6,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="text-3xl font-bold text-center pb-10"
              >
                What You&apos;ll Learn
              </motion.h2>
              <div className="grid md:grid-cols-3 gap-5">
                {learn.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      delay: index * 0.15,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      y: -8,
                      transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                      },
                    }}
                    className="relative group cursor-default"
                  >
                    <Card className="h-full border dark:border-black/20 bg-background dark:bg-popover relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        transition={{ duration: 0.4 }}
                      />
                      <CardHeader>
                        <motion.div
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Badge
                            variant="default"
                            className="w-fit mb-2 relative z-10"
                          >
                            {item.badge}
                          </Badge>
                        </motion.div>
                        <CardTitle className="relative z-10">
                          {item.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <motion.div
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <CardDescription className="text-muted-foreground relative z-10">
                            {item.description}
                          </CardDescription>
                        </motion.div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-10"
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-center mb-12"
              >
                Frequently Asked Questions
              </motion.h2>
              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -10 : 10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <AccordionItem
                        value={`faq-${index}`}
                        className="bg-background dark:bg-popover"
                      >
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="py-10 bg-muted/50 border-y dark:border-y-black/20"
          >
            <div className="px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ scale: 0.95 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto"
              >
                <Card className="relative overflow-hidden border dark:border-black/20 border-border dark:bg-popover">
                  <motion.div
                    initial={{ rotate: 45, scale: 2, opacity: 0 }}
                    whileInView={{ rotate: 0, scale: 1, opacity: 0.1 }}
                    viewport={{ once: true }}
                    className="absolute -top-20 -right-20 bg-primary/10 w-40 h-40 rounded-full"
                  />
                  <CardHeader className="text-center">
                    <motion.div
                      initial={{ y: 20 }}
                      whileInView={{ y: 0 }}
                      className="flex justify-center mb-2"
                    >
                      <FiMail className="h-12 w-12 text-primary" />
                    </motion.div>
                    <CardTitle className="text-2xl">Contact Us</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Have questions? We&apos;re here to help!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="grid md:grid-cols-2 gap-6"
                      >
                        <Input
                          placeholder="Your Name"
                          required
                          minLength={3}
                          maxLength={50}
                          pattern="[A-Za-z ]+"
                          title="Please enter a valid name (letters and spaces only)"
                          className="bg-background dark:bg-background/50"
                        />
                        <Input
                          placeholder="Your Email"
                          type="email"
                          required
                          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                          title="Please enter a valid email address"
                          className="bg-background dark:bg-background/50"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Textarea
                          placeholder="Your Message"
                          className="h-32 resize-none bg-background dark:bg-background/50"
                          required
                          minLength={10}
                          maxLength={500}
                          title="Please enter at least 10 characters"
                        />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0.9 }}
                        whileInView={{ scale: 1 }}
                        className="flex justify-end"
                      >
                        <Button type="submit" className="gap-2">
                          Send Message
                          <FiMessageSquare className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <MainFooter />
      </div>
    </div>
  );
}
