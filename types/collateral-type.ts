export interface CollateralType {
  id: number;
  name: string;
  custodyFeeRateMonthly: number;
  totalCollaterals?: number;
}

export interface CreateCollateralTypeDTO {
  name: string;
  custodyFeeRateMonthly: number;
}

export interface UpdateCollateralTypeDTO {
  name?: string;
  custodyFeeRateMonthly?: number;
}

export interface CollateralTypeListResponse {
  data: CollateralType[];
  meta?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
