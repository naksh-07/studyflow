import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-20 flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
      <h1 className="text-xl font-semibold tracking-tight">StudyFlow</h1>
      <Button variant="ghost" size="icon" onClick={onMenuClick}>
        <Menu className="h-6 w-6" />
        <span className="sr-only">Open Menu</span>
      </Button>
    </header>
  );
}
