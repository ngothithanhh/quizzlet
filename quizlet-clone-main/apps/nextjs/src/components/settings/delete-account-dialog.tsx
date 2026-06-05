import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";

const DeleteAccountDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Xóa Tài khoản</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bạn chắc chắn muốn xóa?</DialogTitle>
          <DialogDescription>
            Tài khoản của bạn và toàn bộ dữ liệu sẽ bị xóa vĩnh viễn và không thể khôi phục.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit">Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;
