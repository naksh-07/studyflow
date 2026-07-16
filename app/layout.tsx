import type { Metadata, Viewport } from "next";
import { AppRuntime } from "@/components/shared/app-runtime";
import "./globals.css";

export const metadata: Metadata = {
  title: "StudyFlow",
  description: "A calm, local-first study planner powered by a scheduling engine that keeps the UI focused on what to study right now.",
  applicationName: "StudyFlow",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "StudyFlow",
  },
  openGraph: {
    title: "StudyFlow",
    description: "Offline-capable study scheduling with a calm, focused interface.",
    siteName: "StudyFlow",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f5f0",
  width: "device-width",
  initialScale: 1,
};

const themeInitScript = `
  (function () {
    try {
      var storedTheme = window.localStorage.getItem('studyflow-theme') || 'natural';
      document.documentElement.classList.remove('light', 'dark', 'natural');
      document.documentElement.classList.add(storedTheme);
    } catch (error) {
      document.documentElement.classList.add('natural');
    }
  })();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <AppRuntime />
        {children}
      </body>
    </html>
  )
}
