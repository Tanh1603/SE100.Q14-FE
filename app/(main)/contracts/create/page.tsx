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
import { StoreService } from "@/lib/store.service";
import { Store } from "@/types/store";
import { Customer } from "@/types/customer";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeDollarSign,
  PlusCircle,
  ShoppingBag,
  User,
  Trash2,
  Edit,
  Box,
  Calculator,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AssetCreationSidePanel,
  AssetDraft,
} from "@/components/features/contract/asset-creation-side-panel";
import { LoanService } from "@/lib/loan.service";
import { CustomerService } from "@/lib/customer.service";
import { CollateralService } from "@/lib/collateral.service";
import { DisbursementService } from "@/lib/disbursement.service";
import { LoanTypeService, LoanType } from "@/lib/loan-type.service";
import { ConfigurationService } from "@/lib/configuration.service";
import { generateIdempotencyKey } from "@/lib/payment.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { RepaymentMethod } from "@/types/enum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SearchableSelect } from "@/components/ui/searchable-select";

// --- 1. View Model (Form Schema) ---
const assetSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Tên tài sản là bắt buộc"),
  warehouseId: z.string().min(1, "Vui lòng chọn kho"),
  assetTypeId: z.string().min(1, "Vui lòng chọn loại tài sản"),
  fieldValues: z.record(z.string(), z.string()),
  images: z.array(z.string()).default([]),
  imageFiles: z.array(z.instanceof(File)).default([]),
  valuation: z.string().min(1, "Định giá là bắt buộc"), // Removed optional()
});

const formSchema = z.object({
  customerId: z.string().min(1, "Vui lòng chọn khách hàng"),
  loanDate: z.string(),
  totalLoan: z.number().min(0),
  loanTypeId: z.string().min(1, "Vui lòng chọn gói vay"),
  repaymentMethod: z.nativeEnum(RepaymentMethod),
  storeId: z.string().min(1, "Vui lòng chọn chi nhánh"),
  assets: z.array(assetSchema).min(1, "Cần ít nhất một tài sản"),
  numberPayment: z.number().optional(), // Used for display mainly, derived from loan type
});

type ContractFormValues = z.infer<typeof formSchema>;
type AssetFormValue = z.infer<typeof assetSchema>;

