import { WarehouseStatus } from "./enum";
import { Location } from "./location";

export type Warehouse = {
  id: string;
  name: string;
  address: string;
  province: Location;
  ward: Location;
  status: WarehouseStatus;
};
