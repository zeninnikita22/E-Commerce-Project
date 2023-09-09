import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Favorites() {
  const favoritesQuery = trpc.getFavoritesItems.useQuery({
    userId: loggedInUserId,
  });

  return (
    <div>
      <div>{}</div>
      <h1>List of products in your favorites:</h1>
    </div>
  );
}
