@startuml
' --- CẤU HÌNH GIAO DIỆN (STYLES) ---
skinparam backgroundColor white
skinparam handwritten false
skinparam defaultFontName Arial
skinparam roundcorner 10

' Quy định chiều: Trái sang Phải (Menu bên trái, Màn hình bên phải)
left to right direction


' Style cho Màn hình chính (Trắng, viền xám)
skinparam card {
    BackgroundColor white
    BorderColor #7f8c8d
    FontColor #2c3e50
    FontStyle normal
    Shadowing true
}

' Style cho Cửa sổ phụ/Popup (Màu vàng nhạt, viền đứt)
skinparam frame {
    BackgroundColor #fff3cd
    BorderColor #f39c12
    FontColor #856404
    BorderStyle dashed
    Shadowing false
}

' --- CỘT 1: MENU ĐIỀU HƯỚNG ---
rectangle "MENU CHÍNH" as MainMenu {
    rectangle "Trang chủ" as MenuHome
    rectangle "Hợp đồng" as MenuContracts
    rectangle "Duyệt vay" as MenuLoans
    rectangle "Khách hàng" as MenuCustomers
    rectangle "Tài sản & Kho" as MenuAssets
    rectangle "Báo cáo" as MenuReport
    rectangle "Cài đặt" as MenuSettings
}

' --- CỘT 2 & 3: MÀN HÌNH VÀ THAO TÁC ---

' 1. Luồng Hợp đồng
card "Danh sách Hợp đồng" as PageContracts
card "Màn hình: Tạo Hợp đồng" as PageCreateContract
card "Màn hình: Chi tiết H.Đồng" as PageContractDetail
frame "Cửa sổ: Thu tiền / Đóng lãi" as PopupPayment
frame "Cửa sổ: Nhắc nợ" as PopupReminder

MenuContracts --> PageContracts
PageContracts --> PageCreateContract : Thêm mới
PageContracts --> PageContractDetail : Xem chi tiết
PageContracts ..> PopupPayment : Thao tác nhanh
PageContracts ..> PopupReminder : Thao tác nhanh

' 2. Luồng Duyệt vay
card "Quản lý Duyệt vay" as PageLoanMgmt
card "Danh sách Đang vay" as PageLoanActive

MenuLoans --> PageLoanMgmt
MenuLoans --> PageLoanActive

' 3. Luồng Khách hàng
card "Danh sách Khách hàng" as PageCustomers
frame "Cửa sổ: Form Khách hàng" as PopupCustomer

MenuCustomers --> PageCustomers
PageCustomers ..> PopupCustomer : Thêm / Sửa

' 4. Luồng Tài sản
card "Kho Tài sản" as PageAssets
frame "Cửa sổ: Thêm Tài sản" as PanelAssetCreate
frame "Cửa sổ: Xem & Thanh lý" as PanelAssetView

MenuAssets --> PageAssets
PageAssets ..> PanelAssetCreate : Nhập kho
PageAssets ..> PanelAssetView : Chi tiết / Xử lý
' Liên kết chéo
PanelAssetView --> PageContractDetail : Xem nguồn gốc

' 5. Báo cáo & Cài đặt
card "Tổng hợp Báo cáo" as PageReports
card "Cài đặt Hệ thống" as PageSettings

MenuReport --> PageReports
MenuSettings --> PageSettings

' --- CHÚ THÍCH (LEGEND) ---
legend right
    | Ký hiệu | Ý nghĩa |
    | <#lightgrey> | **Mục Menu bên trái** |
    | <#white> | **Màn hình chính (Trang)** |
    | <#fff3cd> | **Cửa sổ bật lên / Khung phụ** |
    | ────▶ | Mũi tên liền: Chuyển trang |
    | - - - ▶ | Mũi tên đứt: Mở cửa sổ/Popup |
endlegend

@enduml