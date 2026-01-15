import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, MessageSquare } from "lucide-react";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { CommunicationService } from "@/lib/communication.service";
import { PaymentDialog } from "@/components/features/payment/payment-dialog";
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from "@/types/dto/communication.dto";

interface ActionPanelProps {
  loan: LoanDetailDTO;
  onRefresh: () => void;
}

export function ActionPanel({ loan, onRefresh }: ActionPanelProps) {
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isCommOpen, setIsCommOpen] = useState(false);

  // Communication Form State
  const [commType, setCommType] =
    useState<NotificationType>("INTEREST_REMINDER");
  const [commChannel, setCommChannel] =
    useState<NotificationChannel>("PHONE_CALL");
  const [commStatus, setCommStatus] = useState<NotificationStatus>("ANSWERED");
  const [commContent, setCommContent] = useState("");

  const handleLogCommunication = async () => {
    try {
      await CommunicationService.log({
        loanId: loan.id,
        type: commType,
        channel: commChannel,
        status: commStatus,
        notes: commContent,
        subject: `Ghi chú ${commChannel} - ${commType}`,
      });
      setIsCommOpen(false);
      onRefresh();
      // Simple alert for now if toast not set up
      alert("Đã ghi nhận lịch sử trao đổi");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu ghi chú");
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg">Thao tác nhanh</CardTitle>
        <CardDescription>
          Các hành động thường dùng cho hợp đồng này
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {/* Payment Button */}
        <Button
          className="flex-1 min-w-[150px] gap-2"
          onClick={() => setIsPayOpen(true)}
        >
          <CreditCard className="h-4 w-4" />
          Thanh toán / Đóng lãi
        </Button>

        <PaymentDialog
          open={isPayOpen}
          onOpenChange={setIsPayOpen}
          loanId={loan.id}
          loanCode={loan.loanCode || ""}
          onSuccess={onRefresh}
        />

        {/* Communication Button */}
        <Dialog open={isCommOpen} onOpenChange={setIsCommOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" className="flex-1 min-w-[150px] gap-2">
              <MessageSquare className="h-4 w-4" />
              Ghi chú trao đổi
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ghi nhận trao đổi</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Kênh liên hệ</Label>
                <Select
                  value={commChannel}
                  onValueChange={(v) =>
                    setCommChannel(v as NotificationChannel)
                  }
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
                    <SelectItem value="INTEREST_REMINDER">
                      Nhắc đóng lãi
                    </SelectItem>
                    <SelectItem value="OVERDUE_REMINDER">
                      Nhắc quá hạn
                    </SelectItem>
                    <SelectItem value="LIQUIDATION_WARNING">
                      Cảnh báo thanh lý
                    </SelectItem>
                    <SelectItem value="PAYMENT_CONFIRMATION">
                      Xác nhận thanh toán
                    </SelectItem>
                    <SelectItem value="LOAN_APPROVED">
                      Thông báo duyệt vay
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
                    <SelectItem value="ANSWERED">
                      Đã nghe máy / Đã xem
                    </SelectItem>
                    <SelectItem value="NO_ANSWER">Không nghe máy</SelectItem>
                    <SelectItem value="PROMISE_TO_PAY">
                      Hẹn thanh toán
                    </SelectItem>
                    <SelectItem value="FAILED">Gửi thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Ghi chú chi tiết</Label>
                <Textarea
                  value={commContent}
                  onChange={(e) => setCommContent(e.target.value)}
                  placeholder="Ghi chú nội dung cuộc gọi..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleLogCommunication}>Lưu ghi chú</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
