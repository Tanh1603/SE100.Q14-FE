export interface CustomerDTO {
  id: string;
  fullName: string;
  dob: string;
  phone: string;
  email?: string;
  nationalId: string; // Changed from identity_number to match OpenAPI
  nationalIdIssueDate: string; // Changed from issue_date
  nationalIdIssuePlace: string; // Changed from issue_place
  address: string;
  wardId?: string; // These might be camelCase too, checking usage
  provinceId?: string;
  permanentAddress?: string; // Check if exists in OpenAPI
  status: string;
  customerType?: "REGULAR" | "VIP";
  monthlyIncome?: number;
  creditScore?: number;

  // Based on OpenAPI CustomerResponse:
  // fatherName, fatherPhone, fatherOccupation... flattened?
  // Or kept as objects?
  // The OpenAPI spec showed flattened fields like fatherName, fatherPhone.
  // But let's check what I saw in openapi.yml earlier.

  // Re-checking openapi.yml content in memory...
  // CustomerResponse properties:
  // fatherName, fatherPhone, fatherOccupation...
  // So it is NOT nested objects 'family_info'.

  fatherName?: string;
  fatherPhone?: string;
  fatherOccupation?: string;
  motherName?: string;
  motherPhone?: string;
  motherOccupation?: string;
  spouseName?: string;
  spousePhone?: string;
  spouseOccupation?: string;

  occupation?: string; // from openapi
  workplace?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;

  createdAt?: string;
  updatedAt?: string;
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
