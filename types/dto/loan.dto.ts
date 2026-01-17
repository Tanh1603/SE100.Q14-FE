export interface LoanDTO {
  id: string;
  customerId: string;
  storeId?: string;
  storeName: string;
  loanCode?: string; // Added from OpenAPI
  loanAmount: number;
  totalRepayment: number;
  monthlyPayment: number;
  durationMonths: number;
  loanTypeName: string;
  repaymentMethod: string; // Simplified based on usage, or keep object if API returns object
  status: string; // Simplified to string as per typical DTO usage, or keep object if needed
  startDate: string;
  activatedAt: string;
  createdAt: string;
  appliedInterestRate?: number;
}

export interface LoanDetailDTO extends LoanDTO {
  appliedInterestRate: number;
  latePaymentPenaltyRate: number;
  totalInterest: number;
  totalFees: number;
  notes: string | null;
  updatedAt: string;
  createdBy: string;
  customer: {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    nationalId: string;
    address: string;
    // Add other customer fields as needed
  };
  collateral: Array<{
    id: string;
    collateralTypeId: number;
    ownerName: string;
    collateralInfo: any;
    status: string;
    storageLocation: string;
    appraisedValue: number;
  }>;
}

export interface LoanSummaryResponseDto {
  id: string;
  loanCode: string;
  customerId: string;
  customerName?: string; // Added potential field
  customerPhone?: string; // Added potential field
  storeName: string;
  loanAmount: number;
  totalRepayment: number;
  monthlyPayment: number;
  durationMonths: number;
  loanTypeName: string;
  repaymentMethod: string;
  status: string;
  startDate: string;
  activatedAt: string;
  createdAt: string;
  appliedInterestRate?: number; // Added based on user feedback that field exists
}

export interface PagedLoanResponseDTO {
  data: LoanSummaryResponseDto[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
