"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const ReportPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Reports
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default ReportPage;
