// customer
export enum CustomerStatus {
  NORMAL = "NORMAL",
  DEBT = "DEBT",
}

export const CUSTOMER_STATUS_OPTIONS = [
  { label: "Bình thường", value: CustomerStatus.NORMAL },
  { label: "Nợ xấu", value: CustomerStatus.DEBT },
];
