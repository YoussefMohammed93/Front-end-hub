import { DocumentationLogo } from "./logo";
import UserButton from "@/components/user-button";

export const DocumentationHeader = () => {
  return (
    <header className="flex items-center justify-between py-1.5 px-3 bg bg-sidebar border-b border-slate-200 dark:border-gray-800">
      <DocumentationLogo />
      <div>
        <UserButton />
      </div>
    </header>
  );
};
