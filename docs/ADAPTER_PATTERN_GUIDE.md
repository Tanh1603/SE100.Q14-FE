# Adapter Pattern Guide

## 1. Why use the Adapter Pattern?

Modern frontend applications often suffer from "Backend Coupling". This happens when:

- Components use `snake_case` variable names (e.g., `user.first_name`) because the database uses them.
- If the backend API changes `user.first_name` to `user.givenName`, **50 components break**.
- Frontend code becomes messy with unnecessary checks like `if (data && data.user && data.user.details)`.

The **Adapter Pattern** acts as a secure "border control" layer. It ensures that no matter what the Backend sends (Messy Data), the specific UI components always receive Clean Data (Camel Case, Predictable Structure).

---

## 2. Architecture

```mermaid
graph LR
    API[Backend API (Snake Case)] -->|Raw JSON| Service[Service Layer]
    Service -->|DTO| Adapter[Adapter Layer]
    Adapter -->|Domain Model| Store[React Query / State]
    Store -->|Clean Props| UI[Components]
```

- **DTO (Data Transfer Object):** The exact shape of the JSON response (Snake Case).
- **Domain Model:** The clean TypeScript interface the UI wants (Camel Case).
- **Adapter:** The pure function that converts DTO -> Domain.

---

## 3. How to Implement a New Adapter

### Step 1: Define the Raw DTO

Create a file in `types/dto/` that mirrors the Backend JSON exactly.

```typescript
// types/dto/user.dto.ts
export interface UserDTO {
  user_id: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
}
```

### Step 2: Define the Clean Domain Model

Ensure you have a clean type in `types/` (or reuse existing ones).

```typescript
// types/user.ts
export interface User {
  id: string;
  fullName: string; // Combined convenient field
  status: "Active" | "Inactive"; // Transformed status
}
```

### Step 3: Create the Adapter

Create a file in `lib/adapters/`.

```typescript
// lib/adapters/user.adapter.ts
import { BaseAdapter } from "./base.adapter";
import { UserDTO } from "@/types/dto/user.dto";
import { User } from "@/types/user";

export const UserAdapter: BaseAdapter<User, UserDTO> = {
  toDomain(dto: UserDTO): User {
    return {
      id: dto.user_id,
      fullName: `${dto.first_name} ${dto.last_name}`,
      status: dto.is_active ? "Active" : "Inactive",
    };
  },
};
```

---

## 4. How to Use in Services

Do **NOT** use adapters directly in Components. Use them in the **Service Layer** (`lib/*.service.ts`).

### Fetching Data (GET)

```typescript
import { UserAdapter } from "@/lib/adapters/user.adapter";

export async function getUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  const rawData = await response.json(); // returns UserDTO[]

  // Transform immediately!
  return rawData.map(UserAdapter.toDomain);
}
```

### Sending Data (POST)

You can also create "Reverse Adapters" or Payload Adapters.

```typescript
export const CreateUserAdapter = {
  toPayload(request: CreateUserRequest) {
    return {
      first_name: request.firstName,
      last_name: request.lastName,
      // ...
    };
  },
};

// Usage
export async function createUser(data: CreateUserRequest) {
  const payload = CreateUserAdapter.toPayload(data);
  return axios.post("/api/users", payload);
}
```

---

## 5. Benefits Checklist

- ✅ **Refactoring Safety:** If Backend changes `user_id` to `uuid`, you only fix **1 line** in `UserAdapter`.
- ✅ **Clean Components:** UI code never sees underscores (`_`).
- ✅ **Null Safety:** Adapters can provide default values (e.g., `amount: dto.amount || 0`).
