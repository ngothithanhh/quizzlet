"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@acme/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "@acme/ui/sheet";

import { useAuth } from "~/contexts/auth-context";
import { useFolderDialogContext } from "~/contexts/folder-dialog-context";

const MobileMenu = () => {
  const [, dispatch] = useFolderDialogContext();
  const { isLoggedIn } = useAuth();

  const openFolderDialog = () => {
    dispatch({ type: "open" });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="md:hidden" size="icon">
          <Menu size={16} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="items-center">
          <span className="text-2xl font-black tracking-tighter text-blue-600 dark:text-blue-500">Quizzlet</span>
        </SheetHeader>
        <div className="flex flex-col py-4">
          <Link href={isLoggedIn ? "/latest" : "/"}>
            <Button variant="ghost" className="w-full justify-start">
              Trang chủ
            </Button>
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/my-sets">
                <Button variant="ghost" className="w-full justify-start">
                  Học phần của tôi
                </Button>
              </Link>
              <Link href="/classrooms">
                <Button variant="ghost" className="w-full justify-start">
                  Lớp học
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start">
                  Lịch sử
                </Button>
              </Link>
            </>
          )}
          <span className="p-4 text-sm font-medium">Tạo mới</span>
          <div className="flex flex-col">
            <Link href="/create-set">
              <Button variant="ghost" className="ml-4 w-full justify-start">
                Bộ thẻ học
              </Button>
            </Link>
            <Button
              onClick={openFolderDialog}
              variant="ghost"
              className="ml-4 w-full justify-start"
            >
              Thư mục
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
