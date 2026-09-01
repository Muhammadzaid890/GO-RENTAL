"use client";

import { PreferencesProvider } from "@/context/PreferencesContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}