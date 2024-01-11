import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/router";

export default function Page() {
  // const router = useRouter();
  // const redirectPath = router.query.redirect
  // ? decodeURIComponent(router.query.redirect as string)
  //   : "/"; // Default redirection to home if no redirect query param
  // redirectUrl={redirectPath}
  return (
    <div className="flex justify-center items-center pt-20">
      <SignIn
        afterSignInUrl="/"
        appearance={{
          elements: {
            card: "bg-off-white",
            headerTitle: "font-quicksand",

            formButtonPrimary:
              "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
          },
        }}
      />
    </div>
  );
}
