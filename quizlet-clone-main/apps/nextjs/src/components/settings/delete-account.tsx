"use client";

import { CircleAlert, X } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@acme/ui/alert";
import { Card, CardContent, CardFooter, CardHeader } from "@acme/ui/card";

import { useAuth } from "~/contexts/auth-context";
import DeleteAccountDialog from "./delete-account-dialog";

const DeleteAccount = () => {
  const { user } = useAuth();
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
      <div className="flex items-center gap-2 lg:basis-48 lg:flex-col lg:justify-center">
        <X size={64} />
        <span className="text-xl font-semibold">Xoá Tài khoản</span>
      </div>
      <Card className="flex-1">
        <CardHeader>
          <span className="text-xl font-semibold">
          Xoá vĩnh viễn {user?.username ?? user?.email}
          </span>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <CircleAlert size={16} />
            <AlertTitle>Be careful!</AlertTitle>
            <AlertDescription>
              Hành động này sẽ xóa toàn bộ dữ liệu của bạn và không thể khôi phục.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <DeleteAccountDialog />
        </CardFooter>
      </Card>
    </div>
  );
};

export default DeleteAccount;
