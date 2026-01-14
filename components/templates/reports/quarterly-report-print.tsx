import React from "react";
import { QuarterlyReportResponse, DK13Row } from "@/types/report";

interface QuarterlyReportPrintProps {
  data: QuarterlyReportResponse | null; // The API response type might need mapping to DK13 rows
  rows?: DK13Row[]; // Or we pass processed rows
  storeName?: string;
  storeAddress?: string;
  quarter: number | string;
  year: number | string;
}

export const QuarterlyReportPrint = React.forwardRef<HTMLDivElement, QuarterlyReportPrintProps>(
  ({ data, rows, storeName, storeAddress, quarter, year }, ref) => {
    
    // If rows aren't provided, we ideally map them from `data`. 
    // Since the API response structure in `QuarterlyReportResponse` is aggregated 
    // but the Table requires per-category breakdown, we assume the parent component
    // does the heavy lifting or we use the `rows` prop if provided.
    // For this template, let's rely on `rows` being passed for the detailed table,
    // and `data` for summary stats if needed.
    
    // Fallback if no rows
    const reportRows = rows || [];

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat("vi-VN").format(val);

    return (
      <div ref={ref} className="p-8 bg-white text-black font-serif text-sm w-full">
        {/* Header */}
        <div className="flex justify-between mb-6 items-start">
          <div className="text-center w-1/3">
            <p className="font-bold uppercase">{storeName || "TÊN CƠ SỞ"}</p>
            <p className="text-xs">{storeAddress}</p>
            <div className="border-t border-black w-1/2 mx-auto my-1"></div>
            <p>Số: ...../BC</p>
          </div>
          <div className="text-center w-2/3">
            <h3 className="font-bold uppercase">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h3>
            <p className="font-bold underline">Độc lập - Tự do - Hạnh phúc</p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase mb-2">
            BÁO CÁO TÌNH HÌNH HOẠT ĐỘNG KINH DOANH DỊCH VỤ CẦM ĐỒ
          </h1>
          <p className="font-bold">
            Quý {quarter} năm {year}
          </p>
          <p className="italic text-xs mt-1">
            (Ban hành kèm theo Thông tư số 54/2012/TT-BCA)
          </p>
        </div>

        <div className="mb-4">
          <p className="text-center">
            <strong>Kính gửi:</strong> Công an .................................................................
          </p>
        </div>

        {/* Content */}
        <div className="mb-4 text-justify">
          1. Tình hình hoạt động kinh doanh:
        </div>

        <table className="w-full border-collapse border border-black text-[10px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-center" rowSpan={2}>STT</th>
              <th className="border border-black p-1 text-center" rowSpan={2}>Loại tài sản</th>
              <th className="border border-black p-1 text-center" colSpan={2}>Nhận cầm cố</th>
              <th className="border border-black p-1 text-center" colSpan={2}>Đã chuộc lại</th>
              <th className="border border-black p-1 text-center" colSpan={2}>Đã thanh lý</th>
              <th className="border border-black p-1 text-center" colSpan={2}>Tồn kho cuối kỳ</th>
            </tr>
            <tr className="bg-gray-100">
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((row, index) => (
              <tr key={row.id || index}>
                <td className="border border-black p-1 text-center">{index + 1}</td>
                <td className="border border-black p-1">{row.category}</td>
                <td className="border border-black p-1 text-center">{row.totalReceived}</td>
                <td className="border border-black p-1 text-right">{formatCurrency(row.totalReceivedValue)}</td>
                <td className="border border-black p-1 text-center">{row.totalRedeemed}</td>
                <td className="border border-black p-1 text-right">{formatCurrency(row.totalRedeemedValue)}</td>
                <td className="border border-black p-1 text-center">{row.totalLiquidated}</td>
                <td className="border border-black p-1 text-right">{formatCurrency(row.totalLiquidatedValue)}</td>
                <td className="border border-black p-1 text-center">{row.currentInventory}</td>
                <td className="border border-black p-1 text-right">{formatCurrency(row.currentInventoryValue)}</td>
              </tr>
            ))}
             {/* Total Row */}
             <tr className="font-bold bg-gray-50">
                <td className="border border-black p-1 text-center" colSpan={2}>TỔNG CỘNG</td>
                <td className="border border-black p-1 text-center">
                    {reportRows.reduce((acc, r) => acc + r.totalReceived, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.totalReceivedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {reportRows.reduce((acc, r) => acc + r.totalRedeemed, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.totalRedeemedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {reportRows.reduce((acc, r) => acc + r.totalLiquidated, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.totalLiquidatedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {reportRows.reduce((acc, r) => acc + r.currentInventory, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.currentInventoryValue, 0))}
                </td>
             </tr>
          </tbody>
        </table>

        <div className="my-4 text-justify">
          2. Chấp hành các quy định khác: ............................................................................................
          <br/>
          ..............................................................................................................................................
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-center">
          <div className="w-1/2">
            <p className="font-bold">Người lập biểu</p>
            <p className="italic text-xs">(Ký, ghi rõ họ tên)</p>
            <div className="h-24"></div>
          </div>
          <div className="w-1/2">
            <p className="italic mb-1">
              ......., ngày......tháng......năm......
            </p>
            <p className="font-bold">Đại diện cơ sở kinh doanh</p>
            <p className="italic text-xs">(Ký, ghi rõ họ tên, đóng dấu)</p>
            <div className="h-24"></div>
          </div>
        </div>
      </div>
    );
  }
);

QuarterlyReportPrint.displayName = "QuarterlyReportPrint";
