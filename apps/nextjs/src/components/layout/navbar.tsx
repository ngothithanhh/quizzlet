"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "~/contexts/auth-context";
import CreateOptionsDropdown from "./create-options-dropdown";
import MobileMenu from "./mobile-menu";
import SignInButton from "./sign-in-button";
import UserDropdown from "./user-dropdown";
import NotificationDropdown from "./notification-dropdown";
import GlobalSearch from "./global-search";

const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4 md:gap-8">
          <MobileMenu />
          <Link
            href="/"
            className="hidden md:flex items-center space-x-2 transition-opacity hover:opacity-80"
          >
            <span className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500">Quizzlet</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {isLoggedIn && (
              <Link
                href="/my-sets"
                className="transition-colors hover:text-primary text-foreground/70"
              >
                Học phần của tôi
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/classrooms"
                className="transition-colors hover:text-primary text-foreground/70"
              >
                Lớp học
              </Link>
            )}
            {isLoggedIn && (
              <Link
                href="/history"
                className="transition-colors hover:text-primary text-foreground/70"
              >
                Lịch sử
              </Link>
            )}
            <CreateOptionsDropdown />
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4 ml-4">
          <div className="w-full flex-1 md:w-auto md:flex-none max-w-sm">
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-2 border-l border-border/50 pl-2 md:pl-4">
            {isLoggedIn && <NotificationDropdown />}
            {isLoading ? null : isLoggedIn ? <UserDropdown /> : <SignInButton />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
