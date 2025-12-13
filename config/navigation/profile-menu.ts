import { Store, User } from "lucide-react";

export const profileMenuConfig = [
  {
    key: "profile",
    label: "Thông tin cá nhân",
    roles: ["manager", "staff"],
    icon: User,
  },
  {
    key: "branch",
    label: "Thông tin cửa hàng",
    roles: ["manager", "staff"],
    icon: Store, // hoặc Building2
  },
];
