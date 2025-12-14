import { Branch } from "./branch";
import { Role } from "./constant";
import { Gender } from "./enum";

export type Staff = {
  id: string;
  email: string;
  role: Role;
  branch: Branch;

  fullName: string;
  gender: Gender;
  dob: string;
  cccd: string;
  phone: string;
  startDate: string;
  endDate?: string | null;
};
