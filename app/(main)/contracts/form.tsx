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

import { mockAssetType } from "@/mock-data/asset";
import { mockwarehouses } from "@/mock-data/warehouse";
import { AssetTypeFieldEnum } from "@/types/enum";

import { IdCard, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AssetColumn, AssetColumnDef } from "./column";
import { Label } from "@/components/ui/label";

type ContractFormProps = {
  initial?: FormState | undefined | null;
};

type FormState = {
  id: string;
  loanDate: string;
  totalLoan: number;
  interestPeriod: string;
  interestRate: string;
  numberPayment: number;

  asset: {
    id: string;
    name: string;
    image: string;
    warehouse: {
      id: string;
      name: string;
    };
    assetType: {
      id: string;
      name: string;
      custodyFee?: number;
      field: {
        id: string;
        label: string; // nhãn ví dụ vàng
        required: boolean; // cần hay không
        type: AssetTypeFieldEnum; // string, date, number
      }[];
      fieldValues?: Record<string, string>; // key = field.id, value = input
    };
  };
  customer: {
    id: string;
  };
};

const ContractForm = ({ initial }: ContractFormProps) => {
  const form = useForm<FormState>({
    defaultValues: initial || undefined,
  });

  const onSubmit = (data: FormState) => {
    console.log(data);
  };

  const [assets, setAssets] = useState<AssetColumnDef[]>([]);

  const hanleCreateAsset = (asset: AssetColumnDef) => {
    setAssets((prev) => [...prev, asset]);
  };

  const handleDeleteAsset = (asset: AssetColumnDef) => {
    setAssets((prev) => prev.filter((a) => a.id !== asset.id));
  };

  const [selectedAssetType, SetSelectedAssetType] = useState<{
    id: string;
    name: string;
    field: {
      id: string;
      label: string; // nhãn ví dụ vàng
      required: boolean; // cần hay không
      type: AssetTypeFieldEnum; // string, date, number
    }[];
    fieldValues?: Record<string, string>; // key = field.id, value = input
  } | null>(null);

  const [image, setImage] = useState<string | undefined | undefined>(
    initial?.asset.image
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: LOAN INFO */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <IdCard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Thông tin khoản vay
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="loanDate"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Ngày vay<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Nhập ngày vay"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalLoan"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Tổng tiền vay<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-10 font-semibold"
                            placeholder="Nhập tổng tiền vay"
                            {...field}
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            ₫
                          </span>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Kì hạn lãi (tháng)
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập kì đóng lãi"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interestRate"
                  render={({ field }) => {
                    const rate = parseFloat(field.value || "0");
                    const isHighRate = rate > 1.7; // > 20% / year approx 1.66% / month

                    return (
                      <FormItem>
                        <FormLabel>
                          Lãi suất (%/tháng)
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập lãi suất"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </FormControl>
                        {isHighRate && (
                          <div className="mt-2 text-xs p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                            ⚠️ Lãi suất cao hơn quy định (20%/năm ~ 1.6%/tháng).
                          </div>
                        )}
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  control={form.control}
                  name="numberPayment"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>
                        Số lần trả
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số lần trả"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: ASSET INFO */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b">
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <IdCard className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg text-gray-800">
                Tài sản thế chấp
              </h3>
            </div>

            <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col gap-6">
              <div className="flex gap-4 items-start">
                <div
                  className="relative w-32 h-32 rounded-xl border-dashed border-2 border-gray-300 hover:border-primary cursor-pointer flex items-center justify-center bg-gray-50 shrink-0 transition-colors"
                  onClick={handleUploadClick}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt="image"
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-gray-500">
                      <ImageUpIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-xs">Tải ảnh</span>
                    </div>
                  )}

                  {/* Hidden input */}
                  <Input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <FormField
                    control={form.control}
                    name="asset.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tên tài sản<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên tài sản" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="asset.assetType.id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Loại tài sản<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = mockAssetType.find(
                                (a) => a.id === value
                              );
                              if (selected) {
                                form.setValue("asset.assetType", {
                                  id: selected.id,
                                  name: selected.name,
                                  field: selected.field.map((a) => ({
                                    id: a.id,
                                    label: a.label,
                                    required: a.required,
                                    type: a.type,
                                  })),
                                  fieldValues: undefined,
                                });
                                SetSelectedAssetType({
                                  id: selected.id,
                                  name: selected.name,
                                  field: selected.field.map((a) => ({
                                    id: a.id,
                                    label: a.label,
                                    required: a.required,
                                    type: a.type,
                                  })),
                                  fieldValues: undefined,
                                });
                              }
                            }}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn loại tài sản" />
                            </SelectTrigger>

                            <SelectContent>
                              {mockAssetType.map((w) => (
                                <SelectItem key={w.id} value={w.id}>
                                  {w.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col item-center">
                  <Label className="mb-2">Phí giữ (VNĐ)</Label>
                  <div className="h-10 px-3 py-2 rounded-md border bg-gray-50 text-gray-900 text-sm flex items-center font-medium">
                    10,000
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="asset.warehouse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Kho<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value ? JSON.stringify(field.value) : ""}
                          onValueChange={(val) =>
                            field.onChange(val ? JSON.parse(val) : null)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn kho" />
                          </SelectTrigger>

                          <SelectContent>
                            {mockwarehouses.map((w) => (
                              <SelectItem
                                key={w.id}
                                value={JSON.stringify({
                                  id: w.id,
                                  name: w.name,
                                })}
                              >
                                {w.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {selectedAssetType && selectedAssetType.field.length > 0 && (
                <div className="col-span-1 pt-4 border-t">
                  <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    Thuộc tính chi tiết
                  </h2>
                  <div className="grid gap-4 grid-cols-2">
                    {selectedAssetType.field.map((f) => (
                      <FormField
                        key={f.id}
                        control={form.control}
                        name={`asset.assetType.fieldValues.${f.id}`}
                        rules={{ required: f.required }}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">
                              {f.label}
                              {f.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </FormLabel>
                            <FormControl>
                              <Input
                                className="h-9"
                                type={
                                  f.type === AssetTypeFieldEnum.NUMBER
                                    ? "number"
                                    : f.type === AssetTypeFieldEnum.DATE
                                    ? "date"
                                    : "text"
                                }
                                placeholder={`Nhập ${f.label}`}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t">
                <DataTable
                  columns={AssetColumn(handleDeleteAsset)}
                  data={assets}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              hanleCreateAsset(form.watch("asset"));
              SetSelectedAssetType(null);
              form.reset({
                ...form.getValues(), // giữ các giá trị khác (loanDate, totalLoan...)
                asset: {
                  id: "",
                  name: "",
                  image: "",
                  warehouse: { id: "", name: "" },
                  assetType: { id: "", name: "", field: [], fieldValues: {} },
                },
              });
            }}
          >
            Thêm tài sản
          </Button>
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
};

export default ContractForm;
