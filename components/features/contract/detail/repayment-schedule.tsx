"use client";

import { useEffect, useState } from "react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, CalendarClock } from "lucide-react";
import { LoanDetailDTO } from "@/types/dto/loan.dto";
import { format } from "date-fns";
import { LoanService } from "@/lib/loan.service";
import { RepaymentScheduleItemResponse } from "@/types/dto/repayment.dto";
import { Skeleton } from "@/components/ui/skeleton";

interface RepaymentScheduleProps {
  loan: LoanDetailDTO;
}

export function RepaymentSchedule({ loan }: RepaymentScheduleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState<RepaymentScheduleItemResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch schedule only when opening the accordion to save bandwidth
  // or on mount if preferred. Here we fetch on mount to show summary.
  useEffect(() => {
    if (loan.id) {
        setLoading(true);
        LoanService.getRepaymentSchedule(loan.id)
            .then(data => {
                setSchedule(data || []);
            })
            .catch(err => console.error("Failed to load schedule", err))
            .finally(() => {
                setLoading(false);
                setHasFetched(true);
            });
    }
  }, [loan.id]);

  // Summary calculations
  const totalPrincipal = schedule.reduce((acc, item) => acc + item.principalAmount, 0);
  const totalInterest = schedule.reduce((acc, item) => acc + item.interestAmount, 0);

  const getStatusBadge = (status: string) => {
      switch (status) {
          case "PAID": return <Badge variant="secondary" className="bg-green-100 text-green-800">Đã thanh toán</Badge>;
          case "OVERDUE": return <Badge variant="destructive">Quá hạn</Badge>;
          default: return <Badge variant="outline">Chưa đến hạn</Badge>;
      }
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarClock className="h-5 w-5" />
                Lịch trả nợ thực tế
              </CardTitle>
              <CardDescription>
                Lịch chi tiết từ hệ thống
              </CardDescription>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle</span>
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        
        <CollapsibleContent>
          <CardContent>
            {loading && !hasFetched ? (
                <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Kỳ</TableHead>
                    <TableHead>Ngày đến hạn</TableHead>
                    <TableHead className="text-right">Gốc</TableHead>
                    <TableHead className="text-right">Lãi</TableHead>
                    <TableHead className="text-right">Tổng cộng</TableHead>
                    <TableHead className="text-right">Đã trả</TableHead>
                    <TableHead className="w-[120px]">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.length === 0 ? (
                      <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-4">Chưa có lịch trả nợ</TableCell>
                      </TableRow>
                  ) : (
                    schedule.map((item) => (
                        <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.periodNumber}</TableCell>
                        <TableCell>{format(new Date(item.dueDate), "dd/MM/yyyy")}</TableCell>
                        <TableCell className="text-right">
                            {new Intl.NumberFormat("vi-VN").format(item.principalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                            {new Intl.NumberFormat("vi-VN").format(item.interestAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                            {new Intl.NumberFormat("vi-VN").format(item.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                            {new Intl.NumberFormat("vi-VN").format((item.paidPrincipal || 0) + (item.paidInterest || 0))}
                        </TableCell>
                        <TableCell>
                            {getStatusBadge(item.status)}
                        </TableCell>
                        </TableRow>
                    ))
                  )}
                  {schedule.length > 0 && (
                    <TableRow className="bg-muted/50 font-bold">
                        <TableCell colSpan={2}>Tổng cộng</TableCell>
                        <TableCell className="text-right">
                        {new Intl.NumberFormat("vi-VN").format(totalPrincipal)}
                        </TableCell>
                        <TableCell className="text-right">
                        {new Intl.NumberFormat("vi-VN").format(totalInterest)}
                        </TableCell>
                        <TableCell className="text-right">
                        {new Intl.NumberFormat("vi-VN").format(totalPrincipal + totalInterest)}
                        </TableCell>
                        <TableCell colSpan={2} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            )}
          </CardContent>
        </CollapsibleContent>
        
        {!isOpen && (
           <div className="px-6 pb-4 pt-0">
             <p className="text-sm text-muted-foreground">
               Nhấn vào mũi tên để xem chi tiết lịch trả nợ ({schedule.length} kỳ).
             </p>
           </div>
        )}
      </Collapsible>
    </Card>
  );
}
