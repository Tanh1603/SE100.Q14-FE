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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAssetType } from "@/mock-data/asset";
import { mockwarehouses } from "@/mock-data/warehouse";
import { AssetTypeFieldEnum } from "@/types/enum";

import { IdCard, ImageUpIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AssetColumn, AssetColumnDef } from "./column";

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-6xl">
        <Tabs defaultValue="personalInfo" className="min-h-[350px] flex">
          <TabsList>
            <TabsTrigger
              value="loanInfo"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <IdCard />
              Thông tin cho vay
            </TabsTrigger>

            <TabsTrigger
              value="asset"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <IdCard />
              Thông tin tài sản thế chấp
            </TabsTrigger>
          </TabsList>

          <TabsContent value="loanInfo">
            <div className="flex gap-6 items-center">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="loanDate"
                  render={({ field }) => (
                    <FormItem>
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
                    <FormItem>
                      <FormLabel>
                        Tổng tiền vay<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tổng tiền vay" {...field} />
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Lãi suất
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập lãi suất" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="numberPayment"
                  render={({ field }) => (
                    <FormItem>
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
          </TabsContent>

          <TabsContent value="asset">
            <div className="flex flex-col gap-6">
              <div className="flex gap-2 items-center">
                <div
                  className="relative w-50 h-50 rounded-xl border-dashed border-spacing-10 border-gray-400 border-[5px] cursor-pointer flex items-center justify-center"
                  onClick={handleUploadClick}
                >
                  {image ? (
                    <Image
                      src={image}
                      alt="image"
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div className="text-gray-500">
                      <ImageUpIcon className="w-20 h-20 text-primary" />
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
                <div className="grid grid-cols-3 gap-4 flex-1">
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
                    name="asset.warehouse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">
                          Kho<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={
                              field.value ? JSON.stringify(field.value) : ""
                            }
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

                  <div className="col-span-3 ">
                    <h2 className="text-primary mb-2">Thuộc tính tài sản</h2>
                    <div className="grid gap-2 grid-cols-3">
                      {selectedAssetType?.field.map((f) => (
                        <FormField
                          key={f.id}
                          control={form.control}
                          name={`asset.assetType.fieldValues.${f.id}`} // dùng field.id làm key riêng
                          rules={{ required: f.required }}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {f.label}
                                {f.required && (
                                  <span className="text-red-500">*</span>
                                )}
                              </FormLabel>
                              <FormControl>
                                <Input
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
                </div>
              </div>

              <DataTable
                columns={AssetColumn(handleDeleteAsset)}
                data={assets}
              />
            </div>
          </TabsContent>
        </Tabs>
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
