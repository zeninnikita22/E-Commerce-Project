import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import { useUserId } from "./UserContext";

export default function Favorites() {
  // const { user } = useUser();
  const userId = useUserId();

  const deleteItemFromFavoritesMuattion =
    trpc.deleteFromFavorites.useMutation();
  const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();

  const cartQuery = trpc.getCartItems.useQuery(
    {
      userId: userId,
    },
    {
      enabled: !!userId,
    }
  );

  const favoritesQuery = trpc.getFavoritesItems.useQuery(
    {
      userId: userId,
    },
    {
      enabled: !!userId,
    }
  );

  function changeFavorites(item) {
    const favoritesElement = favoritesQuery.data?.find(
      (element) => element.item.id === item.item.id
    );
    console.log("Favorites element is", favoritesElement);
    console.log("Button changeFavorites clicked", item);
    changeFavoritesItemsMutation.mutate(
      {
        userId: userId,
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

  function addToCart(item) {
    const cartElement = cartQuery.data?.find(
      (element) => element.itemId === item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: userId,
        itemId: item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Add to cart OnSuccess", data);
        },
      }
    );
  }

  if (favoritesQuery.data?.length == 0) {
    return (
      <>
        <h1 className="text-xl font-bold font-quicksand mt-12 ml-12">
          Favorites
        </h1>
        <p className="my-12 mx-12 text-gray-500">
          There are no products in your favorites.
        </p>
      </>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold font-quicksand mt-12 ml-12">
        Favorites
      </h1>
      <div className="container mx-auto px-12 py-12">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-2">
          {favoritesQuery.data?.map((item) => {
            return (
              <div key={item.id}>
                <div className="flex flex-col items-center">
                  <a href="#" className="group flex justify-center">
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                  </a>
                  <h1 className="mt-4 font-medium font-raleway text-black">
                    {item.item.title}
                  </h1>
                  <p className="mt-2 text-xs font-medium text-black">
                    {item.item.content}
                  </p>
                  <p className="mt-3 text-base font-roboto font-medium text-black">
                    $ {item.item.price}
                  </p>
                  <div className="flex items-center mt-5">
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-pistachio text-black font-raleway font-light py-1 px-10 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => changeFavorites(item)}
                      type="button"
                      className="relative bg-off-white px-3 py-1 ml-4 text-black transition-colors duration-300 ease-in-out border rounded-full hover:text-madder"
                    >
                      {favoritesQuery.data?.some(
                        (element) => element.item.id === item.item.id
                      ) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="#A41623"
                          className="w-6 h-6"
                        >
                          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
