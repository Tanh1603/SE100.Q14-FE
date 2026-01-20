import React from "react";
import { QuarterlyReportResponse, DK13Row } from "@/types/report";

interface QuarterlyReportPrintProps {
  data: QuarterlyReportResponse | null; 
  rows?: DK13Row[]; 
  storeName?: string;
  storeAddress?: string;
  quarter: number | string;
  year: number | string;
}

export const QuarterlyReportPrint = React.forwardRef<HTMLDivElement, QuarterlyReportPrintProps>(
  ({ data, rows, storeName, storeAddress, quarter, year }, ref) => {
    
    // Fallback if no rows
    const reportRows = rows || [];

    const formatCurrency = (val: number) =>
      new Intl.NumberFormat("vi-VN").format(val);

    return (
      <div ref={ref} className="p-8 bg-white text-black font-serif text-sm w-full">
        <style type="text/css" media="print">
          {`
            @page { size: portrait; margin: 15mm; }
            body { -webkit-print-color-adjust: exact; }
          `}
        </style>

        {/* Header */}
        <div className="flex justify-between mb-6 items-start">
          <div className="text-center w-5/12">
            <p className="font-bold uppercase">{storeName || "TÊN CƠ SỞ KD"}</p>
            <p className="text-xs">{storeAddress || "ĐỊA CHỈ: ...................."}</p>
            <div className="border-t border-black w-1/3 mx-auto my-1"></div>
            <p>Số: ...../BC-ANTT</p>
          </div>
          <div className="text-center w-7/12">
            <h3 className="font-bold uppercase text-sm">
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </h3>
            <p className="font-bold underline text-sm">Độc lập - Tự do - Hạnh phúc</p>
            <p className="italic text-xs mt-2">
              ......., ngày ...... tháng ...... năm 20......
            </p>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl font-bold uppercase mb-2">
            BÁO CÁO
          </h1>
          <h2 className="text-lg font-bold uppercase mb-2">
            TÌNH HÌNH, KẾT QUẢ THỰC HIỆN CÁC QUY ĐỊNH<br/>VỀ AN NINH, TRẬT TỰ
          </h2>
          <p className="italic">
            (Quý {quarter} năm {year})
          </p>
          <p className="italic text-xs mt-1">
            (Mẫu ĐK13 ban hành kèm theo Thông tư số 42/2017/TT-BCA)
          </p>
        </div>

        <div className="mb-4">
          <p>
            <strong>Kính gửi:</strong> ....................................................................................................
          </p>
        </div>

        {/* Section I: General Info */}
        <div className="mb-4">
          <h3 className="font-bold uppercase">I. TÌNH HÌNH CƠ BẢN</h3>
          <div className="pl-4 space-y-1">
            <p>1. Tên cơ sở kinh doanh: {storeName}</p>
            <p>2. Địa điểm kinh doanh: {storeAddress}</p>
            <p>3. Ngành, nghề kinh doanh: <strong>Dịch vụ cầm đồ</strong></p>
            <p>4. Tổng số nhân viên: ........... (Nam: ....... Nữ: .......)</p>
            <p>5. Người chịu trách nhiệm về ANTT: .................................................................</p>
          </div>
        </div>

        {/* Section II: Business Results */}
        <div className="mb-2">
          <h3 className="font-bold uppercase">II. KẾT QUẢ HOẠT ĐỘNG KINH DOANH</h3>
          <p className="pl-4 mb-2">Số liệu thống kê dịch vụ cầm đồ:</p>
        </div>

        <table className="w-full border-collapse border border-black text-[10px] mb-4">
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
              <th className="border border-black p-1 text-center">Giá trị (VNĐ)</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị (VNĐ)</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị (VNĐ)</th>
              <th className="border border-black p-1 text-center">Số lượng</th>
              <th className="border border-black p-1 text-center">Giá trị (VNĐ)</th>
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
                {/* Use Data from API if available for totals, otherwise sum rows */}
                <td className="border border-black p-1 text-center">
                    {data ? data.statistics.totalCollateralsReceived : reportRows.reduce((acc, r) => acc + r.totalReceived, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(data ? data.statistics.totalLoanAmount : reportRows.reduce((acc, r) => acc + r.totalReceivedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {reportRows.reduce((acc, r) => acc + r.totalRedeemed, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.totalRedeemedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {data ? data.statistics.totalLiquidations : reportRows.reduce((acc, r) => acc + r.totalLiquidated, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.totalLiquidatedValue, 0))}
                </td>
                <td className="border border-black p-1 text-center">
                    {data ? data.statistics.totalLoansActive : reportRows.reduce((acc, r) => acc + r.currentInventory, 0)}
                </td>
                <td className="border border-black p-1 text-right">
                    {formatCurrency(reportRows.reduce((acc, r) => acc + r.currentInventoryValue, 0))}
                </td>
             </tr>
          </tbody>
        </table>

        {/* Section III: Security */}
        <div className="mb-4">
          <h3 className="font-bold uppercase">III. TÌNH HÌNH AN NINH, TRẬT TỰ</h3>
          <div className="pl-4 space-y-1">
            <p>1. Số vụ việc liên quan đến ANTT: Không</p>
            <p>2. Số người nghi vấn: Không</p>
            <p>3. Việc chấp hành kiểm tra của cơ quan Công an: Chấp hành tốt</p>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold uppercase">IV. KIẾN NGHỊ, ĐỀ XUẤT</h3>
          <p className="pl-4">............................................................................................................................</p>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-center">
          <div className="w-1/2">
            {/* Empty for spacing */}
          </div>
          <div className="w-1/2">
            <p className="font-bold uppercase">Đại diện cơ sở kinh doanh</p>
            <p className="italic text-xs">(Ký, ghi rõ họ tên, đóng dấu)</p>
            <div className="h-24"></div>
            <p className="font-bold">.............................................</p>
          </div>
        </div>
      </div>
    );
  }
);

QuarterlyReportPrint.displayName = "QuarterlyReportPrint";
