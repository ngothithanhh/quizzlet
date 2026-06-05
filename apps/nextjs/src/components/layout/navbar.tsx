"use client";

import Image from "next/image";
import Link from "next/link";

import { useAuth } from "~/contexts/auth-context";
import CreateOptionsDropdown from "./create-options-dropdown";
import MobileMenu from "./mobile-menu";
import SignInButton from "./sign-in-button";
import UserDropdown from "./user-dropdown";

const Navbar = () => {
  const { isLoggedIn, isLoading } = useAuth();

  return (
    <div className="flex min-h-16 items-center justify-between border-b px-4">
      <div className="flex items-center">
        <MobileMenu />
        <Link
          href="/"
          className="hidden h-full px-2 leading-[4rem] md:flex md:items-center"
        >
          <Image src="/logo.svg" alt="logo" width={110} height={24} />
        </Link>
        <Link
          href={isLoggedIn ? "/my-sets" : "/"}
          className="mx-2 hidden font-semibold text-muted-foreground hover:text-foreground md:inline"
        >
          {isLoggedIn && "Học phần của tôi"}
        </Link>
        {isLoggedIn && (
          <Link
            href="/history"
            className="mx-2 hidden font-semibold text-muted-foreground hover:text-foreground md:inline"
          >
            Lịch sử
          </Link>
        )}
        {isLoggedIn && (
          <Link
            href="/classrooms"
            className="mx-2 hidden font-semibold text-muted-foreground hover:text-foreground md:inline"
          >
            Lớp học
          </Link>
        )}
        <CreateOptionsDropdown />
      </div>
      <div className="flex items-center">
        {isLoading ? null : isLoggedIn ? <UserDropdown /> : <SignInButton />}
      </div>
    </div>
  );
};

export default Navbar;
