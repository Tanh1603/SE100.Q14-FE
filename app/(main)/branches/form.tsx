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
import { BRANCH_STATUS_OPTIONS, BranchStatus } from "@/types/enum";

import { IdCard } from "lucide-react";
import { useForm } from "react-hook-form";

type BranchFormProps = {
  initial?: FormState | undefined | null;
};

type FormState = {
  id: string;
  name: string;
  phone: string;
  address: string;
  provinceId: string;
  wardId: string;
  status: BranchStatus;
};

const BranchForm = ({ initial }: BranchFormProps) => {
  const form = useForm<FormState>({
    defaultValues: initial || undefined,
  });

  const onSubmit = (data: FormState) => {
    console.log(data);
  };

  const provinceId = form.watch("provinceId");
  const selectedProvince = locations.find((p) => p.id === provinceId);
  const wards = selectedProvince?.wards ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-6xl">
        <Tabs defaultValue="personalInfo" className="min-h-[350px] flex">
          <TabsList>
            <TabsTrigger
              value="info"
              className="cursor-pointer data-[state=active]:text-primary"
            >
              <IdCard />
              Thông tin chi nhánh
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="flex gap-6 items-center">
              <div className="grid grid-cols-3 gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Tên chi nhánh<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tên chi nhánh" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Địa chỉ<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ chi nhánh" {...field} />
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
                              {BRANCH_STATUS_OPTIONS.map((item, index) => (
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
          </TabsContent>
        </Tabs>
        <div className="flex justify-end">
          <Button type="submit">Xác nhận</Button>
        </div>
      </form>
    </Form>
  );
};

export default BranchForm;
