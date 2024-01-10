import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { SignIn, SignUp } from "@clerk/clerk-react";

export default function New() {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  return (
    <div>
      {" "}
      <div>
        <h1>Welcome to Our Website</h1>
        <div>
          <h2>Sign In</h2>
          <SignIn
            appearance={{
              elements: {
                card: "bg-off-white border-none shadow-white",
                headerTitle: "font-quicksand",
                formButtonPrimary:
                  "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
              },
            }}
          />
        </div>
        <div>
          <h2>Sign Up</h2>
          <SignUp
            appearance={{
              elements: {
                card: "bg-off-white",
                headerTitle: "font-quicksand",
                formButtonPrimary:
                  "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
              },
              layout: {},
            }}
          />
        </div>
        {/* Other content of your index page */}
      </div>
    </div>
  );
}
