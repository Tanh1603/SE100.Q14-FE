"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const AssetPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Asset
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default AssetPage;
