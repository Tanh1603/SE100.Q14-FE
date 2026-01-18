import * as XLSX from "xlsx";
import {
  QuarterlyReportResponse,
  RevenueReportListResponse,
} from "@/types/report";

export const exportQuarterlyReportToExcel = (
  data: QuarterlyReportResponse,
  year: number | string,
  quarter: number | string,
  storeName: string = "Cửa hàng cầm đồ",
) => {
  if (!data) return;

  const workbook = XLSX.utils.book_new();
  const rows: any[] = [];

  // Header Info
  rows.push(["CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM"]);
  rows.push(["Độc lập - Tự do - Hạnh phúc"]);
  rows.push([]);
  rows.push([
    `BÁO CÁO TÌNH HÌNH, KẾT QUẢ THỰC HIỆN CÁC QUY ĐỊNH VỀ AN NINH, TRẬT TỰ`,
  ]);
  rows.push([`(Quý ${quarter} năm ${year})`]);
  rows.push([]);
  rows.push([
    `Kính gửi: ............................................................................`,
  ]);
  rows.push([]);
  rows.push([`I. TÌNH HÌNH CƠ BẢN`]);
  rows.push([`1. Tên cơ sở kinh doanh: ${storeName}`]);
  rows.push([`2. Ngành, nghề kinh doanh: Dịch vụ cầm đồ`]);
  rows.push([]);
  rows.push([`II. KẾT QUẢ HOẠT ĐỘNG KINH DOANH`]);
  rows.push([]);

  // Table Header
  // We need to merge cells manually if we want exact look, but for simple export, we'll just do 2 header rows
  const headerRow1 = [
    "STT",
    "Loại tài sản",
    "Nhận cầm cố",
    "",
    "Đã chuộc lại",
    "",
    "Đã thanh lý",
    "",
    "Tồn kho cuối kỳ",
    "",
  ];
  const headerRow2 = [
    "",
    "",
    "Số lượng",
    "Giá trị (VNĐ)",
    "Số lượng",
    "Giá trị (VNĐ)",
    "Số lượng",
    "Giá trị (VNĐ)",
    "Số lượng",
    "Giá trị (VNĐ)",
  ];

  rows.push(headerRow1);
  rows.push(headerRow2);

  // Data Rows
  if (data.statistics.assetBreakdown) {
    data.statistics.assetBreakdown.forEach((item, index) => {
      rows.push([
        index + 1,
        item.category,
        item.receivedCount,
        item.receivedValue,
        item.releasedCount,
        item.releasedValue,
        item.liquidatedCount,
        item.liquidatedValue,
        item.inStockCount,
        item.inStockValue,
      ]);
    });

    // Totals
    const totalReceivedCount = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.receivedCount,
      0,
    );
    const totalReceivedValue = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.receivedValue,
      0,
    );
    const totalReleasedCount = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.releasedCount,
      0,
    );
    const totalReleasedValue = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.releasedValue,
      0,
    );
    const totalLiquidatedCount = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.liquidatedCount,
      0,
    );
    const totalLiquidatedValue = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.liquidatedValue,
      0,
    );
    const totalInStockCount = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.inStockCount,
      0,
    );
    const totalInStockValue = data.statistics.assetBreakdown.reduce(
      (acc, cur) => acc + cur.inStockValue,
      0,
    );

    rows.push([
      "Tổng",
      "",
      totalReceivedCount,
      totalReceivedValue,
      totalReleasedCount,
      totalReleasedValue,
      totalLiquidatedCount,
      totalLiquidatedValue,
      totalInStockCount,
      totalInStockValue,
    ]);
  }

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Merges
  worksheet["!merges"] = [
    { s: { r: 15, c: 2 }, e: { r: 15, c: 3 } }, // Nhận cầm cố
    { s: { r: 15, c: 4 }, e: { r: 15, c: 5 } }, // Đã chuộc lại
    { s: { r: 15, c: 6 }, e: { r: 15, c: 7 } }, // Đã thanh lý
    { s: { r: 15, c: 8 }, e: { r: 15, c: 9 } }, // Tồn kho
  ];

  // Column widths
  worksheet["!cols"] = [
    { wch: 5 },
    { wch: 25 },
    { wch: 10 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
    { wch: 10 },
    { wch: 15 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoDK13");
  XLSX.writeFile(workbook, `BaoCao_DK13_Q${quarter}_${year}.xlsx`);
};

export const exportRevenueReportToExcel = (
  data: RevenueReportListResponse,
  fromDate: string,
  toDate: string,
  storeName: string = "Cửa hàng cầm đồ",
) => {
  if (!data) return;

  const workbook = XLSX.utils.book_new();
  const rows: any[] = [];

  rows.push([`BÁO CÁO DOANH THU`]);
  rows.push([`Cơ sở: ${storeName}`]);
  rows.push([`Từ ngày: ${fromDate} Đến ngày: ${toDate}`]);
  rows.push([]);

  // Summary Section
  rows.push(["TỔNG HỢP"]);
  rows.push(["Tổng doanh thu", data.summary.totalRevenue]);
  rows.push(["Tổng chi phí", data.summary.totalExpense]);
  rows.push([
    "Lợi nhuận ròng",
    data.summary.totalRevenue - data.summary.totalExpense,
  ]);
  rows.push(["Giải ngân (Vốn)", data.summary.totalLoanDisbursement]);
  rows.push([]);

  rows.push(["CHI TIẾT MỤC DOANH THU"]);
  rows.push(["Lãi vay", data.summary.totalInterest]);
  rows.push(["Phí dịch vụ", data.summary.totalServiceFee]);
  rows.push(["Phạt quá hạn", data.summary.totalLateFee]);
  rows.push(["Thanh lý (Thặng dư)", data.summary.totalLiquidationExcess]);
  rows.push([]);

  // Daily Details
  rows.push(["CHI TIẾT HẰNG NGÀY"]);
  rows.push(["Ngày", "Doanh thu", "Chi phí", "Lợi nhuận"]);

  const detailData = Array.isArray(data.data) ? data.data : [];
  detailData.forEach((item) => {
    rows.push([
      item.date,
      item.totalRevenue,
      item.totalExpense,
      item.totalRevenue - item.totalExpense,
    ]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  worksheet["!cols"] = [{ wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

  XLSX.utils.book_append_sheet(workbook, worksheet, "BaoCaoDoanhThu");
  XLSX.writeFile(workbook, `BaoCao_DoanhThu_${fromDate}_${toDate}.xlsx`);
};
