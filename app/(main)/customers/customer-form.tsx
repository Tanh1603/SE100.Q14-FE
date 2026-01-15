/* eslint-disable react-hooks/incompatible-library */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea"; // Added Import
import { useProvinces, useWardByProvince } from "@/hooks/use-location";
import { Customer } from "@/types/customer";
import { CUSTOMER_STATUS_OPTIONS } from "@/types/enum";
import { Briefcase, ChevronDown, IdCard, UsersRound } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

type CustomerFormProps = {
  initialCustomer?: Customer | null;
};

const CustomerForm = ({ initialCustomer }: CustomerFormProps) => {
  const form = useForm<Customer>({
    defaultValues: initialCustomer || {},
  });

  const { data: provinces = [], isLoading: provinceLoading } = useProvinces();

  // Avatar state
  const [avatar, setAvatar] = useState<string | undefined | undefined>(
    initialCustomer?.avatar
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = (type?: "FRONT" | "BACK") => {
    // TODO: Handle type distinction
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  // handle locations
  const provinceId = form.watch("provinceId");
  const selectedProvince = provinces?.find((p) => p.id === provinceId);
  const provinceCode = selectedProvince?.code ?? "";
  const { data: wards = [], isLoading: wardsLoading } =
    useWardByProvince(provinceCode);

  // handle submit
  const onSubmit = (data: Customer) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 min-w-[700px] h-[80vh] flex flex-col"
      >
        <ScrollArea className="flex-1 min-h-0">
          {/* SECTION 1: PERSONAL INFO & UPLOADS */}
          <Card className="border-none shadow-none p-5">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="flex items-center gap-2 text-xl text-primary">
                <IdCard className="w-6 h-6" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Thông tin định danh và liên hệ cơ bản của khách hàng.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-8">
              {/* 1. PERSONAL INFO INPUTS (3 Columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ và tên<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="NGUYEN VAN A"
                          className="uppercase"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày sinh<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số điện thoại<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cccd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Số CCCD<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="079..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Ngày cấp<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nơi cấp<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Cục CS QLHC..." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="example@email.com"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tình trạng<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select value={field.value}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn tình trạng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {CUSTOMER_STATUS_OPTIONS.map((item, index) => (
                                <SelectItem key={index} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 2. ID CARD UPLOADS (2 Large Boxes Side-by-Side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-center border-t border p-5  bg-gray-50/50 rounded-lg">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-base font-semibold text-gray-700">
                    Mặt trước CCCD
                  </span>
                  <div
                    className="relative w-full max-w-sm aspect-3/2 rounded-xl bg-white border-2 border-dashed border-gray-300 cursor-pointer flex items-center justify-center overflow-hidden hover:border-primary hover:bg-gray-50 transition-all shadow-sm group"
                    onClick={() => handleUploadClick("FRONT")}
                  >
                    {avatar ? (
                      <Image
                        src={avatar}
                        alt="Front ID"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <IdCard className="h-6 w-6 text-gray-400 group-hover:text-primary" />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          Tải ảnh mặt trước
                        </span>
                        <p className="text-xs text-gray-400 mt-1">
                          PNG, JPG, PDF (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <span className="text-base font-semibold text-gray-700">
                    Mặt sau CCCD
                  </span>
                  <div className="relative w-full max-w-sm aspect-3/2 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 cursor-not-allowed flex items-center justify-center overflow-hidden grayscale opacity-70">
                    <div className="text-center p-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-2">
                        <IdCard className="h-6 w-6 text-gray-400" />
                      </div>
                      <span className="text-sm text-gray-500 font-medium">
                        Đang cập nhật
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hidden File Input */}
                <Input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* 3. ADDRESS BLOCK */}
              <div className="space-y-4">
                {/* Full Width Address Line 1 */}
                <div className="grid grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="permanentAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Địa chỉ hiện tại
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ví dụ: 123 Đường Nguyễn Văn Cừ"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {/* City/District/Ward on Line 2 */}
                  <FormField
                    control={form.control}
                    name="provinceId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tỉnh/Thành phố
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn Tỉnh/Thành" />
                            </SelectTrigger>

                            <SelectContent className="h-[200px]">
                              {provinceLoading ? (
                                <SelectItem
                                  className="flex items-center justify-center h-full"
                                  value="loading"
                                  disabled
                                >
                                  <Spinner />
                                </SelectItem>
                              ) : (
                                provinces?.map((item) => (
                                  <SelectItem key={item.id} value={item.id}>
                                    {item.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="wardId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Phường/Xã<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={!provinceId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn Phường/Xã" />
                            </SelectTrigger>

                            <SelectContent className="h-[200px]">
                              {wardsLoading ? (
                                <SelectItem
                                  className="flex items-center justify-center h-full"
                                  value="loading"
                                  disabled
                                >
                                  <Spinner />
                                </SelectItem>
                              ) : (
                                wards?.map((w) => (
                                  <SelectItem key={w.id} value={w.id}>
                                    {w.name}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Current Address (Optional) */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="col-span-1 md:col-span-1">
                      <FormLabel>
                        Địa chỉ thường trú
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập địa chỉ hiện tại..."
                          className="min-h-[80px]" // Make it match height or use single line? User wants to see full text. Textarea is safer. But maybe too big.
                          // Actually, for "Current Address", if it's the "Specific Address" only, it should match the layout of Permanent Address Line 1?
                          // But here it was in a 3-col grid item. If I make it Textarea, it will be taller than Select.
                          // That's fine, flex/grid will handle it.
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: OTHER INFO - Collapsible */}
          <Collapsible className="bg-white rounded-lg border shadow-sm">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-6 text-left [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Nghề nghiệp & Thu nhập
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">
                    Chỉ cần thiết khi khách hàng vay tín chấp hoặc số tiền lớn.
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <FormField
                  control={form.control}
                  name="otherInfo.job"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nghề nghiệp<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập nghề nghiệp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherInfo.workplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Nơi làm việc<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập nơi làm việc" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherInfo.income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thu nhập hàng tháng</FormLabel>
                      <FormControl>
                        <Input placeholder="Ví dụ: 10.000.000" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t pt-4">
                <FormField
                  control={form.control}
                  name="otherInfo.emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Người liên hệ khẩn cấp
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Tên người thân/bạn bè" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherInfo.emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        SĐT người liên hệ
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Số điện thoại" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* SECTION 3: FAMILY INFO - Collapsible */}
          <Collapsible className="bg-white rounded-lg border shadow-sm mt-5">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-5 text-left [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-2">
                <UsersRound className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    Thông tin gia đình
                  </h3>
                  <p className="text-sm text-gray-500 font-normal">
                    Dùng để tham chiếu và xác minh độ tin cậy.
                  </p>
                </div>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-6 pb-6 pt-0">
              {/* Father */}
              <div className="mb-6 pt-2">
                <h5 className="text-sm font-bold mb-3 text-primary uppercase tracking-wide">
                  1. Thông tin Bố
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="familyInfo.father.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Họ tên <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Họ tên bố" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.father.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Số điện thoại <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="SĐT bố" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.father.job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Nghề nghiệp <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nghề nghiệp bố" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Mother */}
              <div className="mb-6 pt-4 border-t border-dashed">
                <h5 className="text-sm font-bold mb-3 text-primary uppercase tracking-wide">
                  2. Thông tin Mẹ
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="familyInfo.mother.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Họ tên <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Họ tên mẹ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.mother.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Số điện thoại <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="SĐT mẹ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.mother.job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">
                          Nghề nghiệp <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Nghề nghiệp mẹ" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Spouse */}
              <div className="pt-4 border-t border-dashed">
                <h5 className="text-sm font-bold mb-3 text-primary uppercase tracking-wide">
                  3. Thông tin Vợ/Chồng (Nếu có)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="familyInfo.spouse.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Họ tên</FormLabel>
                        <FormControl>
                          <Input placeholder="Họ tên vợ/chồng" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.spouse.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Số điện thoại</FormLabel>
                        <FormControl>
                          <Input placeholder="SĐT vợ/chồng" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="familyInfo.spouse.job"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Nghề nghiệp</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nghề nghiệp vợ/chồng"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <ScrollBar orientation="vertical" />
        </ScrollArea>

        <div className="flex justify-end">
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
