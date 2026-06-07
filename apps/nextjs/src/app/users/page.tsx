import type { Metadata } from "next";

import UserDirectoryView from "~/components/users/user-directory-view";

export const metadata: Metadata = {
  title: "Danh bạ người dùng - Quizzlet",
  description: "Quản lý và tìm kiếm người dùng trong hệ thống",
};

export default function UsersPage() {
  return <UserDirectoryView />;
}
