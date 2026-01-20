# API Integration Guide

This guide explains how to replace the current mock data with real API calls in the SE100 Pawnshop Management System.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Setting Up API Client](#setting-up-api-client)
3. [Module-by-Module Integration](#module-by-module-integration)
4. [Type Mapping Strategy](#type-mapping-strategy)
5. [Error Handling](#error-handling)
6. [State Management Recommendations](#state-management-recommendations)

---

## Architecture Overview

### Current Mock Data Structure

The application currently uses mock data files located in `/mock-data/`:

```
mock-data/
├── asset.ts           # Asset types and sample assets
├── contracts.ts       # Pawn contracts (loans)
├── customer.ts        # Customer records
├── liquidation.ts     # Liquidation candidates
├── location.ts        # Provinces and wards
├── quarterly-report.ts# DK13 report data
├── statistics.ts      # Dashboard statistics
└── warehouse.ts       # Warehouse locations
```

### Centralized API Layer Structure

The `lib/api/` directory serves as the single source of truth for API interactions:

```
lib/
├── api/
│   ├── client.ts      # Centralized Axios instance with interceptors
│   ├── endpoints.ts   # API Endpoint constants
│   └── index.ts       # (Optional) Export barrel
└── adapters/          # THE ADAPTER LAYER
    ├── base.adapter.ts
    ├── loan.adapter.ts
    └── payment.adapter.ts
```

---

## Setting Up API Client

### Step 1: Configure Environment

We have configured the ports as follows to avoid conflicts:

- **Backend**: `http://localhost:3000` (API at `/api/v1`)
- **Frontend**: `http://localhost:3001`

**`.env` file:**:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Step 2: The Centralized Client (`lib/api/client.ts`)

We use **Axios** for its robust interceptor support.

Create `lib/api/client.ts`:

```typescript
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";

// Environment variable for API base URL
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Clerk or your auth provider
    // const token = await getToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      window.location.href = "/sign-in";
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

// Generic error response
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}
```

### Step 3: Define Endpoints (`lib/api/endpoints.ts`)

Create `lib/api/endpoints.ts`:

```typescript
export const ENDPOINTS = {
  LOANS: "/loans",
  PAYMENTS: "/payments",
  // ...
} as const;
```

---

## Adapter Pattern Integration

The **Adapter Pattern** is the core of our integration strategy. It decouples the Frontend (Domain) models from the Backend (DTO) models.

### Workflow

1.  **Service Layer** (`lib/loan.service.ts`) calls the API using `apiClient`.
2.  **API** returns raw JSON data (DTOs).
3.  **Service Layer** passes this data to the **Adapter**.
4.  **Adapter** (`lib/adapters/loan.adapter.ts`) transforms DTOs -> Domain Models.
5.  **Component** receives clean Domain Models.

### Example: Loan Service

```typescript
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { LoanAdapterWithContractNumber } from "@/lib/adapters/loan.adapter";
import { PagedLoanResponseDTO } from "@/types/dto/loan.dto";

export const LoanService = {
  getAllLoans: async (page = 1, limit = 20) => {
    // 1. Call API
    const response = await apiClient.get<PagedLoanResponseDTO>(
      ENDPOINTS.LOANS,
      {
        params: { page, limit },
      }
    );

    // 2. Transform with Adapter
    const dto = response.data;
    return {
      data: dto.data.map(LoanAdapterWithContractNumber.toDomain),
      meta: dto.meta,
    };
  },
};
```

---

## Module-by-Module Integration

### 1. Customers Module

**Create API functions:** `lib/api/customers.ts`

```typescript
import { apiClient, ApiResponse } from "./client";
import { ENDPOINTS } from "./endpoints";
import { Customer } from "@/types/customer";

// API response types (may differ from frontend types)
interface CustomerApiResponse {
  id: string;
  full_name: string; // API uses snake_case
  date_of_birth: string;
  phone_number: string;
  email?: string;
  identity_number: string; // CCCD
  issue_date: string;
  issue_place: string;
  address: string;
  ward_id: string;
  province_id: string;
  permanent_address: string;
  status: string;
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
  created_at: string;
  updated_at: string;
}

// Transform API response to frontend type
const mapApiToCustomer = (api: CustomerApiResponse): Customer => ({
  id: api.id,
  avatar: "", // API might not have this
  fullName: api.full_name,
  dob: api.date_of_birth,
  phone: api.phone_number,
  email: api.email,
  cccd: api.identity_number,
  issueDate: api.issue_date,
  issuePlace: api.issue_place,
  address: api.address,
  wardId: api.ward_id,
  provinceId: api.province_id,
  permanentAddress: api.permanent_address,
  status: api.status as CustomerStatus,
  otherInfo: api.other_info
    ? {
        job: api.other_info.job,
        workplace: api.other_info.workplace,
        income: api.other_info.income,
        emergencyContactName: api.other_info.emergency_contact_name,
        emergencyContactPhone: api.other_info.emergency_contact_phone,
      }
    : {
        job: "",
        workplace: "",
        income: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
      },
  familyInfo: {
    father: api.family_info?.father
      ? {
          fullName: api.family_info.father.full_name,
          phone: api.family_info.father.phone,
          job: api.family_info.father.job,
        }
      : { fullName: "", phone: "", job: "" },
    mother: api.family_info?.mother
      ? {
          fullName: api.family_info.mother.full_name,
          phone: api.family_info.mother.phone,
          job: api.family_info.mother.job,
        }
      : { fullName: "", phone: "", job: "" },
    spouse: api.family_info?.spouse
      ? {
          fullName: api.family_info.spouse.full_name,
          phone: api.family_info.spouse.phone,
          job: api.family_info.spouse.job,
        }
      : undefined,
  },
});

// API Functions
export async function getCustomers(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<Customer[]>> {
  const response = await apiClient.get<ApiResponse<CustomerApiResponse[]>>(
    ENDPOINTS.CUSTOMERS,
    { params }
  );
  return {
    ...response.data,
    data: response.data.data.map(mapApiToCustomer),
  };
}

export async function getCustomerById(id: string): Promise<Customer> {
  const response = await apiClient.get<CustomerApiResponse>(
    ENDPOINTS.CUSTOMER_BY_ID(id)
  );
  return mapApiToCustomer(response.data);
}

export async function createCustomer(
  data: Partial<Customer>
): Promise<Customer> {
  const apiData = mapCustomerToApi(data);
  const response = await apiClient.post<CustomerApiResponse>(
    ENDPOINTS.CUSTOMERS,
    apiData
  );
  return mapApiToCustomer(response.data);
}

export async function updateCustomer(
  id: string,
  data: Partial<Customer>
): Promise<Customer> {
  const apiData = mapCustomerToApi(data);
  const response = await apiClient.put<CustomerApiResponse>(
    ENDPOINTS.CUSTOMER_BY_ID(id),
    apiData
  );
  return mapApiToCustomer(response.data);
}

export async function deleteCustomer(id: string): Promise<void> {
  await apiClient.delete(ENDPOINTS.CUSTOMER_BY_ID(id));
}

// Transform frontend type to API request
const mapCustomerToApi = (customer: Partial<Customer>) => ({
  full_name: customer.fullName,
  date_of_birth: customer.dob,
  phone_number: customer.phone,
  email: customer.email,
  identity_number: customer.cccd,
  issue_date: customer.issueDate,
  issue_place: customer.issuePlace,
  address: customer.address,
  ward_id: customer.wardId,
  province_id: customer.provinceId,
  permanent_address: customer.permanentAddress,
  status: customer.status,
  other_info: customer.otherInfo
    ? {
        job: customer.otherInfo.job,
        workplace: customer.otherInfo.workplace,
        income: customer.otherInfo.income,
        emergency_contact_name: customer.otherInfo.emergencyContactName,
        emergency_contact_phone: customer.otherInfo.emergencyContactPhone,
      }
    : undefined,
  family_info: customer.familyInfo
    ? {
        father: customer.familyInfo.father
          ? {
              full_name: customer.familyInfo.father.fullName,
              phone: customer.familyInfo.father.phone,
              job: customer.familyInfo.father.job,
            }
          : undefined,
        mother: customer.familyInfo.mother
          ? {
              full_name: customer.familyInfo.mother.fullName,
              phone: customer.familyInfo.mother.phone,
              job: customer.familyInfo.mother.job,
            }
          : undefined,
        spouse: customer.familyInfo.spouse
          ? {
              full_name: customer.familyInfo.spouse.fullName,
              phone: customer.familyInfo.spouse.phone,
              job: customer.familyInfo.spouse.job,
            }
          : undefined,
      }
    : undefined,
});
```

### 2. Contracts Module

**Current Mock:** `mock-data/contracts.ts`

**Create API functions:** `lib/api/contracts.ts`

```typescript
import { apiClient, ApiResponse } from "./client";
import { ENDPOINTS } from "./endpoints";
import { loan } from "@/types/asset";

// Similar pattern: define API types, create mappers, export functions

export async function getContracts(params?: {
  search?: string;
  status?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<loan[]>> {
  const response = await apiClient.get(ENDPOINTS.CONTRACTS, { params });
  return {
    ...response.data,
    data: response.data.data.map(mapApiToContract),
  };
}

export async function createContract(data: ContractFormValues): Promise<loan> {
  const apiData = mapContractFormToApi(data);
  const response = await apiClient.post(ENDPOINTS.CONTRACTS, apiData);
  return mapApiToContract(response.data);
}

export async function quickPayContract(
  contractId: string,
  amount: number
): Promise<void> {
  await apiClient.post(ENDPOINTS.CONTRACT_QUICK_PAY(contractId), { amount });
}

export async function refinanceContract(
  contractId: string,
  newMaturityDate: string,
  interestPaid: number
): Promise<void> {
  await apiClient.post(ENDPOINTS.CONTRACT_REFINANCE(contractId), {
    new_maturity_date: newMaturityDate,
    interest_paid: interestPaid,
  });
}
```

### 3. Dashboard Module

**Current Mock:** `mock-data/statistics.ts`

```typescript
// lib/api/dashboard.ts
import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export interface DashboardStats {
  todayTransactions: number;
  activeLoanContracts: number;
  collectedContracts: number;
  remainingFunds: number;
}

export interface UpcomingPayment {
  id: string;
  customerName: string;
  phone: string;
  assetName: string;
  dueDate: string;
  amount: number;
  daysUntilDue: number;
  contractId: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await apiClient.get(ENDPOINTS.DASHBOARD_STATS);
  return {
    todayTransactions: response.data.today_transactions,
    activeLoanContracts: response.data.active_loan_contracts,
    collectedContracts: response.data.collected_contracts,
    remainingFunds: response.data.remaining_funds,
  };
}

export async function getUpcomingPayments(
  days: number = 3
): Promise<UpcomingPayment[]> {
  const response = await apiClient.get(ENDPOINTS.UPCOMING_PAYMENTS, {
    params: { days },
  });
  return response.data.map((item: any) => ({
    id: item.id,
    customerName: item.customer_name,
    phone: item.phone,
    assetName: item.asset_name,
    dueDate: item.due_date,
    amount: item.amount,
    daysUntilDue: item.days_until_due,
    contractId: item.contract_id,
  }));
}
```

---

## Type Mapping Strategy

### The Two-Layer Type System

1. **API Types** (snake_case, matches backend)
2. **Frontend Types** (camelCase, what components use)

Always create explicit mapping functions:

```typescript
// types/api/customer.api.ts - API layer types
export interface CustomerApi {
  id: string;
  full_name: string;
  phone_number: string;
  // ... snake_case fields
}

// types/customer.ts - Frontend types (already exists)
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  // ... camelCase fields
}

// lib/api/mappers/customer.mapper.ts
export const customerApiToFrontend = (api: CustomerApi): Customer => ({
  id: api.id,
  fullName: api.full_name,
  phone: api.phone_number,
  // ...
});

export const customerFrontendToApi = (
  frontend: Partial<Customer>
): Partial<CustomerApi> => ({
  full_name: frontend.fullName,
  phone_number: frontend.phone,
  // ...
});
```

---

## Error Handling

### Create a Custom Error Handler

```typescript
// lib/api/error-handler.ts
import { AxiosError } from "axios";
import { toast } from "@/components/ui/sonner"; // or your toast library

export interface ApiErrorResponse {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiErrorResponse | undefined;

    if (apiError?.details) {
      // Handle validation errors
      const messages = Object.values(apiError.details).flat();
      toast.error(messages.join(", "));
    } else if (apiError?.message) {
      toast.error(apiError.message);
    } else if (error.response?.status === 404) {
      toast.error("Không tìm thấy dữ liệu");
    } else if (error.response?.status === 403) {
      toast.error("Bạn không có quyền thực hiện thao tác này");
    } else if (error.response?.status >= 500) {
      toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
    } else {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }

    throw error;
  }

  toast.error("Có lỗi xảy ra");
  throw error;
}
```

---

## State Management Recommendations

### Option 1: React Query (Recommended)

Install TanStack Query:

```bash
npm install @tanstack/react-query
```

Create hooks:

```typescript
// lib/hooks/use-customers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customersApi from "@/lib/api/customers";

export const CUSTOMERS_QUERY_KEY = ["customers"];

export function useCustomers(
  params?: Parameters<typeof customersApi.getCustomers>[0]
) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, params],
    queryFn: () => customersApi.getCustomers(params),
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: [...CUSTOMERS_QUERY_KEY, id],
    queryFn: () => customersApi.getCustomerById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: customersApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [...CUSTOMERS_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
    },
  });
}
```

Set up the provider in `app/layout.tsx`:

```typescript
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### Option 2: SWR (Simpler Alternative)

```bash
npm install swr
```

```typescript
// lib/hooks/use-customers.ts
import useSWR from "swr";
import * as customersApi from "@/lib/api/customers";

export function useCustomers(
  params?: Parameters<typeof customersApi.getCustomers>[0]
) {
  return useSWR(["customers", params], () => customersApi.getCustomers(params));
}
```

---

## Migration Checklist

For each module, follow these steps:

### Step 1: Create API Functions

- [ ] Create `lib/api/{module}.ts`
- [ ] Define API response types
- [ ] Create mapping functions (API ↔ Frontend)
- [ ] Export CRUD functions

### Step 2: Create Hooks

- [ ] Create `lib/hooks/use-{module}.ts`
- [ ] Wrap API functions with React Query/SWR
- [ ] Add optimistic updates where appropriate

### Step 3: Update Components

Replace mock data imports with hooks:

```typescript
// BEFORE
import { mockCustomer } from "@/mock-data/customer";

const CustomerPage = () => {
  // Uses static mockCustomer
  return <DataTable data={mockCustomer} />;
};

// AFTER
import { useCustomers } from "@/lib/hooks/use-customers";

const CustomerPage = () => {
  const { data, isLoading, error } = useCustomers();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <DataTable data={data?.data ?? []} />;
};
```

### Step 4: Add Loading & Error States

- [ ] Add loading skeletons
- [ ] Add error boundaries
- [ ] Add retry buttons

### Step 5: Test Integration

- [ ] Test with real API
- [ ] Verify type mappings work correctly
- [ ] Check error handling

---

## Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Create `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-production-api.com/api/v1
```

---

## Files to Remove After Full Integration

Once all modules are integrated with real APIs, you can safely remove:

```
mock-data/
├── asset.ts           ❌ Remove
├── contracts.ts       ❌ Remove
├── customer.ts        ❌ Remove
├── liquidation.ts     ❌ Remove
├── location.ts        ❌ Maybe keep for static dropdown data
├── quarterly-report.ts❌ Remove
├── statistics.ts      ❌ Remove
└── warehouse.ts       ❌ Maybe keep for static dropdown data
```

---

## Summary

1. **Create a consistent API layer** in `lib/api/`
2. **Define clear type mappings** between API (snake_case) and frontend (camelCase)
3. **Use React Query or SWR** for data fetching with caching and optimistic updates
4. **Add proper error handling** with user-friendly messages
5. **Migrate module by module**, testing each before moving to the next
6. **Remove mock data** once each module is fully integrated
