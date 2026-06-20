"use client";

import type { ReactNode } from "react";
import { useAuth } from "~/contexts/auth-context";
import ProfileLayoutClient from "~/components/user/profile-layout-client";

export default function Layout({
  children,
  params: { id },
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const { user } = useAuth();

  const displayUser = {
    id,
    name: user?.username ?? user?.email ?? `User ${id}`,
    image: user?.avatarUrl ?? null,
  };

  return (
    <ProfileLayoutClient user={displayUser}>
      {children}
    </ProfileLayoutClient>
  );
}
