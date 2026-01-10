"use client";

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
import { mockBranches } from "@/mock-data/branches";
import { Gender, GENDER_OPTIONS } from "@/types/enum";
import { Role, ROLE, ROLE_OPTIONS } from "@/types/constant";
import { IdCard, Info } from "lucide-react";
import { useForm } from "react-hook-form";

type StaffFormProps = {
  initialStaff?: StaffFormState | undefined | null;
};

type StaffFormState = {
  id: string;
  email: string;
  password: string;
  role: Role;
  branchId: string;

  fullName: string;
  gender: Gender;
  dob: string;
  cccd: string;
  phone: string;
  startDate: string;
  endDate?: string;
};

const EMPTY_STAFF: StaffFormState = {
  id: "",
  email: "nam@gm.com",
  password: "",
  role: ROLE.STAFF,
  branchId: "",

  fullName: "",
  gender: Gender.MALE,
  dob: "",
  cccd: "",
  phone: "",
  startDate: "",
  endDate: "",
};

const StaffForm = ({ initialStaff }: StaffFormProps) => {
  const form = useForm<StaffFormState>({
    defaultValues: initialStaff || EMPTY_STAFF,
  });

  // handle locations

  // handle submit
  const onSubmit = (data: StaffFormState) => {
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <div className="space-y-8">
          {/* SECTION: PERSONAL INFO */}
          <div className="bg-white p-6 rounded-lg border shadow-sm space-y-6">
            <div className="flex items-center gap-2 border-b pb-2">
              <Info className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-lg text-gray-800">
                Thông tin cá nhân
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Input type="date" placeholder="dd/mm/yyyy" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Giới tính<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Giới tính" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {GENDER_OPTIONS.map((item, index) => (
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
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Ngày vào làm<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Nhập ngày vào làm"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {initialStaff && initialStaff.endDate && (
                <FormField
                  control={form.control}
                  name="endDate"
                  disabled={true}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Ngày vào làm<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Nhập ngày vào làm"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          {/* SECTION: LOGIN ACCOUNT */}
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <IdCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-lg text-gray-800">
                Tài khoản đăng nhập
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Mật khẩu<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cửa hàng làm việc<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Cửa hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {mockBranches.map((item, index) => (
                              <SelectItem key={index} value={item.id}>
                                {item.name}
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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phân quyền<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Quyền" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {ROLE_OPTIONS.map((item, index) => (
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
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
};

export default StaffForm;
