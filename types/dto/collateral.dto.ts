export type CollateralStatus =
  | "PROPOSED"
  | "PLEDGED"
  | "STORED"
  | "RELEASED"
  | "REJECTED"
  | "LIQUIDATING"
  | "SOLD";

export interface CollateralImage {
  url: string;
  publicId: string;
}

export interface CollateralAssetResponse {
  id: string;
  collateralTypeId: number;
  ownerName: string;
  collateralInfo: Record<string, unknown>;
  status: CollateralStatus;
  loanId?: string;
  loanCode?: string; // Optional: Enriched field
  storageLocation?: string;
  receivedDate?: string;
  appraisedValue?: number;
  ltvRatio?: number;
  sellPrice?: number; // Giá định bán (LIQUIDATING) or Giá bán thực tế (SOLD)
  sellDate?: string;
  appraisalDate?: string;
  appraisalNotes?: string;
  images?: CollateralImage[];
  createdAt?: string;
  updatedAt?: string;
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

export interface InitiateLiquidationRequest {
  collateralId: string;
  minimumSalePrice: number;
}

export interface FinalizeLiquidationRequest {
  sellPrice: number;
}
