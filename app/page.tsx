"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useEngineStore } from "@/store/engine-store";

const HomeScreen = dynamic(
  () => import("@/components/screens/home-screen").then((mod) => mod.HomeScreen),
  { ssr: false }
);

const SetupScreen = dynamic(
  () => import("@/components/screens/setup-screen").then((mod) => mod.SetupScreen),
  { ssr: false }
);

export default function Home() {
  const [mounted, setMounted] = React.useState(false);
  const appState = useEngineStore(state => state.appState);
  const setupTimetableId = useEngineStore(state => state.setupTimetableId);
  const refreshView = useEngineStore(state => state.refreshView);

  React.useEffect(() => {
    const handle = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(handle);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  if (appState === "setup") {
    return (
      <SetupScreen
        timetableId={setupTimetableId || undefined}
        onCancel={() => {
          void refreshView();
        }}
      />
    );
  }

  return <HomeScreen />;
}
