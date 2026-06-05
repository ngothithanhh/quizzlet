"use client";

import { useRouter } from "next/navigation";

import { Button } from "@acme/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@acme/ui/dropdown-menu";

import { useAuth } from "~/contexts/auth-context";
import { useFolderDialogContext } from "~/contexts/folder-dialog-context";
import { useSignInDialogContext } from "~/contexts/sign-in-dialog-context";

const CreateOptionsDropdown = () => {
  const [, dispatch] = useFolderDialogContext();
  const { onOpenChange } = useSignInDialogContext();
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  const openFolderDialog = () => {
    dispatch({ type: "open" });
  };

  const openSignInDialog = () => {
    onOpenChange(true);
  };

  const onFolderClick = () => {
    if (isLoggedIn) {
      openFolderDialog();
    } else {
      openSignInDialog();
    }
  };

  const onStudySetClick = () => {
    if (isLoggedIn) {
      router.push("/new-set");
    } else {
      openSignInDialog();
    }
  };

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Tạo mới</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onFolderClick}>Thư mục</DropdownMenuItem>
          <DropdownMenuItem onClick={onStudySetClick}>
            Bộ thẻ học
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CreateOptionsDropdown;
