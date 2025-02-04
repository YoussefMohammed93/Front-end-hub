import Link from "next/link";
import { motion } from "framer-motion";

export const DocumentationLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-4 group">
      <motion.img
        src="/logo.svg"
        alt="logo"
        className="size-10 group-hover:scale-110 transition-transform"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 1 }}
      />
    </Link>
  );
};
