import * as React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({ title, description, actionLabel, onAction, className }: { title: string, description: string, actionLabel?: string, onAction?: () => void, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8", className)}>
      <h3 className="text-xl font-medium tracking-tight mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}

export function ErrorState({ message, onRetry, className }: { message: string, onRetry?: () => void, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center p-8 text-destructive", className)}>
      <AlertCircle className="h-10 w-10 mb-4 opacity-80" />
      <p className="text-sm font-medium mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
}

export function LoadingState({ message = "Loading...", className }: { message?: string, className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-muted-foreground", className)}>
      <Loader2 className="h-8 w-8 animate-spin mb-4 opacity-50" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
