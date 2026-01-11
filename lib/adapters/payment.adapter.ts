import {
  PaymentDTO,
  PaymentAllocationDTO,
  PagedResponseDTO,
} from "@/types/dto/payment.dto";
import {
  Payment,
  PaymentAllocation,
  PaymentListResponse,
  CreatePaymentRequest,
} from "@/types/payment";
import { BaseAdapter } from "./base.adapter";

export const PaymentAdapter: BaseAdapter<Payment, PaymentDTO> = {
  toDomain(dto: PaymentDTO): Payment {
    return {
      id: dto.id,
      loanId: dto.loan_id,
      amount: dto.amount,
      flow: dto.flow,
      paymentMethod: dto.payment_method,
      paymentType: dto.payment_type,
      referenceCode: dto.reference_code,
      notes: dto.notes,
      paidAt: dto.paid_at,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      // Map nested array safely
      allocations: dto.allocations?.map((a: PaymentAllocationDTO) => ({
        periodNumber: a.period_number,
        component: a.component,
        amount: a.amount,
        description: a.description,
      })),
      // Map nested object safely
      loan: dto.loan
        ? {
            id: dto.loan.id,
            contractNumber: dto.loan.contract_number,
            customerName: dto.loan.customer_name,
            outstandingBalance: dto.loan.outstanding_balance,
          }
        : undefined,
    };
  },

  // Optional: If we needed to send a full Payment object back
  toDTO(domain: Partial<Payment>): Partial<PaymentDTO> {
    return {
      id: domain.id,
      loan_id: domain.loanId,
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
        totalItems: dto.meta.total_items,
        totalPages: dto.meta.total_pages,
        currentPage: dto.meta.current_page,
        limit: dto.meta.limit,
      },
      stats: dto.stats
        ? {
            totalMoney: dto.stats.total_money,
            totalIncome: dto.stats.total_income,
            totalExpense: dto.stats.total_expense,
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
      loan_id: request.loanId,
      amount: request.amount,
      payment_method: request.paymentMethod,
      payment_type: request.paymentType,
      reference_code: request.referenceCode,
      notes: request.notes,
      transaction_date: request.transactionDate,
    };
  },
};
