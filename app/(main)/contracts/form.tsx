"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useRef, useState } from "react";
import {
  IdCard,
  ImageUpIcon,
  Calculator,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { mockAssetType } from "@/mock-data/asset";
import { mockwarehouses } from "@/mock-data/warehouse";
import { AssetTypeFieldEnum, RepaymentMethod } from "@/types/enum";
import { AssetColumn, AssetColumnDef } from "./column";
import { InlineCustomerForm } from "@/components/features/customer/inline-customer-form";
import { Customer } from "@/types/customer";
import { LoanService } from "@/lib/loan.service";
import { CollateralService } from "@/lib/collateral.service";
import { CustomerService } from "@/lib/customer.service";
import { DisbursementService } from "@/lib/disbursement.service";
import { generateIdempotencyKey } from "@/lib/payment.service";

// ...

const ContractForm = ({ initial }: ContractFormProps) => {
  // ... (keep previous state)

  const onSubmit = async (data: any) => {
    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }
    if (assets.length === 0) {
      toast.error("Vui lòng thêm ít nhất một tài sản");
      return;
    }

    setIsSubmitting(true);
    try {
      let customerId = selectedCustomer.id;

      // 1. Create Customer if it's new
      if (customerId.startsWith("new-")) {
        const newCust = await CustomerService.create(selectedCustomer as any);
        customerId = newCust.id;
      }

      // 2. Create Collateral Assets
      const collateralIds: string[] = [];
      for (const asset of assets) {
        const res = await CollateralService.create(
          {
            collateralTypeId: Number(asset.assetType.id),
            ownerName: selectedCustomer.fullName,
            collateralInfo: asset.assetType.fieldValues || {},
            status: "PROPOSED",
          },
          asset.files
        );
        collateralIds.push(res.id);
      }

      // 3. Create Loan (PENDING)
      const createRes = await LoanService.createLoan({
        customerId: customerId,
        loanAmount: Number(data.totalLoan),
        repaymentMethod: data.repaymentMethod,
        loanTypeId: Number(data.loanTypeId),
        collateralIds: collateralIds,
        notes: data.notes,
      });

      const loanId = createRes.loan.id;

      // 4. Auto-Approve
      await LoanService.approveLoan(loanId, "Auto-approved during creation");

      // 5. Disburse rightaway
      await DisbursementService.create(
        {
          loanId: loanId,
          storeId: data.storeId,
          amount: Number(data.totalLoan),
          disbursementMethod: "CASH",
          recipientName: selectedCustomer.fullName,
        },
        generateIdempotencyKey()
      );

      toast.success("Hợp đồng đã được lập, duyệt và giải ngân thành công!");
      router.push("/contracts");
    } catch (error: any) {
      console.error("Workflow failed:", error);
      toast.error(`Lỗi: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        {/* CUSTOMER SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <IdCard className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg text-gray-800">
              Thông tin khách hàng
            </h3>
          </div>
          <InlineCustomerForm
            selectedCustomer={selectedCustomer}
            onCustomerSelect={setSelectedCustomer}
            onClearCustomer={() => setSelectedCustomer(null)}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LOAN INFO */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Calculator className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Thông tin khoản vay
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="totalLoan"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Số tiền vay (VNĐ)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="repaymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hình thức trả lãi</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn hình thức" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={RepaymentMethod.INTEREST_ONLY}>
                            Trả lãi trước
                          </SelectItem>
                          <SelectItem value={RepaymentMethod.EQUAL_INSTALLMENT}>
                            Trả góp đều
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="loanDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày vay</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleSimulate}
                disabled={isSimulating}
              >
                {isSimulating ? "Đang tính toán..." : "Tính toán lịch trả nợ"}
              </Button>

              {simulationResult && (
                <Alert className="bg-blue-50 border-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Kết quả tính toán</AlertTitle>
                  <AlertDescription>
                    Tổng lãi dự kiến:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      simulationResult.totalInterest
                    )}{" "}
                    VNĐ. Mỗi kỳ đóng:{" "}
                    {new Intl.NumberFormat("vi-VN").format(
                      simulationResult.monthlyPayment
                    )}{" "}
                    VNĐ.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* ASSETS SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <IdCard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Tài sản thế chấp
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <div className="flex gap-4 items-start">
                <div
                  className="relative w-24 h-24 rounded-lg border-dashed border-2 border-gray-300 hover:border-primary cursor-pointer flex items-center justify-center bg-gray-50 shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {currentAssetImage ? (
                    <Image
                      src={currentAssetImage}
                      alt="asset"
                      fill
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    <ImageUpIcon className="w-6 h-6 text-gray-400" />
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCurrentAssetFiles([file]);
                        const reader = new FileReader();
                        reader.onloadend = () =>
                          setCurrentAssetImage(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="currentAsset.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Tên tài sản (VD: Honda Vision)"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <FormField
                      control={form.control}
                      name="currentAsset.assetType.id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              const selected = mockAssetType.find(
                                (t) => t.id === val
                              );
                              if (selected) {
                                SetSelectedAssetType(selected);
                                form.setValue(
                                  "currentAsset.assetType.name",
                                  selected.name
                                );
                                form.setValue(
                                  "currentAsset.assetType.field",
                                  selected.field
                                );
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Loại tài sản" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockAssetType.map((t) => (
                                <SelectItem key={t.id} value={t.id}>
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="currentAsset.warehouse.id"
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              const selected = mockwarehouses.find(
                                (w) => w.id === val
                              );
                              if (selected) {
                                form.setValue(
                                  "currentAsset.warehouse.name",
                                  selected.name
                                );
                              }
                            }}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn kho" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockwarehouses.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {selectedAssetType?.field?.map((f: any) => (
                <FormField
                  key={f.id}
                  control={form.control}
                  name={`currentAsset.assetType.fieldValues.${f.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">{f.label}</FormLabel>
                      <FormControl>
                        <Input
                          className="h-8"
                          type={
                            f.type === AssetTypeFieldEnum.NUMBER
                              ? "number"
                              : "text"
                          }
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={handleAddAsset}
              >
                Thêm vào danh sách
              </Button>

              <div className="pt-4 border-t">
                <DataTable
                  columns={AssetColumn(handleDeleteAsset)}
                  data={assets}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            className="min-w-[150px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Lập hợp đồng & Giải ngân"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContractForm;
