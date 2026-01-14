import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { format } from "date-fns";
import { User, Phone, MapPin, CreditCard, Calendar, Box } from "lucide-react";

interface ContractOverviewProps {
  loan: LoanDetailDTO;
}

export function ContractOverview({ loan }: ContractOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Customer Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin khách hàng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Họ tên:</span>
            <span className="font-medium">
              {loan.customer?.fullName || "N/A"}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="h-4 w-4" /> SĐT:
            </span>
            <span>{loan.customer?.phone || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> CCCD:
            </span>
            <span>{loan.customer?.nationalId || "N/A"}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Địa chỉ:
            </span>
            <span className="text-sm">{loan.customer?.address || "N/A"}</span>
          </div>
        </CardContent>
      </Card>

      {/* Loan Terms */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Thông tin khoản vay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Số tiền vay:</span>
            <span className="font-bold text-primary text-lg">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(loan.loanAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Lãi suất:</span>
            <span className="font-medium">
              {loan.appliedInterestRate}% / tháng
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời hạn:</span>
            <span>{loan.durationMonths} tháng</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hình thức trả:</span>
            <Badge variant="outline">{loan.repaymentMethod}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ngày bắt đầu:</span>
            <span>
              {loan.startDate
                ? format(new Date(loan.startDate), "dd/MM/yyyy")
                : "N/A"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Collateral Info */}
      <Card className="md:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Box className="h-5 w-5" />
            Tài sản thế chấp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            {(loan.collateral || []).map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col md:flex-row justify-between p-4 gap-4 items-center"
              >
                <div className="flex-1">
                  <div className="font-medium">
                    {item.ownerName} (Tài sản {index + 1})
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {JSON.stringify(item.collateralInfo)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge
                    variant={item.status === "STORED" ? "secondary" : "outline"}
                  >
                    {item.status}
                  </Badge>
                  <div className="text-sm">
                    Định giá:{" "}
                    <span className="font-medium">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.appraisedValue)}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Kho: {item.storageLocation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
