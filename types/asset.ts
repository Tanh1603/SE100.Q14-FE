import { Customer } from "./customer";
import { AssetStatus, AssetTypeFieldEnum } from "./enum";
import { Warehouse } from "./warehouse";

export type loan = {
  id: string;
  loanDate: string;
  totalLoan: number;
  interestPeriod: number;
  interestRate: number;
  numberPayment: number;

  asset: Asset;
  customer: Customer;
};

export type Asset = {
  id: string;
  name: string;
  image: string;
  assetType: AssetType;
  warehouses: Warehouse;
  status: AssetStatus;
  assetValue: AssetValue[];
};

export type AssetType = {
  id: string;
  name: string;
  custodyFee?: number;
  isActive: boolean;
  field: AssetTypeField[];
};

export type AssetTypeField = {
  id: string;
  label: string; // nhãn ví dụ vàng
  required: boolean; // cần hay không
  type: AssetTypeFieldEnum; // string, date, number
};

export type AssetValue = {
  id: string;
  assetId: string;
  assetTypeField: string;
  value: string;
};
