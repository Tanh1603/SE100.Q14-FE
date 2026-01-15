"use client";

import { useState, useEffect, useCallback } from "react";
import { DisbursementService } from "@/lib/disbursement.service";
import type { Payment, PaymentListParams, PaymentListResponse } from "@/types/payment";

interface UseDisbursementsState {
  data: Payment[];
  meta: PaymentListResponse["meta"] | null;
  isLoading: boolean;
  error: string | null;
}

export function useDisbursements(initialParams: { page?: number; limit?: number; search?: string } = {}) {
  const [state, setState] = useState<UseDisbursementsState>({
    data: [],
    meta: null,
    isLoading: true,
    error: null,
  });

  const [params, setParams] = useState(initialParams);

  const fetchDisbursements = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await DisbursementService.getAll(
        params.page || 1,
        params.limit || 10,
        params.search || ""
      );

      // Normalize Disbursement to Payment type for unified display
      const normalizedData: Payment[] = response.data.map((item: any) => ({
        id: item.id,
        amount: item.amount,
        flow: "OUT",
        paymentMethod: item.disbursementMethod,
        paymentType: "DISBURSEMENT",
        paidAt: item.disbursedAt,
        referenceCode: item.referenceCode,
        notes: item.notes,
        loan: {
            contractNumber: item.loanCode,
            customerName: item.recipientName
        }
      }));

      // Client-side sort: Newest first
      normalizedData.sort((a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime());

      setState({
        data: normalizedData,
        meta: response.meta,
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
    fetchDisbursements();
  }, [fetchDisbursements]);

  const updateParams = useCallback((newParams: Partial<typeof params>) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  const goToPage = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  return {
    ...state,
    params,
    updateParams,
    refetch: fetchDisbursements,
    goToPage,
  };
}
