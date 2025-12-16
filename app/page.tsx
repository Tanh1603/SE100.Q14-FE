import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function RootPage() {
  const user = await currentUser();

  if (user) {
    // Redirect authenticated users to home
    redirect("/home");
  } else {
    // Redirect unauthenticated users to sign-in
    redirect("/sign-in");
  }
}
