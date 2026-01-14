export interface CustomerDTO {
  id: string;
  full_name: string;
  date_of_birth: string;
  phone_number: string;
  email?: string;
  identity_number: string;
  issue_date: string;
  issue_place: string;
  address: string;
  ward_id: string;
  province_id: string;
  permanent_address: string;
  status: string; // Backend might send string, adapter converts to Enum
  other_info?: {
    job: string;
    workplace: string;
    income: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
  };
  family_info?: {
    father?: { full_name: string; phone: string; job: string };
    mother?: { full_name: string; phone: string; job: string };
    spouse?: { full_name: string; phone: string; job: string };
  };
  created_at?: string;
  updated_at?: string;
}

export interface PagedCustomerResponseDTO {
  data: CustomerDTO[];
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  };
}
