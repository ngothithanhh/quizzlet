import type { Metadata } from "next";

import ProfileView from "~/components/profile/profile-view";

export const metadata: Metadata = {
  title: "Trang cá nhân - Quizzlet",
  description: "Quản lý hồ sơ và cài đặt tài khoản của bạn",
};

export default function ProfilePage() {
  return <ProfileView />;
}
