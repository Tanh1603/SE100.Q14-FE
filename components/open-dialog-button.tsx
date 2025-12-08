import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

type OpenDialogButtonProps = {
  description?: string;
  title?: string;
  children?: React.ReactNode;
};

export function OpenDialogButton({
  description,
  title,
  children,
}: OpenDialogButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle />
          Thêm mới
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-none w-fit"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-primary font-bold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="destructive">Đóng</Button>
          </DialogClose>
          <Button type="submit">Xác nhận</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
