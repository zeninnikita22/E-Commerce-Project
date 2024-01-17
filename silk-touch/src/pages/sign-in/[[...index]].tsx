import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center py-20">
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
