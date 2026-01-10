"use client";

import { useState } from "react";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { SidebarInset } from "@/components/ui/sidebar";
import {
  mockLiquidationCandidates,
  mockLiquidatedHistory,
} from "@/mock-data/liquidation";
import { columns } from "./columns";
import { historyColumns } from "./history-columns";
import {
  AlertTriangle,
  Banknote,
  ChevronDown,
  FileText,
  Hammer,
  Phone,
  History,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock contract history for the selected item
const getContractHistory = () => [
  {
    id: "1",
    date: "2024-01-01",
    type: "contract",
    description: "Tạo hợp đồng",
    details: "Vay 5.000.000đ, lãi suất 1.5%/tháng",
    status: "success",
  },
  {
    id: "2",
    date: "2024-02-01",
    type: "payment",
    description: "Thu lãi kỳ 1",
    details: "Thanh toán 75.000đ",
    status: "success",
  },
  {
    id: "3",
    date: "2024-03-01",
    type: "reminder",
    description: "Nhắc nợ lần 1",
    details: "Gọi điện nhắc khách hàng",
    status: "warning",
  },
  {
    id: "4",
    date: "2024-03-05",
    type: "reminder",
    description: "Nhắc nợ lần 2",
    details: "Gửi SMS nhắc nhở",
    status: "warning",
  },
  {
    id: "5",
    date: "2024-03-10",
    type: "reminder",
    description: "Nhắc nợ lần 3",
    details: "Gọi điện lần cuối",
    status: "warning",
  },
  {
    id: "6",
    date: "2024-03-15",
    type: "overdue",
    description: "Quá hạn",
    details: "Đã qua 7 ngày kể từ ngày đáo hạn",
    status: "error",
  },
];

const getEventIcon = (type: string) => {
  switch (type) {
    case "contract":
      return <FileText className="w-4 h-4" />;
    case "payment":
      return <Banknote className="w-4 h-4" />;
    case "reminder":
      return <Phone className="w-4 h-4" />;
    case "overdue":
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
};

const getEventColor = (status: string) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-600 border-green-200";
    case "warning":
      return "bg-yellow-100 text-yellow-600 border-yellow-200";
    case "error":
      return "bg-red-100 text-red-600 border-red-200";
    default:
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const LiquidationPage = () => {
  const [openLiquidationDialog, setOpenLiquidationDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const contractHistory = getContractHistory();

  return (
    <SidebarInset>
      <div className="mx-5 pb-10">
        <div className="flex my-5 items-center justify-between">
          <div className="flex items-center">
            <Hammer className="text-red-600 mr-5 w-8 h-8" />
            <div>
              <p className="text-2xl text-primary font-bold">
                Thanh lý tài sản
              </p>
              <p className="text-sm text-gray-500">
                Quản lý tài sản quá hạn và lịch sử thanh lý
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Chờ thanh lý{" "}
              <span className="ml-2 bg-red-100 text-red-700 px-1.5 rounded-full text-xs">
                {mockLiquidationCandidates.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="history">Lịch sử thanh lý</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <Alert
              variant="destructive"
              className="bg-red-50 border-red-200 text-red-800"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Lưu ý quan trọng</AlertTitle>
              <AlertDescription>
                Theo Nghị định 96/2016/NĐ-CP, tài sản chỉ được thanh lý sau 07
                ngày kể từ ngày quá hạn và đã có thông báo cho khách hàng.
              </AlertDescription>
            </Alert>

            <div className="bg-white rounded-xl border shadow-sm p-5">
              <DataTable
                columns={columns}
                data={mockLiquidationCandidates}
                onRowClick={(row) => {
                  if (row.overdueDays >= 7) {
                    setSelectedItem(row);
                    setOpenLiquidationDialog(true);
                  } else {
                    alert(
                      "Tài sản chưa đủ điều kiện thanh lý (dưới 7 ngày quá hạn)"
                    );
                  }
                }}
              />
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="bg-white rounded-xl border shadow-sm p-5">
              <DataTable
                columns={historyColumns}
                data={mockLiquidatedHistory}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={openLiquidationDialog}
        onOpenChange={setOpenLiquidationDialog}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thanh lý tài sản</DialogTitle>
            <DialogDescription>
              Xác nhận thanh lý tài sản cho hợp đồng{" "}
              <span className="font-bold text-black">
                {selectedItem?.contractNumber}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Contract Timeline Widget */}
            <Collapsible open={historyOpen} onOpenChange={setHistoryOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-purple-50 rounded-lg border border-purple-200 text-left hover:bg-purple-100 transition-colors [&[data-state=open]>svg]:rotate-180">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-600" />
                  <span className="font-semibold text-purple-800">
                    Lịch sử hợp đồng
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-purple-600 transition-transform duration-200" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-3">
                <div className="border rounded-lg p-3 space-y-3 max-h-48 overflow-y-auto">
                  {contractHistory.map((event, idx) => (
                    <div key={event.id} className="flex items-start gap-3">
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border ${getEventColor(
                            event.status
                          )}`}
                        >
                          {getEventIcon(event.type)}
                        </div>
                        {idx < contractHistory.length - 1 && (
                          <div className="absolute left-1/2 top-8 w-0.5 h-6 bg-gray-200 -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pb-2">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">
                            {event.description}
                          </p>
                          <span className="text-xs text-gray-400">
                            {event.date}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">{event.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Asset Info */}
            <div className="bg-gray-50 p-3 rounded-md space-y-2">
              <h4 className="font-medium text-sm">Thông tin tài sản</h4>
              <p className="text-sm">Tên: {selectedItem?.assetName}</p>
              <p className="text-sm">
                Vay gốc:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(selectedItem?.loanAmount || 0)}
              </p>
              <p className="text-sm text-red-600 font-medium">
                Quá hạn: {selectedItem?.overdueDays} ngày
              </p>
            </div>

            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium text-sm">
                Kiểm tra quy trình (Bắt buộc)
              </h4>
              <div className="items-top flex space-x-2">
                <Checkbox id="notice" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="notice" className="text-sm font-normal">
                    Đã thông báo cho khách hàng ít nhất 3 lần
                  </Label>
                </div>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox id="wait" />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="wait" className="text-sm font-normal">
                    Đã qua 07 ngày niêm yết công khai
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label>Giá thanh lý thực tế</Label>
              <Input type="number" placeholder="Nhập số tiền bán được" />
            </div>

            <div className="space-y-2">
              <Label>Thông tin người mua</Label>
              <Input placeholder="Họ tên - SĐT người mua" />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenLiquidationDialog(false)}
            >
              Hủy bỏ
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Xác nhận thanh lý
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  );
};

export default LiquidationPage;
