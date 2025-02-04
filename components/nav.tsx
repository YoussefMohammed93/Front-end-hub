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
              <Link href="/docs/HTML" className="px-4 py-2 hover:bg-accent">
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
          <NavigationMenuTrigger>Documentation</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 w-[300px] md:w-[400px] lg:grid-cols-[.75fr_1fr]">
              <ListItem href="/docs/HTML" title="HTML">
                Semantic markup, structure, and essential HTML5 elements.
              </ListItem>
              <ListItem href="/docs/CSS" title="CSS">
                Styling, layout techniques, responsive design principles.
              </ListItem>
              <ListItem href="/docs/Javascript" title="JavaScript">
                Core language features, DOM manipulation, modern ES6+ syntax.
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
