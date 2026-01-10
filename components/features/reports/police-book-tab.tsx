"use client";

import { BookMarked, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockPoliceLog } from "@/mock-data/police-report";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PoliceBookTab = () => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <BookMarked className="text-primary mr-3 w-8 h-8" />
          <div>
            <h1 className="text-2xl text-primary font-bold">Sổ quản lý ANTT</h1>
            <p className="text-sm text-muted-foreground">
              Nhật ký hoạt động cầm đồ (Mẫu quy định nghị định 96)
            </p>
          </div>
        </div>
        <Button variant="outline">
          <Printer className="mr-2 h-4 w-4" />
          In sổ ngày {today}
        </Button>
      </div>

      {/* Suspicious Items Alert */}
      {mockPoliceLog.some((i) => i.isSuspicious) && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-red-700 text-lg flex items-center">
              🔴 Cảnh báo tài sản nghi vấn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {mockPoliceLog
                .filter((i) => i.isSuspicious)
                .map((item) => (
                  <div
                    key={item.id}
                    className="text-sm text-red-800 bg-red-100 p-2 rounded flex justify-between"
                  >
                    <span>
                      <strong>{item.serialNumber}</strong> -{" "}
                      {item.assetDescription} ({item.customerName})
                    </span>
                    <span className="italic">{item.note}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily Log Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">
            Nhật ký trong ngày ({today})
          </h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Ngày</TableHead>
              <TableHead className="w-[200px]">Họ tên khách</TableHead>
              <TableHead className="w-[150px]">Số CCCD</TableHead>
              <TableHead className="w-[300px]">Thường trú</TableHead>
              <TableHead>Mô tả tài sản</TableHead>
              <TableHead className="w-[150px]">Số khung/Máy/Serial</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPoliceLog.map((log) => (
              <TableRow
                key={log.id}
                className={log.isSuspicious ? "bg-red-50" : ""}
              >
                <TableCell>{log.date}</TableCell>
                <TableCell className="font-medium">
                  {log.customerName}
                </TableCell>
                <TableCell>{log.cccd}</TableCell>
                <TableCell className="text-xs">{log.address}</TableCell>
                <TableCell>{log.assetDescription}</TableCell>
                <TableCell className="font-mono text-xs">
                  {log.serialNumber}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PoliceBookTab;
