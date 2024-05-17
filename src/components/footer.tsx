"use client";

import { Github } from "lucide-react";
import { Button } from "./ui/button";

export const Footer = () => {
  return (
    <footer className="bottom-0 w-full bg-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-6 pb-8 lg:px-8">
        <div className="flex items-center justify-between pt-8">
          <p className="text-xs leading-5 text-gray-300">
            © 2024 SnapCard. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              href="https://github.com/bypschroeder/snap-card"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="rounded-full text-gray-300">
                <Github />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
