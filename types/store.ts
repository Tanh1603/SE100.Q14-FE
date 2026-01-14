import { PaginationMeta } from "./report";

export interface Store {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

export interface StoreListResponse {
  data: Store[];
  meta: PaginationMeta;
}
