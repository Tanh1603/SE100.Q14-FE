export const getLoanStatusLabel = (status: string): string => {
  switch (status) {
    case "ACTIVE":
      return "Đang vay";
    case "OVERDUE":
      return "Quá hạn";
    case "CLOSED":
      return "Đã tất toán";
    case "PENDING":
      return "Chờ duyệt";
    case "REJECTED":
      return "Từ chối";
    case "LIQUIDATED":
      return "Đã thanh lý";
    default:
      return status;
  }
};
