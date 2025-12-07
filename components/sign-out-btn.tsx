"use client";
import { useClerk } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

const SignOutBtn = () => {
  const { signOut } = useClerk();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ redirectUrl: "/sign-in" });
  };

  return (
    <DropdownMenuItem
      className="cursor-pointer"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin mr-2" />
      ) : (
        <LogOut className="mr-2" />
      )}
      {loading ? "Đang đăng xuất..." : "Log out"}
    </DropdownMenuItem>
  );
};

export default SignOutBtn;
