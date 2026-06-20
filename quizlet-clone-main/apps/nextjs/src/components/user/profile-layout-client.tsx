"use client";

import type { ReactNode } from "react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@acme/ui/tabs";

import { useAuth } from "~/contexts/auth-context";

interface ProfileLayoutClientProps {
  user: { id: string; name: string; image: string | null };
  children: ReactNode;
}

const ProfileLayoutClient = ({ user, children }: ProfileLayoutClientProps) => {
  const pathname = usePathname();
  const { user: authUser } = useAuth();

  const { id, name, image } = user;

  const tabsValue =
    pathname === `/users/${id}`
      ? "overview"
      : pathname === `/users/${id}/study-sets`
        ? "study-sets"
        : pathname === `/users/${id}/folders`
          ? "folders"
          : undefined;

  return (
    <>
      <div className="mb-8 flex items-start gap-5">
        <Avatar className="h-16 w-16">
          <AvatarImage src={image ?? undefined} alt="user avatar" />
          <AvatarFallback>{name?.charAt(0)?.toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <span className="block text-2xl font-bold">{name}</span>
        </div>
      </div>
      <Tabs value={tabsValue} className="mb-8">
        <TabsList className="w-full justify-start">
          <Link href={`/users/${id}/study-sets`}>
            <TabsTrigger value="study-sets">Học phần</TabsTrigger>
          </Link>
          <Link href={`/users/${id}/folders`}>
            <TabsTrigger value="folders">Thư mục</TabsTrigger>
          </Link>
        </TabsList>
      </Tabs>
      {children}
    </>
  );
};

export default ProfileLayoutClient;
