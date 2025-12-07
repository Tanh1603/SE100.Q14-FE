"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const SettingPage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Settings
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default SettingPage;
