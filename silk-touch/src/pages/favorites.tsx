import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

export default function Favorites() {
  const { isLoaded, isSignedIn, user } = useUser();
  const deleteItemFromFavoritesMuattion =
    trpc.deleteFromFavorites.useMutation();

  const queryClient = useQueryClient();

  const favoritesQuery = trpc.getFavoritesItems.useQuery({
    userId: user?.id,
  });

  function deleteFromFavorites(item) {
    const favoritesElement = favoritesQuery.data.find(
      (element) => element.itemId === item.item.id
    );
    console.log(favoritesQuery.data);
    deleteItemFromFavoritesMuattion.mutate(
      {
        userId: user?.id,
        itemId: item.item.id,
        favoritesId: favoritesElement === undefined ? "" : favoritesElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getFavoritesItems"] });
          console.log("Add to favorites OnSuccess", data);
        },
      }
    );
  }

  return (
    <div>
      <div>
        {favoritesQuery.data?.map((item) => {
          return (
            <div key={item.id}>
              <div>{item.item.title}</div>
              <button onClick={() => deleteFromFavorites(item)}>
                Delete from favorites
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
