"use client";

import * as React from "react";
import { useEngineStore } from "@/store/engine-store";

function applyStoredTheme(themePreference?: "light" | "dark" | "natural") {
  if (typeof document === "undefined") {
    return;
  }

  const storedTheme = window.localStorage.getItem("studyflow-theme") ?? themePreference ?? "natural";
  document.documentElement.classList.remove("light", "dark", "natural");

  if (storedTheme === "natural") {
    document.documentElement.classList.add("natural");
    return;
  }

  document.documentElement.classList.add(storedTheme);
}

export function AppRuntime() {
  const initialize = useEngineStore((state) => state.initialize);
  const refreshView = useEngineStore((state) => state.refreshView);
  const theme = useEngineStore((state) => state.settings.theme);

  React.useEffect(() => {
    void initialize();
  }, [initialize]);

  React.useEffect(() => {
    applyStoredTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      void refreshView();
    }, 30_000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void refreshView();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [refreshView]);

  React.useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") {
      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}
