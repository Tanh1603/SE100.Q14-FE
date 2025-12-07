"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const CustomerPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Customers
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default CustomerPage;
