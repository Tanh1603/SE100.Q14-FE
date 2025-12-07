"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const ContractPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Contracts
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default ContractPage;
