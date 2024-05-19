import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default function Page() {
  const test = auth();
  console.log(test.userId);
  return <SignIn />;
  // return <div>theanh</div>;
}
