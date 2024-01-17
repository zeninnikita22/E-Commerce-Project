import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center py-20">
      <SignUp
        afterSignUpUrl="/"
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
  );
}
