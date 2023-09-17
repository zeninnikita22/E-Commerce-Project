import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export default function Favorites() {
  const { isLoaded, isSignedIn, user } = useUser();
  const favoritesQuery = trpc.getFavoritesItems.useQuery({
    userId: user?.id,
  });

  return (
    <div>
      <div>
        {favoritesQuery.data?.map((item) => {
          return (
            <div key={item.id}>
              <div>{item.item.title}</div>
            </div>
          );
        })}
      </div>
      <h1>List of products in your favorites:</h1>
    </div>
  );
}
