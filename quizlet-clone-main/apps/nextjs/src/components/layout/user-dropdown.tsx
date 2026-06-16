"use client";

import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useAuth } from "~/contexts/auth-context";

const UserDropdown = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = user.username
    ? user.username.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar>
          {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.username || user.email} />}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[180px] overflow-hidden text-ellipsis text-sm">
          <p className="font-medium">{user.username ?? user.email}</p>
          <p className="text-xs font-normal text-muted-foreground">
            {user.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>Trang cá nhân</DropdownMenuItem>
        </Link>
        <Link href="/my-sets">
          <DropdownMenuItem>Học phần của tôi</DropdownMenuItem>
        </Link>
        <Link href="/history">
          <DropdownMenuItem>Lịch sử</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => logout()}
          className="cursor-pointer text-red-500 focus:text-red-500"
        >
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;
