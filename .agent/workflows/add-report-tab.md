---
description: How to add a new report tab to the Reports Hub
---

1. Create a new component in `components/features/reports/[report-name]-tab.tsx`.
2. Implement the report logic, removing any `SidebarInset` wrappers since it will be rendered inside the main layout.
3. Use the `RoleGate` component if the report requires specific permissions.
4. Export the component as default.
5. Open `app/(main)/reports/page.tsx`.
6. Import the new component.
7. Add a new `TabsTrigger` to the `TabsList` ensuring clear naming.
8. Add a `TabsContent` block with the corresponding value, rendering your new component inside.
