"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Edit, FileSignature, PlusCircle, Search, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { LoanColumn } from "./column";
import { mockPawnContracts } from "@/mock-data/contracts";
import Link from "next/link";

import { ContractCommandPanel } from "@/components/features/loan/contract-command-panel";
import { loan } from "@/types/asset";

const ContractPage = () => {
  const [selectedContract, setSelectedContract] = useState<
    (loan & { contractNumber?: string; endDate?: string }) | null
  >(null);
  const [openCommandPanel, setOpenCommandPanel] = useState(false);

  // Listen for events from Columns (for backward compatibility with quick actions)
  useEffect(() => {
    const handleQuickPay = (e: CustomEvent) => {
      if (e.detail?.loanId) {
        // Find the contract and open command panel
        const contract = mockPawnContracts.find(
          (c) =>
            (c as { contractNumber?: string }).contractNumber ===
            e.detail.loanId
        );
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setOpenCommandPanel(true);
        }
      }
    };

    const handleRefinance = (e: CustomEvent) => {
      if (e.detail?.id) {
        const contract = mockPawnContracts.find(
          (c) =>
            (c as { contractNumber?: string }).contractNumber === e.detail.id
        );
        if (contract) {
          setSelectedContract(contract as loan & { contractNumber?: string });
          setOpenCommandPanel(true);
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

  // Handle row click to open command panel
  const handleRowClick = (contract: loan) => {
    setSelectedContract(
      contract as loan & { contractNumber?: string; endDate?: string }
    );
    setOpenCommandPanel(true);
  };

  return (
    <div className="pb-10">
      <div className="mx-5">
        <div className="flex my-5 items-center">
          <FileSignature className="text-primary mr-5" />
          <p className="text-2xl text-primary font-bold">Danh sách hợp đồng</p>
        </div>

        {/* Filter - Responsive */}
        <div className="flex flex-col md:flex-row justify-between md:items-center pt-2 px-5 pb-5 bg-white rounded-xl shadow-sm border gap-4">
          <div className="flex flex-col md:flex-row gap-4 md:gap-x-10 w-full md:w-auto">
            <div className="flex flex-col gap-y-2 w-full md:min-w-[300px]">
              <Label>Tìm kiếm</Label>
              <Input placeholder="Nhập họ tên khách, sdt" />
            </div>
          </div>

          <Button className="w-full md:w-auto">
            <Search className="mr-2 h-4 w-4" />
            Tìm kiếm
          </Button>
        </div>

        {/* Table - Responsive Container */}
        <div className="mt-5 pt-5 px-5 pb-5 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="flex flex-wrap gap-3 mb-5">
            <Link href="/contracts/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm mới
              </Button>
            </Link>

            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </Button>

            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </Button>
          </div>

          <div className="overflow-x-auto">
            <DataTable
              columns={LoanColumn}
              data={mockPawnContracts}
              onRowClick={handleRowClick}
            />
          </div>
        </div>
      </div>

      {/* Unified Contract Command Panel */}
      <ContractCommandPanel
        open={openCommandPanel}
        onOpenChange={setOpenCommandPanel}
        contract={selectedContract}
        onPaymentSuccess={() => {
          // Refresh data or show success notification
        }}
        onRefinanceSuccess={() => {
          setOpenCommandPanel(false);
        }}
      />
    </div>
  );
};

export default ContractPage;
