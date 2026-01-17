import { useState, ChangeEvent } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, MessageSquare, Phone } from "lucide-react";
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
  const [promiseToPayDate, setPromiseToPayDate] = useState("");

  const handleLogCommunication = async () => {
    try {
      if (commStatus === "PROMISE_TO_PAY" && !promiseToPayDate) {
        alert("Vui lòng chọn ngày hứa trả");
        return;
      }

      await CommunicationService.log({
        loanId: loan.id,
        type: commType,
        channel: commChannel,
        status: commStatus,
        notes: commContent,
        subject: `Ghi chú ${commChannel} - ${commType}`,
        promiseToPayDate:
          commStatus === "PROMISE_TO_PAY" ? promiseToPayDate : undefined,
      });
      setIsCommOpen(false);
      onRefresh();
      // Reset form
      setCommContent("");
      setPromiseToPayDate("");
      setCommStatus("ANSWERED");

      // Simple alert for now if toast not set up
      alert("Đã ghi nhận lịch sử trao đổi");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu ghi chú");
    }
  };

  const handleOpenCall = () => {
    setCommChannel("PHONE_CALL");
    setCommType("OVERDUE_REMINDER"); // Suggest overdue reminder for calls
    setIsCommOpen(true);
  };

  return (
    <Card className="border-primary/20 bg-primary/5 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Thao tác nhanh
        </CardTitle>
        <CardDescription>
          Các hành động thường dùng cho hợp đồng này
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        {/* Payment Button */}
        <Button
          className="flex-1 min-w-[150px] gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm transition-all hover:shadow-md"
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

        {/* Call Button */}
        <Button
          className="flex-1 min-w-[120px] gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow-md"
          onClick={handleOpenCall}
        >
          <Phone className="h-4 w-4" />
          Gọi điện
        </Button>

        {/* Communication Button */}
        <Dialog open={isCommOpen} onOpenChange={setIsCommOpen}>
          <DialogTrigger asChild>
            <Button
              variant="secondary"
              className="flex-1 min-w-[150px] gap-2 border shadow-sm bg-white hover:bg-gray-50"
            >
              <MessageSquare className="h-4 w-4 text-gray-600" />
              Ghi chú khác
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Ghi nhận trao đổi
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                      <SelectItem value="PHONE_CALL">📞 Gọi điện</SelectItem>
                      <SelectItem value="SMS">💬 Tin nhắn SMS</SelectItem>
                      <SelectItem value="EMAIL">📧 Email</SelectItem>
                      <SelectItem value="IN_PERSON">
                        👥 Gặp trực tiếp
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
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
              </div>

              <div className="space-y-2">
                <Label>Kết quả / Trạng thái</Label>
                <Select
                  value={commStatus}
                  onValueChange={(v) => setCommStatus(v as NotificationStatus)}
                >
                  <SelectTrigger
                    className={
                      commStatus === "PROMISE_TO_PAY"
                        ? "border-blue-500 bg-blue-50"
                        : ""
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ANSWERED">
                      ✅ Đã nghe máy / Đã xem
                    </SelectItem>
                    <SelectItem value="NO_ANSWER">🚫 Không nghe máy</SelectItem>
                    <SelectItem value="PROMISE_TO_PAY">
                      🗓️ Hẹn thanh toán (Promise to Pay)
                    </SelectItem>
                    <SelectItem value="FAILED">❌ Gửi thất bại</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {commStatus === "PROMISE_TO_PAY" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <Label className="text-blue-700 font-semibold">
                    Ngày hứa trả
                  </Label>
                  <Input
                    type="date"
                    value={promiseToPayDate}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setPromiseToPayDate(e.target.value)
                    }
                    className="bg-white"
                  />
                  <p className="text-xs text-blue-600">
                    Chọn ngày khách hàng hẹn sẽ thanh toán.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label>Ghi chú chi tiết</Label>
                <Textarea
                  value={commContent}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setCommContent(e.target.value)
                  }
                  placeholder="Ghi chú nội dung cuộc gọi, thái độ khách hàng..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCommOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleLogCommunication}>Lưu ghi chú</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
