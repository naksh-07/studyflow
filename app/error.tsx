'use client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ErrorPage({
  reset,
}: {
  error: globalThis.Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <Card className="w-full max-w-md p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          StudyFlow hit an unexpected issue. Your saved timetable and progress are still kept locally.
        </p>
        <Button className="mt-6 w-full" onClick={() => reset()}>
          Try Again
        </Button>
      </Card>
    </div>
  );
}
