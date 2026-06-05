import type { ReactNode } from "react";

/**
 * Layout for immersive study pages (flashcards, learn).
 * Bypasses the global Navbar and container padding.
 */
export default function StudyLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
