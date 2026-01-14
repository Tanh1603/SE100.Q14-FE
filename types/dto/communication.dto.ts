export type NotificationType =
  | "LOAN_APPROVED"
  | "INTEREST_REMINDER"
  | "OVERDUE_REMINDER"
  | "LIQUIDATION_WARNING"
  | "PAYMENT_CONFIRMATION";

export type NotificationChannel = "SMS" | "EMAIL" | "PHONE_CALL" | "IN_PERSON";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "DELIVERED"
  | "FAILED"
  | "ANSWERED"
  | "NO_ANSWER"
  | "PROMISE_TO_PAY";

export interface LogCommunicationDto {
  loanId: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  subject?: string;
  notes?: string;
  callDuration?: number;
  promiseToPayDate?: string; // date string
}

export interface NotificationLogResponse {
  id: string;
  type: NotificationType;
  channel: NotificationChannel;
  status: NotificationStatus;
  loanId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  message: string;
  recipientContact: string;
  callDuration: number;
  employeeId: string;
  notes: string;
  promiseToPayDate: string;
  sentAt: string;
  createdAt: string;
  updatedAt: string;
}
