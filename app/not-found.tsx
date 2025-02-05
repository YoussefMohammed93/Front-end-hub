import { Button } from "@/components/ui/button";
import { Undo } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg mt-2 text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Button variant="default" asChild className="mt-3">
        <Link href="/" className="flex items-center gap-2">
          <Undo />
          Home page
        </Link>
      </Button>
    </div>
  );
}
