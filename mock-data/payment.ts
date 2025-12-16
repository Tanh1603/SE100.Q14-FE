import type { Payment, LoanSummary } from "@/types/payment";

export const mockPayments: Payment[] = [
  // === MONEY IN (Customer Payments) ===
  {
    id: "pay-001",
    loanId: "loan-001",
    amount: 5000000,
    flow: "IN",
    paymentMethod: "CASH",
    paymentType: "PERIODIC",
    referenceCode: "RC-20231215-001",
    notes: "Thanh toán kỳ 1",
    paidAt: "2024-12-15T10:30:00Z",
    createdAt: "2024-12-15T10:30:00Z",
    updatedAt: "2024-12-15T10:30:00Z",
    allocations: [
      {
        periodNumber: 1,
        component: "INTEREST",
        amount: 1000000,
        description: "Lãi kỳ 1",
      },
      {
        periodNumber: 1,
        component: "PRINCIPAL",
        amount: 4000000,
        description: "Gốc kỳ 1",
      },
    ],
    loan: {
      id: "loan-001",
      contractNumber: "HD-2024-001",
      customerName: "Nguyễn Văn An",
      outstandingBalance: 45000000,
    },
  },
  {
    id: "pay-002",
    loanId: "loan-002",
    amount: 10000000,
    flow: "IN",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "EARLY",
    referenceCode: "RC-20231214-002",
    notes: "Thanh toán trước hạn",
    paidAt: "2024-12-14T14:20:00Z",
    createdAt: "2024-12-14T14:20:00Z",
    updatedAt: "2024-12-14T14:20:00Z",
    allocations: [
      { periodNumber: 2, component: "INTEREST", amount: 2500000 },
      { periodNumber: 2, component: "PRINCIPAL", amount: 7500000 },
    ],
    loan: {
      id: "loan-002",
      contractNumber: "HD-2024-002",
      customerName: "Trần Thị Bình",
      outstandingBalance: 30000000,
    },
  },
  {
    id: "pay-003",
    loanId: "loan-003",
    amount: 50000000,
    flow: "IN",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "PAYOFF",
    referenceCode: "RC-20231213-003",
    notes: "Tất toán hợp đồng",
    paidAt: "2024-12-13T09:00:00Z",
    createdAt: "2024-12-13T09:00:00Z",
    updatedAt: "2024-12-13T09:00:00Z",
    allocations: [
      { periodNumber: 3, component: "INTEREST", amount: 5000000 },
      { periodNumber: 3, component: "PRINCIPAL", amount: 44000000 },
      { periodNumber: 3, component: "SERVICE_FEE", amount: 1000000 },
    ],
    loan: {
      id: "loan-003",
      contractNumber: "HD-2024-003",
      customerName: "Lê Văn Cường",
      outstandingBalance: 0,
    },
  },
  {
    id: "pay-004",
    loanId: "loan-004",
    amount: 2000000,
    flow: "IN",
    paymentMethod: "CASH",
    paymentType: "LATE_FEE",
    referenceCode: "RC-20231212-004",
    notes: "Thanh toán phí trễ hạn",
    paidAt: "2024-12-12T16:45:00Z",
    createdAt: "2024-12-12T16:45:00Z",
    updatedAt: "2024-12-12T16:45:00Z",
    allocations: [
      { periodNumber: 4, component: "LATE_FEE", amount: 1500000 },
      { periodNumber: 4, component: "PENALTY", amount: 500000 },
    ],
    loan: {
      id: "loan-004",
      contractNumber: "HD-2024-004",
      customerName: "Phạm Thị Dung",
      outstandingBalance: 25000000,
    },
  },
  {
    id: "pay-005",
    loanId: "loan-001",
    amount: 5000000,
    flow: "IN",
    paymentMethod: "CASH",
    paymentType: "PERIODIC",
    referenceCode: "RC-20231211-005",
    notes: "Thanh toán kỳ 2",
    paidAt: "2024-12-11T11:00:00Z",
    createdAt: "2024-12-11T11:00:00Z",
    updatedAt: "2024-12-11T11:00:00Z",
    allocations: [
      { periodNumber: 2, component: "INTEREST", amount: 900000 },
      { periodNumber: 2, component: "PRINCIPAL", amount: 4100000 },
    ],
    loan: {
      id: "loan-001",
      contractNumber: "HD-2024-001",
      customerName: "Nguyễn Văn An",
      outstandingBalance: 40000000,
    },
  },

  // === MONEY OUT (Contract Disbursements) ===
  // TODO: These records will be auto-created when admin approves a contract
  {
    id: "pay-006",
    loanId: "loan-005",
    amount: 60000000,
    flow: "OUT",
    paymentMethod: "BANK_TRANSFER",
    paymentType: "DISBURSEMENT",
    referenceCode: "DISB-20231210-001",
    notes: "Giải ngân hợp đồng HD-2024-005",
    paidAt: "2024-12-10T09:00:00Z",
    createdAt: "2024-12-10T09:00:00Z",
    updatedAt: "2024-12-10T09:00:00Z",
    loan: {
      id: "loan-005",
      contractNumber: "HD-2024-005",
      customerName: "Hoàng Văn Em",
      outstandingBalance: 60000000,
    },
  },
  {
    id: "pay-007",
    loanId: "loan-001",
    amount: 50000000,
    flow: "OUT",
    paymentMethod: "CASH",
    paymentType: "DISBURSEMENT",
    referenceCode: "DISB-20231201-002",
    notes: "Giải ngân hợp đồng HD-2024-001",
    paidAt: "2024-12-01T10:00:00Z",
    createdAt: "2024-12-01T10:00:00Z",
    updatedAt: "2024-12-01T10:00:00Z",
    loan: {
      id: "loan-001",
      contractNumber: "HD-2024-001",
      customerName: "Nguyễn Văn An",
      outstandingBalance: 50000000,
    },
  },
];

export const mockLoans: LoanSummary[] = [
  {
    id: "loan-001",
    contractNumber: "HD-2024-001",
    customerName: "Nguyễn Văn An",
    outstandingBalance: 40000000,
  },
  {
    id: "loan-002",
    contractNumber: "HD-2024-002",
    customerName: "Trần Thị Bình",
    outstandingBalance: 30000000,
  },
  {
    id: "loan-003",
    contractNumber: "HD-2024-003",
    customerName: "Lê Văn Cường",
    outstandingBalance: 15000000,
  },
  {
    id: "loan-004",
    contractNumber: "HD-2024-004",
    customerName: "Phạm Thị Dung",
    outstandingBalance: 25000000,
  },
  {
    id: "loan-005",
    contractNumber: "HD-2024-005",
    customerName: "Hoàng Văn Em",
    outstandingBalance: 60000000,
  },
];

// TODO: Future integration with contract approval
// When admin approves a contract, the system should:
// 1. Create a new Payment record with flow: "OUT" and paymentType: "DISBURSEMENT"
// 2. Link it to the contract's loan
// 3. Set the amount to the contract's loan amount
// 4. Auto-generate referenceCode like "DISB-YYYYMMDD-XXX"
// Example integration point:
// export async function createDisbursementFromContract(contractId: string) {
//   const contract = await getContract(contractId);
//   return createPayment({
//     loanId: contract.loanId,
//     amount: contract.loanAmount,
//     flow: "OUT",
//     paymentMethod: contract.disbursementMethod,
//     paymentType: "DISBURSEMENT",
//     notes: `Giải ngân hợp đồng ${contract.contractNumber}`,
//   });
// }
