import { z } from "zod";

// Payment Method Enum
export const PaymentMethodSchema = z.enum(["CASH", "BANK_TRANSFER"]);
export type PaymentMethodSchemaType = z.infer<typeof PaymentMethodSchema>;

// Payment Type Enum
export const PaymentTypeSchema = z.enum([
  "PERIODIC",
  "EARLY",
  "PAYOFF",
  "LATE_FEE",
]);
export type PaymentTypeSchemaType = z.infer<typeof PaymentTypeSchema>;

// Create Payment Schema (Zod v4 compatible)
export const CreatePaymentSchema = z.object({
  loanId: z.string().min(1, "Vui lòng chọn hợp đồng"),

  amount: z
    .number()
    .positive("Số tiền phải lớn hơn 0")
    .min(1000, "Số tiền tối thiểu là 1,000 VND"),

  paymentMethod: PaymentMethodSchema,

  paymentType: PaymentTypeSchema,

  referenceCode: z
    .string()
    .max(100, "Mã tham chiếu không được vượt quá 100 ký tự")
    .optional(),

  notes: z
    .string()
    .max(500, "Ghi chú không được vượt quá 500 ký tự")
    .optional(),
});

// Type inference from schema
export type CreatePaymentFormData = z.infer<typeof CreatePaymentSchema>;

// Payment Filter Schema (for search form)
export const PaymentFilterSchema = z.object({
  search: z.string().optional(),
  loanId: z.string().optional(),
  paymentMethod: PaymentMethodSchema.optional(),
  paymentType: PaymentTypeSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

export type PaymentFilterFormData = z.infer<typeof PaymentFilterSchema>;