export default function CreateContractPage() {
  const router = useRouter();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isAssetPanelOpen, setIsAssetPanelOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // New State for Data
  const [loanTypes, setLoanTypes] = useState<LoanType[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [configurations, setConfigurations] = useState<Record<string, string>>(
    {},
  );
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(
    null,
  );
  const [editingAssetIndex, setEditingAssetIndex] = useState<number | null>(
    null,
  );

  const form = useForm<ContractFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      customerId: "",
      loanDate: new Date().toISOString().split("T")[0],
      totalLoan: 0,
      loanTypeId: "",
      repaymentMethod: RepaymentMethod.INTEREST_ONLY,
      storeId: "", // Will be set after stores are fetched
      assets: [],
    },
  });

  const { watch, setValue, control, handleSubmit } = form;
  const assets = watch("assets");
  const currentLoanTypeId = watch("loanTypeId");

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      const [types, configs, storesRes] = await Promise.all([
        LoanTypeService.getAll(),
        ConfigurationService.getConfigurations("RATES"),
        StoreService.getStores({ limit: 100 }),
      ]);
      setLoanTypes(types);
      setConfigurations(configs);
      const storesList = storesRes.data || [];
      setStores(storesList);
      // Set default store if available
      if (storesList.length > 0) {
        setValue("storeId", storesList[0].id);
      }
    };
    fetchData();
  }, [setValue]);

  // Update selected loan type object when ID changes
  useEffect(() => {
    if (currentLoanTypeId) {
      const type = loanTypes.find((t) => t.id.toString() === currentLoanTypeId);
      setSelectedLoanType(type || null);
      if (type) {
        setValue("numberPayment", type.durationMonths);
      }
    }
  }, [currentLoanTypeId, loanTypes, setValue]);

  // Calculate Total Custody Fee Rate from Assets
  // Note: In a full implementation, this would use collateral types from API
  // For now, we set it to 0 since the fee info is in collateral types
  const totalCustodyFeeRate = 0;

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer);
    setValue("customerId", customer.id);
  };

  const handleClearCustomer = () => {
    setSelectedCustomer(null);
    setValue("customerId", "");
  };

  const handleAddAsset = (newAsset: AssetDraft) => {
    const asset: AssetFormValue = {
      ...newAsset,
      id: newAsset.id || Math.random().toString(),
      fieldValues: newAsset.fieldValues || {},
      images: newAsset.images,
      imageFiles: newAsset.imageFiles,
      valuation: newAsset.valuation || "0",
    };

    // If editing, replace the asset at the editing index
    if (editingAssetIndex !== null) {
      const newAssets = [...assets];
      newAssets[editingAssetIndex] = asset;
      setValue("assets", newAssets);
      setEditingAssetIndex(null);
    } else {
      setValue("assets", [...assets, asset]);
    }
  };

  const handleEditAsset = (index: number) => {
    setEditingAssetIndex(index);
    setIsAssetPanelOpen(true);
  };

  const handleRemoveAsset = (index: number) => {
    const newAssets = [...assets];
    newAssets.splice(index, 1);
    setValue("assets", newAssets);
  };

  const handleSimulate = async () => {
    const { totalLoan, repaymentMethod, loanTypeId } = form.getValues();
    if (totalLoan <= 0) {
      toast.error("Vui lòng nhập số tiền vay > 0");
      return;
    }
    if (!loanTypeId) {
      toast.error("Vui lòng chọn gói vay");
      return;
    }

    setIsSimulating(true);
    try {
      const result = await LoanService.simulateLoan({
        loanAmount: totalLoan,
        totalFeeRate: totalCustodyFeeRate,
        repaymentMethod: repaymentMethod,
        loanTypeId: Number(loanTypeId),
      });

      setSimulationResult(result);
      toast.success("Tính toán thành công!");
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tính toán khoản vay");
    } finally {
      setIsSimulating(false);
    }
  };

  const onSubmit = async (data: ContractFormValues) => {
    if (!selectedCustomer) {
      toast.error("Vui lòng chọn khách hàng");
      return;
    }

    if (!data.storeId) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }

    console.log("Submitting with storeId:", data.storeId); // Debug log

    setIsSubmitting(true);
    try {
      let customerId = selectedCustomer.id;

      // 1. Create Customer if new
      if (customerId.startsWith("new-")) {
        const newCust = await CustomerService.create(selectedCustomer as any);
        customerId = newCust.id;
      }

      // 2. Create Collaterals
      const collateralIds: string[] = [];
      for (const asset of data.assets) {
        const res = await CollateralService.create(
          {
            collateralTypeId: Number(asset.assetTypeId),
            ownerName: selectedCustomer.fullName,
            collateralInfo: asset.fieldValues,
            status: "PROPOSED",
            storageLocation: asset.warehouseId, // Store ID as storage location
            receivedDate: new Date().toISOString().split("T")[0],
            appraisedValue: Number(asset.valuation), // Added appraisedValue
          },
          asset.imageFiles && asset.imageFiles.length > 0
            ? asset.imageFiles
            : undefined,
        );
        collateralIds.push(res.id);
      }

      // 3. Create Loan
      await LoanService.createLoan({
        customerId: customerId,
        loanAmount: data.totalLoan,
        repaymentMethod: data.repaymentMethod,
        loanTypeId: Number(data.loanTypeId),
        collateralIds: collateralIds,
        storeId: data.storeId, // Required by backend
        notes: "Hợp đồng mới được lập từ màn hình tạo",
      });

      toast.success("Hợp đồng đã được lập và đang chờ duyệt!");
      router.push("/contracts");
    } catch (error: any) {
      console.error(error);
      toast.error(`Lỗi: ${error.message || "Không thể tạo hợp đồng"}`);
    } finally {
      setIsSubmitting(false);
    }
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
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="bg-primary hover:bg-primary/90 min-w-[150px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <PlusCircle className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Đang xử lý..." : "Lập Hợp Đồng"}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 pb-20 max-w-4xl mx-auto"
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
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Row 1: Loan Amount & Store */}
                    <FormField
                      control={control}
                      name="totalLoan"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel className="text-base font-semibold">
                            Số tiền vay (VNĐ)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                className="text-lg font-bold text-green-700 h-10 pl-8"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-700 font-bold">
                                ₫
                              </span>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={control}
                      name="storeId"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Chi nhánh giải ngân</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn chi nhánh" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stores.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                  {s.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Row 2: Loan Product (Type) & Duration (Read-only) */}
                    <FormField
                      control={control}
                      name="loanTypeId"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormLabel>Gói sản phẩm vay</FormLabel>
                          <FormControl>
                            <SearchableSelect
                              options={loanTypes.map((type) => ({
                                value: type.id.toString(),
                                label: type.name,
                                detail: `${type.interestRateMonthly}%/tháng - ${type.durationMonths} tháng`,
                              }))}
                              value={field.value}
                              onValueChange={field.onChange}
                              placeholder="Tìm kiếm gói vay..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-2">
                      <Label className="text-gray-500">Thời hạn vay</Label>
                      <div className="h-10 px-3 py-2 rounded-md border bg-gray-100 text-gray-700 font-medium flex items-center">
                        {selectedLoanType
                          ? `${selectedLoanType.durationMonths} Tháng`
                          : "--"}
                      </div>
                    </div>

                    {/* Row 3: Repayment Method & Disbursement Date */}
                    <FormField
                      control={control}
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
                                Trả lãi định kỳ (Gốc cuối kỳ)
                              </SelectItem>
                              <SelectItem
                                value={RepaymentMethod.EQUAL_INSTALLMENT}
                              >
                                Trả góp đều (Gốc + Lãi)
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                  </div>

                  {/* Interest Rate Summary Box */}
                  <div className="bg-gray-50 p-3 rounded-md text-sm space-y-1 border border-gray-200">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Lãi suất cơ bản (Loan Product):
                      </span>
                      <span className="font-medium">
                        {selectedLoanType?.interestRateMonthly || 0}% / tháng
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Phí lưu kho (Tài sản):
                      </span>
                      <span className="font-medium">
                        {totalCustodyFeeRate}% / tháng
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-300">
                      <span className="font-bold text-gray-800">
                        Tổng lãi & phí áp dụng:
                      </span>
                      <span className="font-bold text-primary">
                        {(
                          Number(selectedLoanType?.interestRateMonthly || 0) +
                          Number(totalCustodyFeeRate)
                        ).toFixed(2)}
                        % / tháng
                      </span>
                    </div>
                    {configurations["LEGAL_INTEREST_CAP"] &&
                      Number(selectedLoanType?.interestRateMonthly || 0) +
                        Number(totalCustodyFeeRate) >
                        Number(configurations["LEGAL_INTEREST_CAP"]) && (
                        <div className="text-xs text-red-500 pt-1">
                          ⚠️ Vượt quá trần lãi suất quy định (
                          {configurations["LEGAL_INTEREST_CAP"]}%)
                        </div>
                      )}
                  </div>

                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full mt-2 border-dashed border-2 bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                    onClick={handleSimulate}
                    disabled={isSimulating}
                  >
                    {isSimulating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Calculator className="w-4 h-4 mr-2" />
                    )}
                    Xem lịch trả nợ (Preview)
                  </Button>

                  {/* SIMULATION RESULTS */}
                  {simulationResult && (
                    <div className="bg-white rounded-lg border p-4 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Kết
                        quả mô phỏng
                      </h4>

                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            Tiền lãi dự tính:
                          </span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(simulationResult.totalInterest || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tổng phí:</span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(simulationResult.totalFees || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between col-span-2 pt-2 border-t mt-1">
                          <span className="text-gray-500 font-bold">
                            Tổng phải trả:
                          </span>
                          <span className="font-bold text-gray-900">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(simulationResult.totalRepayment || 0)}
                          </span>
                        </div>
                      </div>

                      {simulationResult.schedule &&
                        simulationResult.schedule.length > 0 && (
                          <div className="mt-2 pt-2 border-t">
                            <h5 className="text-xs font-semibold uppercase text-gray-500 mb-2">
                              Lịch trả nợ chi tiết
                            </h5>
                            <div className="overflow-x-auto max-h-60 overflow-y-auto border rounded scrollbar-thin">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                  <tr>
                                    <th className="p-2 border-b font-semibold text-gray-600">
                                      Kỳ
                                    </th>
                                    <th className="p-2 border-b font-semibold text-gray-600">
                                      Ngày
                                    </th>
                                    <th className="p-2 border-b font-semibold text-gray-600 text-right">
                                      Gốc
                                    </th>
                                    <th className="p-2 border-b font-semibold text-gray-600 text-right">
                                      Lãi
                                    </th>
                                    <th className="p-2 border-b font-semibold text-gray-600 text-right">
                                      Phí
                                    </th>
                                    <th className="p-2 border-b font-semibold text-gray-600 text-right">
                                      Tổng
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {simulationResult.schedule.map(
                                    (item: any, idx: number) => (
                                      <tr
                                        key={idx}
                                        className="border-b last:border-0 hover:bg-gray-50/50 transition-colors"
                                      >
                                        <td className="p-2 text-center">
                                          {item.periodNumber}
                                        </td>
                                        <td className="p-2">
                                          {item.dueDate
                                            ? new Date(
                                                item.dueDate,
                                              ).toLocaleDateString("vi-VN")
                                            : "-"}
                                        </td>
                                        <td className="p-2 text-right text-gray-600">
                                          {new Intl.NumberFormat(
                                            "vi-VN",
                                          ).format(item.principalAmount)}
                                        </td>
                                        <td className="p-2 text-right text-gray-600">
                                          {new Intl.NumberFormat(
                                            "vi-VN",
                                          ).format(item.interestAmount)}
                                        </td>
                                        <td className="p-2 text-right text-gray-600">
                                          {new Intl.NumberFormat(
                                            "vi-VN",
                                          ).format(item.feeAmount)}
                                        </td>
                                        <td className="p-2 text-right font-bold text-gray-900">
                                          {new Intl.NumberFormat(
                                            "vi-VN",
                                          ).format(item.totalAmount)}
                                        </td>
                                      </tr>
                                    ),
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                    </div>
                  )}

                  <div className="col-span-2 pt-4 border-t mt-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">
                        Tổng giá trị tài sản:
                      </span>
                      <span className="font-semibold text-purple-700">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(
                          assets.reduce(
                            (sum, a) => sum + (Number(a.valuation) || 0),
                            0,
                          ),
                        )}
                      </span>
                    </div>

                    {assets.length > 0 && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          Tỉ lệ vay / Tài sản (LTV):
                        </span>
                        <span
                          className={`font-bold ${
                            (watch("totalLoan") /
                              (assets.reduce(
                                (sum, a) => sum + (Number(a.valuation) || 0),
                                0,
                              ) || 1)) *
                              100 >
                            80
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {(
                            (watch("totalLoan") /
                              (assets.reduce(
                                (sum, a) => sum + (Number(a.valuation) || 0),
                                0,
                              ) || 1)) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                    )}
                    {assets.length > 0 &&
                      (watch("totalLoan") /
                        (assets.reduce(
                          (sum, a) => sum + (Number(a.valuation) || 0),
                          0,
                        ) || 1)) *
                        100 >
                        80 && (
                        <div className="text-xs text-red-500 bg-red-50 p-2 rounded flex items-center gap-2">
                          <Trash2 className="w-3 h-3" />
                          ⚠️ Tỉ lệ vay cao ({">"}80%). Cần quản lý phê duyệt.
                        </div>
                      )}
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
                          <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                            {asset.images && asset.images.length > 0 ? (
                              <img
                                src={asset.images[0]}
                                alt="asset"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Box className="w-5 h-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">
                              {asset.name}
                            </h4>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                                Loại #{asset.assetTypeId}
                              </span>
                              {asset.images && asset.images.length > 1 && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                                  +{asset.images.length - 1} ảnh
                                </span>
                              )}
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
                          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-blue-500"
                              onClick={() => handleEditAsset(idx)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-gray-400 hover:text-red-500"
                              onClick={() => handleRemoveAsset(idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
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
                    <FormMessage className="text-xs text-red-500">
                      {form.formState.errors.assets?.message}
                    </FormMessage>
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
        onOpenChange={(open) => {
          setIsAssetPanelOpen(open);
          if (!open) {
            setEditingAssetIndex(null);
          }
        }}
        onAddAsset={handleAddAsset}
        initialAsset={
          editingAssetIndex !== null ? assets[editingAssetIndex] : null
        }
      />
    </div>
  );
}
