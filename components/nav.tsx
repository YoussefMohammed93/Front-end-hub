"use client";

import Link from "next/link";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

import { Button } from "@/components/ui/button";

export function NavMenu() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col gap-2 pt-6">
            <h4 className="text-sm font-medium text-muted-foreground px-4">
              Documentation
            </h4>
            <SheetClose asChild>
              <Link href="/docs/HTML/330dd9c5-9888-4ac8-0828-9f9131ea0f79" className="px-4 py-2 hover:bg-accent">
                HTML
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/docs/CSS" className="px-4 py-2 hover:bg-accent">
                CSS
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/docs/Javascript"
                className="px-4 py-2 hover:bg-accent"
              >
                JavaScript
              </Link>
            </SheetClose>
            <h4 className="text-sm font-medium text-muted-foreground px-4 mt-4">
              Pages
            </h4>
            <SheetClose asChild>
              <Link href="/blogs" className="px-4 py-2 hover:bg-accent">
                Blogs
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/roadmap" className="px-4 py-2 hover:bg-accent">
                Roadmap
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/about" className="px-4 py-2 hover:bg-accent">
                About
              </Link>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">Documentation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-4 p-5 w-[320px] md:w-[420px] lg:grid-cols-1">
              <ListItem
                href="/docs/HTML/330dd9c5-9888-4ac8-0828-9f9131ea0f79"
                title="HTML"
                className="p-4 border rounded-lg hover:bg-muted transition"
              >
                <p className="text-sm text-muted-foreground">
                  Semantic markup, structure, and essential HTML5 elements.
                </p>
              </ListItem>
              <ListItem
                href="/docs/CSS"
                title="CSS"
                className="p-4 border rounded-lg hover:bg-muted transition"
              >
                <p className="text-sm text-muted-foreground">
                  Styling, layout techniques, responsive design principles.
                </p>
              </ListItem>
              <ListItem
                href="/docs/Javascript"
                title="JavaScript"
                className="p-4 border rounded-lg hover:bg-muted transition"
              >
                <p className="text-sm text-muted-foreground">
                  Core language features, DOM manipulation, modern ES6+ syntax.
                </p>
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blogs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blogs
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/roadmap" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Roadmap
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/about" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              About
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <a
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem";
