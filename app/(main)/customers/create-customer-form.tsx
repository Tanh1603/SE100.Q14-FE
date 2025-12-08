import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, IdCard, Info, UsersRound } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

const CreateCustomerForm = () => {
  const form = useForm();

  // Avatar state
  const [avatar, setAvatar] = useState<string | null>(null);
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

  return (
    <Form {...form}>
      <form className="space-y-6 w-6xl">
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

              {/* --- GRID 3 COLUMN INPUTS --- */}
              <div className="grid grid-cols-3 gap-4 flex-1">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Họ tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ tên" {...field} />
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
                      <FormLabel className="text-sm">Ngày sinh</FormLabel>
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
                      <FormLabel className="text-sm">Số điện thoại</FormLabel>
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
                      <FormLabel className="text-sm">Số CCCD</FormLabel>
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
                      <FormLabel className="text-sm">Ngày cấp</FormLabel>
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
                      <FormLabel className="text-sm">Nơi cấp</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập nơi cấp" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Email</FormLabel>
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
                      <FormLabel className="text-sm">Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
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
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập hộ khẩu" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="otherInfo">
            <div className="grid grid-cols-4 gap-4 flex-1">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Nghề nghiệp</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp" {...field} />
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
                    <FormLabel>Nơi làm việc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nơi làm việc" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
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
                name="cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Người liên hệ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập người liên hệ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại người liên hệ</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số điện thoại người liên hệ"
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
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập ghi chú" {...field} />
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên bố</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên bố" {...field} />
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
                    <FormLabel>Số điện thoại bố</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại bố" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp bố</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp bố" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ tên mẹ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập họ tên mẹ" {...field} />
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
                    <FormLabel>Số điện thoại mẹ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại mẹ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp mẹ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập nghề nghiệp mẹ" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fullName"
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
                name="dob"
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
                name="cccd"
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

              <FormField
                control={form.control}
                name="cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thông tin khác</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập thông tin khác" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </Form>
  );
};

export default CreateCustomerForm;
