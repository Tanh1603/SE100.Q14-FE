# Hướng dẫn Cài đặt và Chạy Dự án (Frontend)

Chào mừng thầy/cô đến với repository Frontend của nhóm thực hiện đồ án môn học SE100.

**SE100.Q14-FE** là giao diện người dùng cho **Hệ thống Quản lý Cầm đồ Đô thị**, được xây dựng hiện đại, trực quan và tối ưu cho quy trình nghiệp vụ cầm cố tài sản.

**⚠️ Lưu ý quan trọng:**
Hệ thống này hoạt động theo mô hình Client-Server tách biệt.

- **Frontend** (Repo này): Chạy giao diện người dùng.
- **Backend** (Repo khác): Xử lý logic và cơ sở dữ liệu.
  > **Vui lòng đảm bảo Backend Server đã được khởi chạy thành công trước khi sử dụng Frontend để tránh các lỗi kết nối API.**

---

## 1. Yêu cầu môi trường (Prerequisites)

Để chạy được dự án này, máy tính cần cài đặt sẵn:

- **Node.js**: Phiên bản 18.x hoặc mới hơn (Khuyến nghị 20.x).
- **npm**: Trình quản lý gói đi kèm với Node.js.

## 2. Hướng dẫn Cài đặt (Installation)

**Bước 1: Clone repository về máy**

```bash
git clone <URL_CUA_REPO_NAY>
cd SE100.Q14-FE
```

**Bước 2: Cài đặt dependencies**
Chạy lệnh sau để tải về các thư viện cần thiết:

```bash
npm install
```

**Bước 3: Cầu hình môi trường (.env)**
Dự án cần biết địa chỉ của Backend API.

- Copy file cấu hình mẫu `.env.example` thành `.env`:

  ```bash
  cp .env.example .env
  ```

  _(Trên Windows CMD có thể dùng `copy .env.example .env`)_

- Mở file `.env` vừa tạo và kiểm tra biến `NEXT_PUBLIC_API_URL`.
  - Mặc định đang để là: `http://localhost:3000/api/v1`
  - Nếu Backend của thầy/cô chạy ở port khác (ví dụ 8080), hãy sửa lại đường dẫn này cho phù hợp.

## 3. Chạy Ứng dụng (Running)

Do Backend thường chiếm cổng 3000, Frontend này đã được cấu hình để chạy trên cổng **3001**.
_Cổng này được cấu hình mặc định trong `package.json` và `next.config.ts`. (Sử dụng lệnh `next dev -p 3001`)_

Khởi chạy ở chế độ Development:

```bash
npm run dev
```

Sau khi lệnh chạy xong, mở trình duyệt và truy cập:
👉 **http://localhost:3001**

## 4. Tính năng Chính (Key Features)

Dự án cung cấp các tính năng quản lý toàn diện:

- **Quản lý Hợp đồng Vay (Loans):** Tạo mới, duyệt vay, gia hạn, trả lãi và tất toán.
- **Quản lý Tài sản (Assets):** Theo dõi trang thái tài sản (`PLEDGED`, `STORED`, `SOLD`), định giá AI, kho bãi và thanh lý.
- **Quản lý Khách hàng (CRM):** Lưu trữ thông tin định danh (CCCD), xác thực khách hàng (KYC), lịch sử tín dụng.
- **Báo cáo Thống kê:** Dashboard trực quan về dòng tiền, nhắc nợ và báo cáo theo mẫu quy định (ĐK13).

## 5. Công nghệ sử dụng (Tech Stack)

Frontend được xây dựng trên các công nghệ mới nhất để đảm bảo hiệu năng và trải nghiệm người dùng:

- **Core:** Next.js 16 (App Router), React 19.
- **Styling:** TailwindCSS, Shadcn/UI (Component Library).
- **State Management:** TanStack Query (React Query).
- **Form Handling:** React Hook Form + Zod Validation.
- **Utilities:** Axios, Date-fns, Recharts (Biểu đồ).

## 6. Thông tin liên hệ (Contact Info)

Nếu gặp vấn đề trong quá trình cài đặt hoặc chấm bài, xin vui lòng liên hệ với đại diện nhóm:

| Họ và Tên          | MSSV     | Email                  |
| ------------------ | -------- | ---------------------- |
| Nguyễn Lê Tuấn Anh | 23520064 | 23520064@gm.uit.edu.vn |
| Nguyễn Thiên An    | 23520020 | 23520020@gm.uit.edu.vn |

_(Thầy/cô vui lòng liên hệ qua Email nếu cần hỗ trợ gấp)_

---

**Thông tin thêm:**

- Tech stack chi tiết: Next.js 16, React 19, TailwindCSS, TypeScript.
- Lệnh build production: `npm run build` && `npm run start`.
- Nếu gặp lỗi `EADDRINUSE`, vui lòng tắt các tiến trình đang chạy trên cổng 3001.
