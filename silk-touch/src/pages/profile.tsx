import { SignInButton, useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  const { isSignedIn } = useUser();

  return (
    <div className="flex justify-center items-center">
      <div className="my-12">
        {!isSignedIn ? (
          <div className="flex flex-col items-center gap-3">
            <p>Please log in to view your profile</p>
            <SignInButton>
              <button className="bg-pistachio text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100">
                Log in
              </button>
            </SignInButton>
          </div>
        ) : (
          <UserProfile
            appearance={{
              elements: {
                card: "bg-off-white",
                headerTitle: "font-quicksand",
                formButtonPrimary:
                  "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
              },
            }}
          ></UserProfile>
        )}
      </div>
    </div>
  );
}
