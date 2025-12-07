"use client";

import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const HomePage = () => {
  const { signOut } = useClerk();

  return (
    <div>
      Home
      <Button onClick={() => signOut({ redirectUrl: "/sign-in" })}>
        Sign out
      </Button>
    </div>
  );
};

export default HomePage;
