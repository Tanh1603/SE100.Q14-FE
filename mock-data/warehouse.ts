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
      code: "HN",
      name: "Hà Nội",
      label: "Hà Nội",
    },
    ward: {
      id: "DVH",
      code: "DVH",
      name: "Phường Dịch Vọng Hậu",
      label: "Phường Dịch Vọng Hậu",
    },
    status: WarehouseStatus.AVAILABLE,
    fee: 50000,
  },
  {
    id: "wh_hcm_q1",
    name: "Kho TP.HCM - Quận 1",
    address: "45 Lê Lợi",
    province: {
      id: "HCM",
      code: "HCM",
      name: "TP Hồ Chí Minh",
      label: "TP Hồ Chí Minh",
    },
    ward: {
      id: "BN",
      code: "BN",
      name: "Phường Bến Nghé",
      label: "Phường Bến Nghé",
    },
    status: WarehouseStatus.AVAILABLE,
    fee: 60000,
  },
  {
    id: "wh_dn_hc",
    name: "Kho Đà Nẵng - Hải Châu",
    address: "89 Nguyễn Văn Linh",
    province: {
      id: "DN",
      code: "DN",
      name: "Đà Nẵng",
      label: "Đà Nẵng",
    },
    ward: {
      id: "TT",
      code: "TT",
      name: "Phường Thạch Thang",
      label: "Phường Thạch Thang",
    },
    status: WarehouseStatus.AVAILABLE,
    fee: 70000,
  },
];
