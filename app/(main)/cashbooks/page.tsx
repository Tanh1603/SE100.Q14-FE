"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const CashBookPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Cashbook
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default CashBookPage;
