"use client";

import { useEffect, useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  MessageSquare,
  Phone,
} from "lucide-react";

import { getPayments } from "@/lib/payment.service";
import { DisbursementService } from "@/lib/disbursement.service";
import { CommunicationService } from "@/lib/communication.service";
import { Payment } from "@/types/payment";
import { NotificationLogResponse } from "@/types/dto/communication.dto";

interface TransactionHistoryProps {
  loanId: string;
}

type TransactionItem = {
  id: string;
  type: "PAYMENT" | "DISBURSEMENT" | "COMMUNICATION";
  date: string;
  amount?: number;
  description: string;
  status: string;
  flow?: "IN" | "OUT" | "NONE";
  details?: any;
};

export function TransactionHistory({ loanId }: TransactionHistoryProps) {
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Parallel Fetching
        const [paymentsRes, disbursementsRes, commsRes] = await Promise.all([
          getPayments({ loanId, limit: 100 }),
          DisbursementService.getAll(1, 100, "", loanId),
          CommunicationService.getLogsByLoanId(loanId),
        ]);

        // Normalize Payments
        const paymentItems: TransactionItem[] = (paymentsRes.data || []).map(
          (p: Payment) => ({
            id: p.id,
            type: "PAYMENT",
            date: p.paidAt,
            amount: p.amount,
            description: p.notes || `Thanh toán ${p.paymentType}`,
            status: "SUCCESS", // Mock status
            flow: "IN",
            details: p,
          })
        );

        // Normalize Disbursements
        // Adjust structure based on API response inspection if needed
        const disbursementItems: TransactionItem[] = (
          disbursementsRes.data || []
        ).map((d: any) => ({
          id: d.id, // Using any here as a temporary fix for lint types, ideally specific DTO
          type: "DISBURSEMENT",
          date: d.disbursedAt,
          amount: d.amount,
          description: d.notes || "Giải ngân khoản vay",
          status: "SUCCESS",
          flow: "OUT",
          details: d,
        }));

        // Normalize Communications
        const commItems: TransactionItem[] = (commsRes || []).map(
          (c: NotificationLogResponse) => ({
            id: c.id,
            type: "COMMUNICATION",
            date: c.sentAt || c.createdAt,
            amount: 0,
            description: `${c.type}: ${c.subject || c.message || c.notes}`,
            status: c.status,
            flow: "NONE",
            details: c,
          })
        );

        // Merge and Sort
        const allItems = [
          ...paymentItems,
          ...disbursementItems,
          ...commItems,
        ].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setItems(allItems);
      } catch (error) {
        console.error("Failed to fetch transaction history", error);
      } finally {
        setLoading(false);
      }
    };

    if (loanId) {
      fetchData();
    }
  }, [loanId]);

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const getIcon = (type: string, flow?: string) => {
    if (type === "COMMUNICATION") return <MessageSquare className="h-4 w-4" />;
    if (flow === "IN")
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    return <ArrowUpRight className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lịch sử hoạt động</CardTitle>
            <CardDescription>
              Ghi nhận tất cả giao dịch và trao đổi liên quan đến khoản vay này
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="money">Dòng tiền</TabsTrigger>
            <TabsTrigger value="comms">Trao đổi</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <TransactionTable items={filteredItems} getIcon={getIcon} />
          </TabsContent>

          <TabsContent value="money" className="space-y-4">
            <TransactionTable
              items={filteredItems.filter((i) => i.type !== "COMMUNICATION")}
              getIcon={getIcon}
            />
          </TabsContent>

          <TabsContent value="comms" className="space-y-4">
            <TransactionTable
              items={filteredItems.filter((i) => i.type === "COMMUNICATION")}
              getIcon={getIcon}
            />
            <div className="flex justify-center mt-4">
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" /> Xem chi tiết lịch sử cuộc gọi
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TransactionTable({
  items,
  getIcon,
}: {
  items: TransactionItem[];
  getIcon: (t: string, f?: string) => React.ReactNode;
}) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Chưa có dữ liệu
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead className="w-[180px]">Thời gian</TableHead>
            <TableHead>Nội dung</TableHead>
            <TableHead className="text-right">Số tiền</TableHead>
            <TableHead className="w-[120px]">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getIcon(item.type, item.flow)}</TableCell>
              <TableCell>
                {format(new Date(item.date), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="font-medium">{item.description}</TableCell>
              <TableCell className="text-right">
                {item.amount && item.amount > 0 ? (
                  <span
                    className={
                      item.flow === "IN" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {item.flow === "IN" ? "+" : "-"}
                    {new Intl.NumberFormat("vi-VN").format(item.amount)}
                  </span>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
