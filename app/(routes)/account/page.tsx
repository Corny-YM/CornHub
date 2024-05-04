import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AccountPage = () => {
  const { userId } = auth();

  if (!userId) return redirect("/");

  return redirect(`/account/${userId}`);
};

export default AccountPage;
