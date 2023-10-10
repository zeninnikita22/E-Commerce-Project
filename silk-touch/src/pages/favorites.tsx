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
      <div className="container mx-auto my-10">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left text-sm leading-4 text-gray-500 uppercase tracking-wider">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Map through your favorites array to render the rows */}
            {favoritesQuery.data?.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b border-gray-200">
                  <img
                    src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                    alt={item.item.title}
                    className="h-12 w-auto"
                  />
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  {item.item.title}
                </td>
                <td className="py-2 px-4 border-b border-gray-200">
                  ${item.item.price}
                </td>

                {/* <button onClick={() => deleteFromFavorites(item)}>
                  Delete from favorites
                </button> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* <div>
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
      </div> */}
    </div>
  );
}
