import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudyCardProps {
  subject: string;
  timeRange: string;
  remainingTime: string;
  onComplete?: () => void;
  className?: string;
}

export function StudyCard({
  subject,
  timeRange,
  remainingTime,
  onComplete,
  className,
}: StudyCardProps) {
  return (
    <Card className={cn("p-6 sm:p-8 border-2 border-primary shadow-sm relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 p-6 sm:p-8">
        <div className="px-3 py-1 bg-secondary rounded-full text-[10px] font-bold uppercase tracking-widest text-secondary-foreground">
          Deep Work Active
        </div>
      </div>

      <div className="flex flex-col mb-8">
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Current Session
        </span>
        <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight">{subject}</h3>
      </div>

      <div className="flex items-center gap-6 sm:gap-10 mb-8">
        <div className="flex flex-col">
          <span className="text-4xl sm:text-[64px] font-light leading-none font-mono tracking-tighter">
            {remainingTime}
          </span>
          <span className="text-xs uppercase tracking-widest mt-2 sm:mt-3 text-muted-foreground font-medium">
            Remaining in focus
          </span>
        </div>
        <div className="h-12 w-px bg-border shrink-0"></div>
        <div className="flex flex-col">
          <span className="text-2xl sm:text-[32px] font-light leading-none font-mono tracking-tight">
            {timeRange}
          </span>
          <span className="text-xs uppercase tracking-widest mt-2 sm:mt-3 text-muted-foreground font-medium">
            Time slot
          </span>
        </div>
      </div>

      <Button size="lg" className="w-full sm:w-auto" onClick={onComplete}>
        <Check className="mr-2 h-5 w-5" />
        Complete Session
      </Button>
    </Card>
  );
}
