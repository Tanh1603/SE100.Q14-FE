"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InlineCustomerForm } from "@/components/features/customer/inline-customer-form";
import { mockAssetType } from "@/mock-data/asset";
import { Customer } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeDollarSign,
  Menu,
  PlusCircle,
  ShoppingBag,
  User,
  Trash2,
  Box,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AssetCreationSidePanel,
  AssetDraft,
} from "@/components/features/contract/asset-creation-side-panel"; // Import the new panel

// --- 1. View Model (Form Schema) ---
// This schema drives the UI and Validation, optimized for User Experience.
const assetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên tài sản là bắt buộc"),
  warehouseId: z.string().min(1, "Vui lòng chọn kho"),
  assetTypeId: z.string().min(1, "Vui lòng chọn loại tài sản"),
  fieldValues: z.record(z.string(), z.string()), // Dynamic fields: { "color": "Red", "imei": "123" }
  image: z.any().optional(),
  valuation: z.string().optional(),
});

const formSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),
  loanDate: z.string(),
  totalLoan: z.number().min(0),
  interestPeriod: z.number().min(1),
  interestRate: z.number().min(0),
  numberPayment: z.number().min(1),
  assets: z.array(assetSchema).min(1, "Cần ít nhất một tài sản"),
});

// Infer strict TypeScript types from Zod schemas
type ContractFormValues = z.infer<typeof formSchema>;
type AssetFormValue = z.infer<typeof assetSchema>;

// --- 2. API Model & Adapter ---
// Hypothetical API Request Shape (snake_case, nested structure, etc.)
type CreateContractApiRequest = {
  customer_id: string;
  loan_details: {
    amount: number;
    rate_monthly: number;
    disbursement_date: string;
    duration_months: number;
  };
  collaterals: Array<{
    name: string;
    type_id: string;
    warehouse_id: string;
    attributes: Array<{ field_id: string; value: string }>;
    estimated_value: number;
  }>;
};

// THE ADAPTER: Wires your Form Data -> API Contract
const mapFormToApi = (
  formData: ContractFormValues
): CreateContractApiRequest => {
  return {
    customer_id: formData.customerId,
    loan_details: {
      amount: formData.totalLoan,
      rate_monthly: formData.interestRate,
      disbursement_date: formData.loanDate,
      // distinct naming conventions example
      duration_months: formData.numberPayment * 1, // assuming monthly
    },
    collaterals: formData.assets.map((asset) => ({
      name: asset.name,
      type_id: asset.assetTypeId,
      warehouse_id: asset.warehouseId,
      // Transforming Record<string, string> -> Array<{key, value}>
      attributes: Object.entries(asset.fieldValues || {}).map(
        ([key, value]) => ({
          field_id: key,
          value: String(value),
        })
      ),
      estimated_value: Number(asset.valuation || 0),
    })),
  };
};

