"use client";

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
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  MessageSquare,
  Phone,
  Check,
  X,
  Gavel,
  Banknote,
  Edit,
  Loader2,
} from "lucide-react";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { LoanService } from "@/lib/loan.service";
import { CollateralService } from "@/lib/collateral.service";
import { DisbursementService } from "@/lib/disbursement.service";
import { generateIdempotencyKey } from "@/lib/payment.service";
import { CommunicationService } from "@/lib/communication.service";
import { PaymentDialog } from "@/components/features/payment/payment-dialog";
import { EditPendingLoanDialog } from "@/components/features/loan/edit-pending-loan-dialog";
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from "@/types/dto/communication.dto";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getUserRole, isManagerOrAdmin } from "@/lib/role.helper";

interface StatusAwareActionPanelProps {
  loan: LoanDetailDTO;
  onRefresh: () => void;
}

export function StatusAwareActionPanel({
  loan,
  onRefresh,
}: StatusAwareActionPanelProps) {
  const router = useRouter();
  const { user } = useUser();
  const role = getUserRole(user);
  const canApproveReject = isManagerOrAdmin(role);

  const [isPayOpen, setIsPayOpen] = useState(false);
  const [isCommOpen, setIsCommOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Liquidation states
  const [isLiquidateOpen, setIsLiquidateOpen] = useState(false);
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [soldPrice, setSoldPrice] = useState(0);
  const [selectedCollateralId, setSelectedCollateralId] = useState<
    string | null
  >(null);

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
        toast.error("Vui lòng chọn ngày hứa trả");
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
      setCommContent("");
      setPromiseToPayDate("");
      setCommStatus("ANSWERED");
      toast.success("Đã ghi nhận lịch sử trao đổi");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lưu ghi chú");
    }
  };

  const handleOpenCall = () => {
    setCommChannel("PHONE_CALL");
    setCommType("OVERDUE_REMINDER");
    setIsCommOpen(true);
  };

  // PENDING loan actions
  const handleApproveLoan = async () => {
    if (!confirm(`Bạn có chắc chắn muốn duyệt khoản vay ${loan.loanCode}?`))
      return;

    setIsProcessing(true);
    try {
      await LoanService.approveLoan(loan.id, "Approved by Manager");

      // Auto-disburse if storeId exists
      if (loan.storeId) {
        await DisbursementService.create(
          {
            loanId: loan.id,
            storeId: loan.storeId,
            amount: loan.loanAmount,
            disbursementMethod: "CASH",
            recipientName: loan.customer?.fullName || "Khách hàng",
            notes: "Giải ngân tự động sau khi duyệt",
          },
          generateIdempotencyKey(),
        );
        toast.success("Đã duyệt và giải ngân thành công!");
      } else {
        toast.success("Đã duyệt khoản vay thành công!");
      }
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi duyệt khoản vay");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectLoan = async () => {
    const reason = prompt("Nhập lý do từ chối:");
    if (reason === null) return;

    setIsProcessing(true);
    try {
      await LoanService.rejectLoan(loan.id, reason || "Rejected by Manager");
      toast.success("Đã từ chối khoản vay");
      router.push("/contracts");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi từ chối khoản vay");
    } finally {
      setIsProcessing(false);
    }
  };

  // OVERDUE loan actions - Liquidation
  const handleInitiateLiquidation = async () => {
    if (!selectedCollateralId) {
      toast.error("Vui lòng chọn tài sản để thanh lý");
      return;
    }
    if (minPrice <= 0) {
      toast.error("Vui lòng nhập giá thanh lý tối thiểu");
      return;
    }

    setIsProcessing(true);
    try {
      await CollateralService.liquidate({
        collateralId: selectedCollateralId,
        minimumSalePrice: minPrice,
      });
      toast.success("Đã chuyển tài sản sang trạng thái thanh lý");
      setIsLiquidateOpen(false);
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi khởi tạo thanh lý");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmSale = async () => {
    if (!selectedCollateralId) {
      toast.error("Vui lòng chọn tài sản");
      return;
    }
    if (soldPrice <= 0) {
      toast.error("Vui lòng nhập giá bán thực tế");
      return;
    }

    setIsProcessing(true);
    try {
      await CollateralService.sell(selectedCollateralId, {
        sellPrice: soldPrice,
      });
      toast.success("Đã xác nhận bán tài sản");
      setIsSellOpen(false);
      onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xác nhận bán");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);

  // Helper to extract asset name from collateralInfo
  const getAssetName = (col: LoanDetailDTO["collateral"][0]) => {
    const info = col.collateralInfo as Record<string, unknown> | undefined;
    if (info) {
      if (typeof info.name === "string" && info.name) return info.name;
      if (typeof info.description === "string" && info.description)
        return info.description;
    }
    // Fallback to ownerName if no name/description
    return col.ownerName || "Tài sản";
  };

  // Render based on loan status
  const renderPendingActions = () => (
    <Card className="border-yellow-300 bg-yellow-50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge className="bg-yellow-500 text-white">Chờ duyệt</Badge>
          {canApproveReject ? "Thao tác duyệt hồ sơ" : "Thao tác nhanh"}
        </CardTitle>
        <CardDescription>
          {canApproveReject
            ? "Xem xét và phê duyệt hoặc từ chối khoản vay này"
            : "Chỉ Quản lý mới có thể duyệt hoặc từ chối khoản vay"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button
          className="flex-1 min-w-[150px] gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsEditOpen(true)}
        >
          <Edit className="h-4 w-4" />
          Sửa hồ sơ
        </Button>
        {canApproveReject && (
          <>
            <Button
              className="flex-1 min-w-[150px] gap-2 bg-green-600 hover:bg-green-700 text-white"
              onClick={handleApproveLoan}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Duyệt khoản vay
            </Button>
            <Button
              variant="destructive"
              className="flex-1 min-w-[150px] gap-2"
              onClick={handleRejectLoan}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
              Từ chối
            </Button>
          </>
        )}

        <EditPendingLoanDialog
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          loanId={loan.id}
          loanCode={loan.loanCode || ""}
          onSuccess={onRefresh}
        />
      </CardContent>
    </Card>
  );

  const renderActiveActions = () => (
    <Card className="border-green-300 bg-green-50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge className="bg-green-600 text-white">Đang hoạt động</Badge>
          Thao tác nhanh
        </CardTitle>
        <CardDescription>
          Thu lãi và các thao tác cho hợp đồng này
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-4">
        <Button
          className="flex-1 min-w-[150px] gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-sm transition-all hover:shadow-md"
          onClick={() => setIsPayOpen(true)}
        >
          <CreditCard className="h-4 w-4" />
          Thu lãi / Thanh toán
        </Button>

        <PaymentDialog
          open={isPayOpen}
          onOpenChange={setIsPayOpen}
          loanId={loan.id}
          loanCode={loan.loanCode || ""}
          onSuccess={onRefresh}
        />

        <Button
          className="flex-1 min-w-[120px] gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:shadow-md"
          onClick={handleOpenCall}
        >
          <Phone className="h-4 w-4" />
          Gọi điện
        </Button>

        {renderCommunicationDialog()}
      </CardContent>
    </Card>
  );

  const renderOverdueActions = () => (
    <Card className="border-red-300 bg-red-50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="destructive">Quá hạn</Badge>
          Thao tác xử lý nợ
        </CardTitle>
        <CardDescription>
          Thu nợ, liên hệ khách hàng hoặc xử lý tài sản thế chấp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <Button
            className="flex-1 min-w-[150px] gap-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            onClick={() => setIsPayOpen(true)}
          >
            <Banknote className="h-4 w-4" />
            Thu nợ
          </Button>

          <PaymentDialog
            open={isPayOpen}
            onOpenChange={setIsPayOpen}
            loanId={loan.id}
            loanCode={loan.loanCode || ""}
            onSuccess={onRefresh}
          />

          <Button
            className="flex-1 min-w-[120px] gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleOpenCall}
          >
            <Phone className="h-4 w-4" />
            Gọi điện nhắc nợ
          </Button>

          {renderCommunicationDialog()}
        </div>

        {/* Collateral actions for OVERDUE */}
        {loan.collateral && loan.collateral.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-3 text-red-800 flex items-center gap-2">
              <Gavel className="w-4 h-4" />
              Xử lý tài sản thế chấp
            </h4>
            <div className="space-y-3">
              {loan.collateral.map((col) => (
                <div
                  key={col.id}
                  className="flex items-center justify-between bg-white p-3 rounded-md border"
                >
                  <div>
                    <p className="font-medium">{getAssetName(col)}</p>
                    <p className="text-xs text-muted-foreground">
                      Chủ sở hữu: {col.ownerName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Định giá: {formatCurrency(col.appraisedValue)}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {col.status}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    {(col.status === "STORED" || col.status === "PLEDGED") && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedCollateralId(col.id);
                          setMinPrice(col.appraisedValue);
                          setIsLiquidateOpen(true);
                        }}
                      >
                        <Gavel className="w-4 h-4 mr-1" /> Thanh lý
                      </Button>
                    )}
                    {col.status === "LIQUIDATING" && (
                      <Button
                        size="sm"
                        className="bg-teal-600 hover:bg-teal-700"
                        onClick={() => {
                          setSelectedCollateralId(col.id);
                          setSoldPrice(
                            (col as unknown as { sellPrice?: number })
                              .sellPrice || col.appraisedValue,
                          );
                          setIsSellOpen(true);
                        }}
                      >
                        <Check className="w-4 h-4 mr-1" /> Xác nhận bán
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liquidation Dialog */}
        <Dialog open={isLiquidateOpen} onOpenChange={setIsLiquidateOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thanh lý tài sản</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p>
                Chuyển tài sản sang trạng thái <strong>Đang thanh lý</strong>?
              </p>
              <div className="space-y-2">
                <Label>Giá thanh lý tối thiểu (VNĐ)</Label>
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLiquidateOpen(false)}
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleInitiateLiquidation}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận thanh lý"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sell Confirmation Dialog */}
        <Dialog open={isSellOpen} onOpenChange={setIsSellOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận bán tài sản</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Giá bán thực tế (VNĐ)</Label>
                <Input
                  type="number"
                  value={soldPrice}
                  onChange={(e) => setSoldPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsSellOpen(false)}>
                Hủy
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleConfirmSale}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận bán"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );

  const renderClosedInfo = () => (
    <Card className="border-gray-300 bg-gray-100 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="secondary">Đã đóng</Badge>
          Thông tin tất toán
        </CardTitle>
        <CardDescription>Hợp đồng đã hoàn tất - Chế độ xem</CardDescription>
      </CardHeader>
      <CardContent>
        {loan.collateral && loan.collateral.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 text-gray-700">
              Thông tin tài sản thế chấp
            </h4>
            <div className="space-y-3">
              {loan.collateral.map((col) => (
                <div
                  key={col.id}
                  className="bg-white p-3 rounded-md border space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{getAssetName(col)}</p>
                      <p className="text-xs text-muted-foreground">
                        Chủ sở hữu: {col.ownerName}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {col.status}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Định giá</p>
                      <p className="font-bold text-primary">
                        {formatCurrency(col.appraisedValue)}
                      </p>
                    </div>
                  </div>
                  {/* Show sell price if SOLD */}
                  {col.status === "SOLD" &&
                    (col as unknown as { sellPrice?: number }).sellPrice && (
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Giá bán thực tế:
                          </span>
                          <span className="font-bold text-teal-600">
                            {formatCurrency(
                              (col as unknown as { sellPrice: number })
                                .sellPrice,
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm text-muted-foreground mt-4 text-center">
          📋 Không thể thực hiện thao tác trên hợp đồng này.
        </p>
      </CardContent>
    </Card>
  );

  const renderRejectedInfo = () => (
    <Card className="border-rose-300 bg-rose-50 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="destructive">Đã từ chối</Badge>
          Hồ sơ bị từ chối
        </CardTitle>
        <CardDescription>
          Khoản vay này đã bị từ chối - Chế độ xem
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          🚫 Không thể thực hiện thao tác trên hồ sơ này.
        </p>
      </CardContent>
    </Card>
  );

  const handleOpenOtherNote = () => {
    setCommChannel("IN_PERSON");
    setCommType("INTEREST_REMINDER");
    setIsCommOpen(true);
  };

  const renderCommunicationDialog = () => (
    <>
      <Button
        variant="secondary"
        className="flex-1 min-w-[150px] gap-2 border shadow-sm bg-white hover:bg-gray-50"
        onClick={handleOpenOtherNote}
      >
        <MessageSquare className="h-4 w-4 text-gray-600" />
        Ghi chú khác
      </Button>

      <Dialog open={isCommOpen} onOpenChange={setIsCommOpen}>
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
                    <SelectItem value="IN_PERSON">👥 Gặp trực tiếp</SelectItem>
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
    </>
  );

  // Main render based on status
  switch (loan.status) {
    case "PENDING":
      return renderPendingActions();
    case "ACTIVE":
      return renderActiveActions();
    case "OVERDUE":
      return renderOverdueActions();
    case "CLOSED":
      return renderClosedInfo();
    case "REJECTED":
      return renderRejectedInfo();
    default:
      return null;
  }
}
