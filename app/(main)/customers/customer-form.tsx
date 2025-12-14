/* eslint-disable react-hooks/incompatible-library */
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { locations } from "@/mock-data/location";
import { Customer } from "@/types/customer";
import { CUSTOMER_STATUS_OPTIONS } from "@/types/enum";
import { Camera, IdCard, Info, UsersRound } from "lucide-react";
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

  // Avatar state
  const [avatar, setAvatar] = useState<string | undefined | undefined>(
    initialCustomer?.avatar
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
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
  const selectedProvince = locations.find((p) => p.id === provinceId);
  const wards = selectedProvince?.wards ?? [];

  // handle submit
  const onSubmit = (data: Customer) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-6xl">
        <Tabs defaultValue="personalInfo" className="min-h-[350px] flex">
          <TabsList>
            <TabsTrigger
              value="personalInfo"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <IdCard />
              Thông tin cá nhân
            </TabsTrigger>

            <TabsTrigger
              value="otherInfo"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <Info />
              Thông tin khác
            </TabsTrigger>

            <TabsTrigger
              value="familyInfo"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <UsersRound />
              Thành phần gia đình
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personalInfo">
            <div className="flex gap-6 items-center">
              {/* --- AVATAR UPLOAD --- */}
              <div
                className="relative w-50 h-50 rounded-full bg-gray-200 cursor-pointer flex items-center justify-center"
                onClick={handleUploadClick}
              >
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    fill
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="text-gray-500">Chọn ảnh</div>
                )}

                {/* Icon camera */}
                <div className="absolute bottom-10 right-5 bg-white p-1 rounded-full shadow">
                  <Camera className="h-4 w-4 text-gray-700" />
                </div>

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
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Họ và tên<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
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
                        <Input
                          type="date"
                          placeholder="dd/mm/yyyy"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Số điện thoại<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cccd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Số CCCD<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số CCCD" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Ngày cấp<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="dd/mm/yyyy"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="issuePlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Nơi cấp<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập nơi cấp" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permanentAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Hộ khẩu thường trú
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập hộ khẩu thường trú"
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
                            <SelectValue placeholder="Tình trạng" />
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

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Email<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Nhập email"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Số nhà<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số nhà" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="provinceId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Tỉnh/Thành phố<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("wardId", "");
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn tỉnh / thành phố" />
                          </SelectTrigger>

                          <SelectContent>
                            {locations.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.label}
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
                  name="wardId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Phường/Xã<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!provinceId}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn phường / xã" />
                          </SelectTrigger>

                          <SelectContent>
                            {wards.map((w) => (
                              <SelectItem key={w.id} value={w.id}>
                                {w.label}
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
          </TabsContent>

          <TabsContent value="otherInfo">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <FormField
                control={form.control}
                name="otherInfo.job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
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
                    <FormLabel>Thu nhập</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập thu nhập" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otherInfo.emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Người liên hệ<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập người liên hệ" {...field} />
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
                      Số điện thoại người liên hệ
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại người liên hệ"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>

          <TabsContent value="familyInfo">
            <div className="grid grid-cols-3 gap-4 flex-1">
              <FormField
                control={form.control}
                name="familyInfo.father.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ tên bố<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên bố" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.father.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại bố<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại bố" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.father.job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nghề nghiệp bố<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp bố" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.mother.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Họ tên mẹ<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên mẹ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.mother.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Số điện thoại mẹ<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại mẹ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.mother.job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nghề nghiệp mẹ<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp mẹ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.spouse.fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên vợ/chồng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên vợ/chồng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.spouse.phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại vợ/chông</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại vợ chồng"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familyInfo.spouse.job"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp vợ/chồng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập nghề nghiệp vợ/chồng"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerForm;
