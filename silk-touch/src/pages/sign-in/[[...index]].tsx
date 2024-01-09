import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Page() {
  // const router = useRouter();
  // const redirectPath = router.query.redirect
  // ? decodeURIComponent(router.query.redirect as string)
  //   : "/"; // Default redirection to home if no redirect query param
  // redirectUrl={redirectPath}
  return (
    <>
      Please sign in to proceed
      <SignIn afterSignInUrl="/" />
    </>
  );
}
