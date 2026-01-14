import React from "react";
import { DailyLogResponse } from "@/types/report";

interface DailyLogPrintProps {
  data: DailyLogResponse | null;
  storeName?: string;
  storeAddress?: string;
}

export const DailyLogPrint = React.forwardRef<
  HTMLDivElement,
  DailyLogPrintProps
>(({ data, storeName, storeAddress }, ref) => {
  if (!data) return null;

  const allLoans = [...(data.newLoans || []), ...(data.closedLoans || [])];

  return (
    <div
      ref={ref}
      className="p-8 bg-white text-black font-serif text-sm w-full"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-bold uppercase text-base">
          Cộng hòa xã hội chủ nghĩa Việt Nam
        </h3>
        <p className="font-bold underline mb-4">Độc lập - Tự do - Hạnh phúc</p>
        <h1 className="text-2xl font-bold uppercase mb-2">
          SỔ QUẢN LÝ DỊCH VỤ CẦM ĐỒ
        </h1>
        <p className="italic">
          (Ban hành kèm theo Nghị định số 96/2016/NĐ-CP ngày 01/07/2016 của
          Chính phủ)
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
            <th className="border border-black p-1 text-center">
              Họ và tên khách hàng
            </th>
            <th className="border border-black p-1 text-center">
              Số CMND/CCCD
            </th>
            <th className="border border-black p-1 text-center">
              Địa chỉ thường trú
            </th>
            <th className="border border-black p-1 text-center">
              Loại/Mô tả tài sản
            </th>
            <th className="border border-black p-1 text-center">
              Số tiền vay (VNĐ)
            </th>
            <th className="border border-black p-1 text-center">Ngày vay</th>
            <th className="border border-black p-1 text-center">Ngày trả</th>
            <th className="border border-black p-1 text-center">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {allLoans.length > 0 ? (
            allLoans.map((loan, index) => (
              <tr key={loan.contractId}>
                <td className="border border-black p-1 text-center">
                  {index + 1}
                </td>
                <td className="border border-black p-1">{loan.customerName}</td>
                <td className="border border-black p-1 text-center">
                  {loan.nationalId}
                </td>
                <td className="border border-black p-1">{loan.address}</td>
                <td className="border border-black p-1">
                  {loan.collateralDescription}
                </td>
                <td className="border border-black p-1 text-right">
                  {new Intl.NumberFormat("vi-VN").format(loan.loanAmount)}
                </td>
                <td className="border border-black p-1 text-center">
                  {new Date(loan.loanDate).toLocaleDateString("vi-VN")}
                </td>
                <td className="border border-black p-1 text-center">
                  {loan.closedDate
                    ? new Date(loan.closedDate).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="border border-black p-1 text-center">
                  {loan.status}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={9}
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
