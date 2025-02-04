import Link from "next/link";

export const DocumentationLogo = () => {
  return (
    <Link href="/">
      <span className="text-2xl font-bold bg-gradient-to-r from-primary to-sky-600 bg-clip-text text-transparent">
        Frontend Hub
      </span>
    </Link>
  );
};