export default function CreateContractPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  // State for side panel
  const [isAssetPanelOpen, setIsAssetPanelOpen] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerId: "", // Initialize to empty string to match schema
      loanDate: new Date().toISOString().split("T")[0],
      totalLoan: 0,
      interestPeriod: 1,
      interestRate: 1.5,
      numberPayment: 12,
      assets: [],
    },
  });

  const { watch, setValue, control } = form;
  const assets = watch("assets");

  // Handle customer selection
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setValue("customerId", customer.id);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setValue("customerId", "");
  };

  const handleAddAsset = (newAsset: AssetDraft) => {
    // Convert AssetDraft to AssetFormValue (they are compatible mostly)
    const asset: AssetFormValue = {
      ...newAsset,
      id: newAsset.id || Math.random().toString(),
      fieldValues: newAsset.fieldValues || {},
    };
    setValue("assets", [...assets, asset]);
  };

  const handleRemoveAsset = (index: number) => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setValue("assets", newAssets);
  };

  const onSubmit = (data: ContractFormValues) => {
    console.log("🔵 Form Data (View Model):", data);

    // 1. Convert to API Model
    const apiPayload = mapFormToApi(data);
    console.log("🟢 API Payload (Contract Model):", apiPayload);

    // 2. Call API (mock)
    // await createContract(apiPayload);

    alert("Hợp đồng đã được tạo thành công! (Check Console for Payload)");
  };

  return (
    <div className="h-[calc(100vh-4rem)] p-4 md:p-6 overflow-hidden flex flex-col">
      <div className="mb-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Tạo Hợp Đồng Mới
          </h1>
          <p className="text-muted-foreground text-sm">
            Nhập thông tin khách hàng, khoản vay và tài sản.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" type="button">
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90"
          >
            Tạo Hợp Đồng
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 pb-20 max-w-3xl mx-auto"
          >
            {/* COLUMN 1: CUSTOMER */}
            <div className="w-full space-y-4">
              <Card className="h-full border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-3 bg-blue-50/20">
                  <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                    <User className="w-5 h-5" />
                    Khách hàng
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  {/* Inline Customer Form with Search & Create */}
                  <InlineCustomerForm
                    selectedCustomer={selectedCustomer}
                    onCustomerSelect={handleCustomerSelect}
                    onClearCustomer={handleClearCustomer}
                  />
                  <FormMessage className="mt-2 text-xs text-red-500">
                    {form.formState.errors.customerId?.message}
                  </FormMessage>
                </CardContent>
              </Card>
            </div>

            {/* COLUMN 2: LOAN TERMS */}
            <div className="w-full space-y-4">
              <Card className="h-full border-l-4 border-l-green-500 shadow-sm">
                <CardHeader className="pb-3 bg-green-50/20">
                  <CardTitle className="flex items-center gap-2 text-lg text-green-700">
                    <BadgeDollarSign className="w-5 h-5" />
                    Thông tin khoản vay
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="totalLoan"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-base font-semibold">
                          Số tiền vay (VNĐ)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              className="text-2xl font-bold text-green-700 h-14 pl-10"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 font-bold text-xl">
                              ₱
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lãi suất (% / tháng)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="interestPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kỳ đóng lãi (tháng)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="loanDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày giải ngân</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="numberPayment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số kỳ vay</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 pt-4 border-t mt-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Tổng lãi dự tính:</span>
                      <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          ((watch("totalLoan") * watch("interestRate")) / 100) *
                            watch("numberPayment")
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* COLUMN 3: ASSETS */}
            <div className="w-full space-y-4">
              <Card className="h-full border-l-4 border-l-purple-500 shadow-sm flex flex-col">
                <CardHeader className="pb-3 bg-purple-50/20">
                  <CardTitle className="flex items-center justify-between text-lg text-purple-700">
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" />
                      Tài sản thế chấp
                    </span>
                    <span className="text-sm bg-purple-200 text-purple-800 px-2 py-0.5 rounded-full">
                      {assets.length}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 flex-1 flex flex-col gap-4">
                  {/* Asset List Display - Improved for scanning */}
                  <div className="flex-1 space-y-3">
                    {assets?.length > 0 ? (
                      assets.map((asset, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 border rounded-xl bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group relative"
                        >
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0">
                            <Box className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {asset.name}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                                {
                                  mockAssetType.find(
                                    (t) => t.id === asset.assetTypeId
                                  )?.name
                                }
                              </span>
                              {asset.valuation && (
                                <span className="text-xs font-medium text-green-600 border border-green-200 px-1.5 py-0.5 rounded bg-green-50">
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(Number(asset.valuation))}
                                </span>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
                            onClick={() => handleRemoveAsset(idx)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 border-2 border-dashed rounded-xl bg-gray-50">
                        <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-3">
                          <ShoppingBag className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-500 font-medium">
                          Chưa có tài sản nào
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 px-4">
                          Nhấn nút bên dưới để thêm tài sản thế chấp cho hợp
                          đồng này.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Add Button */}
                  <Button
                    type="button"
                    onClick={() => setIsAssetPanelOpen(true)}
                    className="w-full h-12 dashed border-2 border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-100 hover:border-purple-300 font-semibold"
                    variant="outline"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Thêm Tài Sản Mới
                  </Button>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>

      {/* Asset Side Panel */}
      <AssetCreationSidePanel
        open={isAssetPanelOpen}
        onOpenChange={setIsAssetPanelOpen}
        onAddAsset={handleAddAsset}
      />
    </div>
  );
}
