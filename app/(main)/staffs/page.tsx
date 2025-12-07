"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const StaffPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Staffs
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default StaffPage;
