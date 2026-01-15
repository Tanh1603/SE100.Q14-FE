import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommunicationService } from "@/lib/communication.service";
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from "@/types/dto/communication.dto";
import { toast } from "sonner";
import { Loader2, CalendarClock } from "lucide-react";

interface DebtReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  loanId: string;
  loanCode: string;
  customerName?: string;
  onSuccess?: () => void;
}

export function DebtReminderDialog({
  open,
  onOpenChange,
  loanId,
  loanCode,
  customerName,
  onSuccess,
}: DebtReminderDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Communication Form State - defaults for debt reminder
  const [commType, setCommType] =
    useState<NotificationType>("OVERDUE_REMINDER");
  const [commChannel, setCommChannel] =
    useState<NotificationChannel>("PHONE_CALL");
  const [commStatus, setCommStatus] = useState<NotificationStatus>("ANSWERED");
  const [commContent, setCommContent] = useState("");
  const [promiseToPayDate, setPromiseToPayDate] = useState("");

  const handleLogCommunication = async () => {
    // Validation for Promise to Pay
    if (commStatus === "PROMISE_TO_PAY" && !promiseToPayDate) {
      toast.error("Vui lòng chọn ngày hẹn trả");
      return;
    }

    setIsSubmitting(true);
    try {
      await CommunicationService.log({
        loanId: loanId,
        type: commType,
        channel: commChannel,
        status: commStatus,
        notes: commContent,
        subject: `Nhắc nợ ${commChannel} - HĐ ${loanCode}`,
        promiseToPayDate:
          commStatus === "PROMISE_TO_PAY" ? promiseToPayDate : undefined,
      });

      toast.success(
        commStatus === "PROMISE_TO_PAY"
          ? `Đã ghi nhận hẹn trả ngày ${new Date(
              promiseToPayDate
            ).toLocaleDateString("vi-VN")}`
          : "Đã ghi nhận nhắc nợ thành công!"
      );

      onOpenChange(false);
      onSuccess?.();

      // Reset form
      setCommContent("");
      setPromiseToPayDate("");
      setCommStatus("ANSWERED");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu ghi chú nhắc nợ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nhắc nợ - HĐ {loanCode}</DialogTitle>
          {customerName && (
            <DialogDescription>
              Khách hàng:{" "}
              <span className="font-semibold text-foreground">
                {customerName}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Kênh liên hệ</Label>
            <Select
              value={commChannel}
              onValueChange={(v) => setCommChannel(v as NotificationChannel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PHONE_CALL">Gọi điện</SelectItem>
                <SelectItem value="SMS">Tin nhắn SMS</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="IN_PERSON">Gặp trực tiếp</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Loại thông báo</Label>
            <Select
              value={commType}
              onValueChange={(v) => setCommType(v as NotificationType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OVERDUE_REMINDER">Nhắc quá hạn</SelectItem>
                <SelectItem value="INTEREST_REMINDER">Nhắc đóng lãi</SelectItem>
                <SelectItem value="LIQUIDATION_WARNING">
                  Cảnh báo thanh lý
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Kết quả</Label>
            <Select
              value={commStatus}
              onValueChange={(v) => setCommStatus(v as NotificationStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANSWERED">Đã nghe máy / Đã xem</SelectItem>
                <SelectItem value="NO_ANSWER">Không nghe máy</SelectItem>
                <SelectItem value="PROMISE_TO_PAY">Hẹn thanh toán</SelectItem>
                <SelectItem value="FAILED">Gửi thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Promise to Pay Date Field - only shown when status is PROMISE_TO_PAY */}
          {commStatus === "PROMISE_TO_PAY" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 bg-blue-50 p-3 rounded-lg border border-blue-200">
              <Label className="flex items-center gap-2 text-blue-700">
                <CalendarClock className="w-4 h-4" />
                Ngày hẹn trả
              </Label>
              <Input
                type="date"
                value={promiseToPayDate}
                onChange={(e) => setPromiseToPayDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="bg-white"
              />
              <p className="text-xs text-blue-600">
                Khách hàng hứa sẽ thanh toán vào ngày này
              </p>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Ghi chú chi tiết</Label>
            <Textarea
              value={commContent}
              onChange={(e) => setCommContent(e.target.value)}
              placeholder="Ghi chú nội dung cuộc gọi nhắc nợ..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={isSubmitting} onClick={handleLogCommunication}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Lưu ghi nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
