// mock-data/warehouses.ts
import { WarehouseStatus } from "@/types/enum";
import { Warehouse } from "@/types/warehouse";

export const mockwarehouses: Warehouse[] = [
  {
    id: "wh_hn_cg",
    name: "Kho Hà Nội - Cầu Giấy",
    address: "Số 12 Trần Thái Tông",
    province: {
      id: "HN",
      label: "Hà Nội",
    },
    ward: {
      id: "DVH",
      label: "Phường Dịch Vọng Hậu",
    },
    status: WarehouseStatus.AVAILABLE,
  },
  {
    id: "wh_hcm_q1",
    name: "Kho TP.HCM - Quận 1",
    address: "45 Lê Lợi",
    province: {
      id: "HCM",
      label: "TP Hồ Chí Minh",
    },
    ward: {
      id: "BN",
      label: "Phường Bến Nghé",
    },
    status: WarehouseStatus.AVAILABLE,
  },
  {
    id: "wh_dn_hc",
    name: "Kho Đà Nẵng - Hải Châu",
    address: "89 Nguyễn Văn Linh",
    province: {
      id: "DN",
      label: "Đà Nẵng",
    },
    ward: {
      id: "TT",
      label: "Phường Thạch Thang",
    },
    status: WarehouseStatus.AVAILABLE,
  },
];
