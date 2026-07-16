import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  completed: number;
  total: number;
  className?: string;
}

export function ProgressIndicator({ completed, total, className }: ProgressIndicatorProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex gap-2 items-end h-8">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-full bg-primary rounded-t-sm transition-all duration-300",
              i < completed ? "h-full" : "h-[20%] opacity-20"
            )}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-center">
        {completed} / {total} Sessions Completed
      </p>
    </div>
  );
}
