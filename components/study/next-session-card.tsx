import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface NextSessionCardProps {
  subject: string;
  timeRange: string;
  className?: string;
}

export function NextSessionCard({ subject, timeRange, className }: NextSessionCardProps) {
  return (
    <Card className={cn("p-6 flex items-center justify-between bg-secondary/30 border-transparent", className)}>
      <div>
        <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
          Next Session
        </h4>
        <p className="text-lg font-medium">{subject}</p>
      </div>
      <div className="text-right">
        <span className="font-mono text-muted-foreground">{timeRange}</span>
      </div>
    </Card>
  );
}
