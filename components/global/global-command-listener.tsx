"use client";

import { useEffect, useState } from "react";
import { ContractCommandPanel } from "@/components/features/loan/contract-command-panel";
import { mockPawnContracts } from "@/mock-data/contracts";
import { loan } from "@/types/asset";

type MockContract = loan & { contractNumber?: string; endDate?: string };

export function GlobalCommandListener() {
  const [open, setOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<MockContract | null>(
    null
  );

  useEffect(() => {
    // Handler for 'quick-pay' event (Collect Interest)
    const handleQuickPay = (e: CustomEvent) => {
      if (e.detail?.loanId) {
        // Find the contract in mock data
        const contract = mockPawnContracts.find(
          (c) =>
            (c as MockContract).contractNumber === e.detail.loanId ||
            c.id === e.detail.loanId
        );

        if (contract) {
          setSelectedContract(contract as MockContract);
          setOpen(true);
        } else {
          console.warn("Contract not found for Quick Pay:", e.detail.loanId);
        }
      }
    };

    // Handler for 'refinance-loan' event
    const handleRefinance = (e: CustomEvent) => {
      if (e.detail?.id) {
        const contract = mockPawnContracts.find(
          (c) =>
            (c as MockContract).contractNumber === e.detail.id ||
            c.id === e.detail.id
        );
        if (contract) {
          setSelectedContract(contract as MockContract);
          setOpen(true);
        }
      }
    };

    window.addEventListener("quick-pay", handleQuickPay as EventListener);
    window.addEventListener("refinance-loan", handleRefinance as EventListener);

    return () => {
      window.removeEventListener("quick-pay", handleQuickPay as EventListener);
      window.removeEventListener(
        "refinance-loan",
        handleRefinance as EventListener
      );
    };
  }, []);

  return (
    <ContractCommandPanel
      open={open}
      onOpenChange={setOpen}
      contract={selectedContract}
      onPaymentSuccess={() => {
        // In real app, trigger SWR/React Query invalidation here
        console.log("Global: Payment executed");
      }}
    />
  );
}
