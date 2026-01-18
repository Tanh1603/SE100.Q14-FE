import { BranchStatus } from "./enum";
import z from "zod";

export type Branch = {
  id: string;
  name: string;
  address: string;
  wardId: string;
  wardName: string;
  provinceId: string;
  provinceName: string;
  phone: string;
  isActive: boolean;
  status: BranchStatus;
  createdAt: string;
};

export const BranchFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên chi nhánh").max(200),
  address: z.string().min(1, "Vui lòng nhập địa chỉ").max(500),
  phone: z
    .string()
    .min(10, "Số điện thoại tối thiểu 10 chữ số")
    .max(15, "Số điện thoại tối đa 15 chữ số"),
  wardId: z.uuid(),
  provinceId: z.uuid(),
  isActive: z.boolean().optional(),
});

export type BranchFormValues = z.infer<typeof BranchFormSchema>;
export type CreateBranch = BranchFormValues;

export const UpdateBranchSchema = BranchFormSchema.extend({
  id: z.uuid(),
  isActive: z.boolean(),
});
export type UpdateBranch = z.infer<typeof UpdateBranchSchema>;
