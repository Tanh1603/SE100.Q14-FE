export type CollateralStatus =
  | "PROPOSED"
  | "PLEDGED"
  | "STORED"
  | "RELEASED"
  | "REJECTED"
  | "LIQUIDATING"
  | "SOLD";

export interface CollateralAssetResponse {
  id: string;
  collateralTypeId: number;
  ownerName: string;
  collateralInfo: Record<string, any>;
  status: CollateralStatus;
  loanId?: string;
  loanCode?: string; // Optional: Enriched field
  storageLocation?: string;
  receivedDate?: string;
  appraisedValue?: number;
  ltvRatio?: number;
}

export interface CollateralListResponse {
  data: CollateralAssetResponse[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}

export interface UpdateLocationRequest {
  storageLocation: string;
}

export interface CreateLiquidationRequest {
  collateralId: string;
  soldPrice: number;
  soldDate: string;
}
