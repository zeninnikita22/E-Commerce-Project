import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();

  return (
    <div className="flex justify-center items-center">
      <div className="my-12">
        <UserProfile></UserProfile>
      </div>
    </div>
  );
}
