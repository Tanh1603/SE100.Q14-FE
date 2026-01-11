export interface LoanDTO {
  id: string;
  customerId: string;
  storeName: string;
  loanAmount: number;
  totalRepayment: number;
  monthlyPayment: number;
  durationMonths: number;
  loanTypeName: string;
  repaymentMethod: {
    id?: string;
    name?: string;
    // Add other fields if known, using 'any' or optional for safety
    [key: string]: any;
  };
  status: {
    id?: string;
    name?: string;
    code?: string;
    // Add other fields if known
    [key: string]: any;
  };
  startDate: string;
  activatedAt: string;
  createdAt: string;
}

export interface PagedLoanResponseDTO {
  data: LoanDTO[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
