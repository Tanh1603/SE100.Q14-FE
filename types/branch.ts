import { BranchStatus } from "./enum";
import { Location } from "./location";

export type Branch = {
  id: string;
  name: string;
  address: string;
  province: Location;
  ward: Location;
  phone: string;
  status: BranchStatus;
  createdAt: string;
};
