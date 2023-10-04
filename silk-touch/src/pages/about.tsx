import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export default function About() {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  return <div>About us</div>;
}
