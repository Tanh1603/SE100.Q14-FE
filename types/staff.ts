import z from "zod";
import { Role } from "./constant";
// import { Gender } from "./enum";

export type Staff = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: Role;
  storeId: string;
  storeName: string;
  hireDate: string;
  terminatedDate?: string | null;
  status: string;

  // gender: Gender;
  // dob: string;
  // cccd: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const passwordRegex =
  /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const CreateStaffSchema = z.object({
  firstName: z
    .string()
    .min(1, "Vui lòng nhập họ")
    .max(100, "Họ không được vượt quá 100 ký tự"),
  lastName: z
    .string()
    .min(1, "Vui lòng nhập tên")
    .max(100, "Tên không được vượt quá 100 ký tự"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .refine((val) => emailRegex.test(val), {
      message: "Email không đúng định dạng",
    }),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(100, "Mật khẩu không được vượt quá 100 ký tự")
    .refine((val) => passwordRegex.test(val), {
      message: "Mật khẩu phải chứa ít nhất 1 số và 1 ký tự đặc biệt",
    }),
  phoneNumber: z
    .string()
    .min(10, "Số điện thoại tối thiểu 10 chữ số")
    .max(15, "Số điện thoại tối đa 15 chữ số")
    .optional(),
  storeId: z.string().min(1, "Vui lòng chọn cửa hàng làm việc"),
  role: z.nativeEnum(Role).refine((val) => val !== undefined, {
    message: "Vui lòng chọn quyền",
  }).optional(),
  hireDate: z
    .string()
    .optional()
    .refine((val) => !val || isoDateRegex.test(val), {
      message: "hireDate must be in YYYY-MM-DD format",
    }),
});

export type CreateStaff = z.infer<typeof CreateStaffSchema>;
