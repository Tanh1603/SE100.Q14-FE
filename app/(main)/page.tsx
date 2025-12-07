"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectPage() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const role = user.publicMetadata.role;

    if (role === "admin" || role === "manager") {
      router.replace("/home");
    } else if (role === "staff") {
      router.replace("/contracts");
    } else {
      router.replace("/sign-in");
    }
  }, [router, user]);

  return null;
}
