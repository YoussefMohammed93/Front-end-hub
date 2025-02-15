"use client";

import {
  Check,
  Edit,
  LogOut,
  Monitor,
  Moon,
  Sun,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuSub,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./ui/dropdown-menu";

import Link from "next/link";
import { cn } from "@/lib/utils";
import UserAvatar from "./user-avatar";
import { useTheme } from "next-themes";
import { useQuery } from "convex/react";
import { Separator } from "./ui/separator";
import { api } from "@/convex/_generated/api";
import { IconBook } from "@tabler/icons-react";
import { useAuth, useUser } from "@clerk/nextjs";

interface UserButtonProps {
  className?: string;
}

export default function UserButton({ className }: UserButtonProps) {
  const currentUser = useUser();
  const { theme, setTheme } = useTheme();
  const userRole = useQuery(api.users.getUserRole);

  const auth = useAuth();

  const handleSignout = () => {
    auth.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={cn("flex-none rounded-full", className)}>
          <UserAvatar avatarUrl={currentUser.user?.imageUrl} size={36} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          Logged in as @{currentUser.user?.fullName}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userRole === "admin" && (
          <Link href="/create-blog">
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" />
              Create blog
            </DropdownMenuItem>
          </Link>
        )}
        {userRole === "admin" && (
          <Link href="/create-docs">
            <DropdownMenuItem>
              <IconBook stroke={2} className="size-4 mr-2" />
              Create Document
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor className="mr-2 size-4" />
            Theme
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 size-4" />
                System default
                {theme === "system" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 size-4" />
                Light
                {theme === "light" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 size-4" />
                Dark
                {theme === "dark" && <Check className="ms-2 size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <Separator className="my-1" />
        <DropdownMenuItem onClick={() => handleSignout()}>
          <LogOut className="mr-2 size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
