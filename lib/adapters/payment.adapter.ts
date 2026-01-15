import {
  PaymentDTO,
  PagedResponseDTO,
  PaymentAllocationDTO,
} from "@/types/dto/payment.dto";
import {
  Payment,
  PaymentListResponse,
  CreatePaymentRequest,
} from "@/types/payment";
import { BaseAdapter } from "./base.adapter";

export const PaymentAdapter: BaseAdapter<Payment, PaymentDTO> = {
  toDomain(dto: PaymentDTO): Payment {
    return {
      id: dto.id,
      loanId: dto.loanId,
      amount: dto.amount,
      flow: dto.flow || "IN", // Default to IN for Payments endpoint
      paymentMethod: dto.paymentMethod,
      paymentType: dto.paymentType,
      referenceCode: dto.referenceCode,
      notes: dto.notes,
      paidAt: dto.paidAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      // Map nested array safely
      allocations: dto.allocations?.map((a: PaymentAllocationDTO) => ({
        periodNumber: a.periodNumber,
        component: a.component,
        amount: a.amount,
        description: a.description,
      })),
      // Map nested object safely OR construct from root fields
      loan: dto.loan
        ? {
            id: dto.loan.id,
            contractNumber: dto.loan.contractNumber,
            customerName: dto.loan.customerName,
            outstandingBalance: dto.loan.outstandingBalance,
          }
        : {
            id: dto.loanId,
            contractNumber: undefined, // Will be enriched by service
            customerName: dto.customerName, // Mapped from root
            outstandingBalance: 0
        },
    };
  },

  // Optional: If we needed to send a full Payment object back
  toDTO(domain: Partial<Payment>): Partial<PaymentDTO> {
    return {
      id: domain.id,
      loanId: domain.loanId,
      amount: domain.amount,
      notes: domain.notes,
      // ... map others as needed
    };
  },
};

/**
 * Specialized Adapter for Paginated Responses
 * Handles the "envelope" transformation
 */
export const PaymentResponseAdapter = {
  toDomain(dto: PagedResponseDTO<PaymentDTO>): PaymentListResponse {
    return {
      data: dto.data.map(PaymentAdapter.toDomain),
      meta: {
        totalItems: dto.meta.totalItems,
        totalPages: dto.meta.totalPages,
        currentPage: dto.meta.currentPage,
        limit: dto.meta.limit,
      },
      stats: dto.stats
        ? {
            totalMoney: dto.stats.totalMoney,
            totalIncome: dto.stats.totalIncome,
            totalExpense: dto.stats.totalExpense,
          }
        : undefined,
    };
  },
};

/**
 * Adapter for Outgoing Requests (Create Payment)
 * UI Request -> Backend Payload
 */
export const CreatePaymentAdapter = {
  toPayload(request: CreatePaymentRequest): any {
    return {
      loanId: request.loanId,
      amount: request.amount,
      paymentMethod: request.paymentMethod,
      paymentType: request.paymentType,
      notes: request.notes,
      // transactionDate is not in OpenAPI PaymentRequestDto, but keeping it if needed or removing if strictly adhering to spec.
      // OpenAPI doesn't list it, so it might be ignored by backend.
      // Checked openapi: PaymentRequestDto has loanId, amount, paymentMethod, paymentType, notes.
      // So I will only include these.
    };
  },
};
