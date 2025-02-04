import Link from "next/link";
import { NavMenu } from "./nav";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import UserButton from "./user-button";
import { useAuth } from "@clerk/nextjs";

export const MainHeader = () => {
  const user = useAuth();

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b z-50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-4 group">
          <motion.img
            src="../logo.svg"
            alt="logo"
            className="size-10 group-hover:scale-110 transition-transform"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 1 }}
          />
          <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent">
            Frontend Hub
          </span>
        </Link>
        <div className="flex items-center gap-5">
          <NavMenu />
          <>
            {user.isSignedIn ? (
              <UserButton />
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full text-sm sm:text-base"
                >
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </motion.div>
            )}
          </>
        </div>
      </div>
    </motion.header>
  );
};
