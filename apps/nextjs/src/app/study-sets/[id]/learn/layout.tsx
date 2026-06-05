import type { ReactNode } from "react";

/**
 * Layout for the learn (spaced repetition) study mode.
 * Bypasses the global Navbar and container padding.
 */
export default function LearnLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
