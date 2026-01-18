import React from "react";
import { EnrichedDailyLogEntry, DailyLogSummary } from "@/types/report";

import { getLoanStatusLabel } from "@/lib/format.helper";

interface DailyLogPrintProps {
  data: {
    date: string;
    newLoans: EnrichedDailyLogEntry[];
    closedLoans: EnrichedDailyLogEntry[];
    summary: DailyLogSummary;
  } | null;
  storeName?: string;
  storeAddress?: string;
}

export const DailyLogPrint = React.forwardRef<
  HTMLDivElement,
  DailyLogPrintProps
>(({ data, storeName, storeAddress }, ref) => {
  if (!data) return null;

  // Combine and Sort by Date/Time if possible, or just concat
  // For the "Book", usually it's chronological.
  // We will just list them. The API returns new and closed.
  // Mẫu ĐK19 lists transactions.
  const allLoans = [...data.newLoans, ...data.closedLoans];

  return (
    <div
      ref={ref}
      className="p-8 bg-white text-black font-serif text-sm w-full landscape:w-auto"
    >
      <style type="text/css" media="print">
        {`
            @page { size: landscape; margin: 10mm; }
            body { -webkit-print-color-adjust: exact; }
          `}
      </style>

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-bold uppercase text-base">
          Cộng hòa xã hội chủ nghĩa Việt Nam
        </h3>
        <p className="font-bold underline mb-4">Độc lập - Tự do - Hạnh phúc</p>
        <h1 className="text-2xl font-bold uppercase mb-2">
          SỔ QUẢN LÝ KINH DOANH DỊCH VỤ CẦM ĐỒ
        </h1>
        <p className="italic">
          (Mẫu ĐK19 ban hành kèm theo Thông tư số 42/2017/TT-BCA)
        </p>
      </div>

      {/* Store Info */}
      <div className="mb-6">
        <p>
          <strong>Tên cơ sở kinh doanh:</strong>{" "}
          {storeName || "...................."}
        </p>
        <p>
          <strong>Địa điểm kinh doanh:</strong>{" "}
          {storeAddress || "...................."}
        </p>
        <p>
          <strong>Ngày báo cáo:</strong>{" "}
          {new Date(data.date).toLocaleDateString("vi-VN")}
        </p>
      </div>

      {/* Table */}
      <table className="w-full border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-black p-1 text-center w-10">STT</th>
            <th className="border border-black p-1 text-center w-24">
              Ngày nhận cầm cố
            </th>
            <th className="border border-black p-1 text-center">
              Họ và tên khách hàng
            </th>
            <th className="border border-black p-1 text-center w-24">
              Số CMND/ CCCD/ Hộ chiếu
            </th>
            <th className="border border-black p-1 text-center">
              Địa chỉ thường trú
            </th>
            <th className="border border-black p-1 text-center">
              Loại tài sản, đặc điểm, số máy/khung
            </th>
            <th className="border border-black p-1 text-center">Mã HĐ</th>
            <th className="border border-black p-1 text-center">
              Số tiền cầm cố (VNĐ)
            </th>
            <th className="border border-black p-1 text-center w-16">
              Lãi suất (%)
            </th>
            <th className="border border-black p-1 text-center w-16">
              Thời hạn (tháng)
            </th>
            <th className="border border-black p-1 text-center w-24">
              Ngày trả/ thanh lý
            </th>
            <th className="border border-black p-1 text-center">Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          {allLoans.length > 0 ? (
            allLoans.map((loan, index) => (
              <tr key={loan.contractId}>
                <td className="border border-black p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black p-1 text-center">
                  {new Date(loan.loanDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="border border-black p-1">{loan.customerName}</td>
                <td className="border border-black p-1 text-center">
                  {loan.nationalId}
                </td>
                <td className="border border-black p-1">{loan.address}</td>
                <td className="border border-black p-1">
                  {loan.collateralDescription}
                </td>
                <td className="border border-black p-1 text-center font-bold">
                  {loan.loanCode}
                </td>
                <td className="border border-black p-1 text-right">
                  {new Intl.NumberFormat("vi-VN").format(loan.loanAmount)}
                </td>
                <td className="border border-black p-1 text-center">
                  {loan.interestRate ? `${loan.interestRate}%` : "-"}
                </td>
                <td className="border border-black p-1 text-center">
                  {loan.duration || "-"}
                </td>
                <td className="border border-black p-1 text-center">
                  {loan.closedDate
                    ? new Date(loan.closedDate).toLocaleDateString("vi-VN")
                    : ""}
                </td>
                <td className="border border-black p-1 text-center">
                  {getLoanStatusLabel(loan.status)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={12}
                className="border border-black p-4 text-center italic"
              >
                Không có giao dịch nào trong ngày
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Footer */}
      <div className="mt-8 flex justify-between text-center">
        <div className="w-1/2">
          <p className="font-bold">Người lập sổ</p>
          <p className="italic text-xs">(Ký, ghi rõ họ tên)</p>
          <div className="h-24"></div>
        </div>
        <div className="w-1/2">
          <p className="italic mb-1">Ngày......tháng......năm......</p>
          <p className="font-bold">Chủ cơ sở</p>
          <p className="italic text-xs">(Ký, ghi rõ họ tên, đóng dấu)</p>
          <div className="h-24"></div>
        </div>
      </div>
    </div>
  );
});

DailyLogPrint.displayName = "DailyLogPrint";
