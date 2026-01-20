"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  Payment,
  PaymentListParams,
  PaymentListResponse,
  CreatePaymentRequest,
  LoanSummary,
} from "@/types/payment";
import {
  getPayments,
  createPayment,
  getLoans,
  generateIdempotencyKey,
} from "@/lib/payment.service";

// ============== Types ==============
interface UsePaymentsState {
  data: Payment[];
  meta: PaymentListResponse["meta"] | null;
  stats?: PaymentListResponse["stats"];
  isLoading: boolean;
  error: string | null;
}

interface UseLoansState {
  data: LoanSummary[];
  isLoading: boolean;
  error: string | null;
}

interface UseCreatePaymentState {
  isLoading: boolean;
  error: string | null;
  result: Payment | null;
}

// ============== usePayments Hook ==============
export function usePayments(initialParams: PaymentListParams = {}) {
  const [state, setState] = useState<UsePaymentsState>({
    data: [],
    meta: null,
    isLoading: true,
    error: null,
  });

  const [params, setParams] = useState<PaymentListParams>({
      sortBy: "paidAt",
      sortOrder: "desc",
      ...initialParams
  });

  const fetchPayments = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await getPayments(params);
      setState({
        data: response.data,
        meta: response.meta,
        stats: response.stats,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Đã có lỗi xảy ra",
      }));
    }
  }, [params]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const updateParams = useCallback((newParams: Partial<PaymentListParams>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    ...state,
    params,
    updateParams,
    resetParams,
    refetch: fetchPayments,
    goToPage,
  };
}

// ============== useLoans Hook ==============
export function useLoans() {
  const [state, setState] = useState<UseLoansState>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchLoans = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const loans = await getLoans();
      setState({
        data: loans,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Đã có lỗi xảy ra",
      }));
    }
  }, []);

  useEffect(() => {
    fetchLoans();
  }, [fetchLoans]);

  return {
    ...state,
    refetch: fetchLoans,
  };
}

// ============== useCreatePayment Hook ==============
export function useCreatePayment() {
  const [state, setState] = useState<UseCreatePaymentState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const execute = useCallback(
    async (data: CreatePaymentRequest): Promise<Payment | null> => {
      setState({ isLoading: true, error: null, result: null });

      try {
        // Generate unique idempotency key for this submission
        const idempotencyKey = generateIdempotencyKey();
        const payment = await createPayment(data, idempotencyKey);

        setState({
          isLoading: false,
          error: null,
          result: payment,
        });

        return payment;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Đã có lỗi xảy ra";
        setState({
          isLoading: false,
          error: errorMessage,
          result: null,
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
