"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const ScrollButton = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 200) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      className={`fixed cursor-pointer flex z-50 items-center justify-center border-none size-12 text-2xl bottom-4 transition-all bg-primary opacity-75 hover:opacity-100 duration-300 ${
        showButton ? "right-6" : "-right-16"
      }`}
      onClick={scrollToTop}
    >
      <ArrowUp className="size-7 text-white" />
    </button>
  );
};

export default ScrollButton;
