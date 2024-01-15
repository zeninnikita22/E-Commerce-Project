import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

export default function Sale() {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  return <div></div>;
}
