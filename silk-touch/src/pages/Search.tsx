import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const itemsQuery = trpc.getAllItems.useQuery();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

  const favoritesQuery = trpc.getFavoritesItems.useQuery({
    userId: user?.id,
  });

  function addToCart(item) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: user?.id,
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

  function changeFavorites(item) {
    const favoritesElement = favoritesQuery.data.find(
      (element) => element.itemId === item.id
    );
    console.log(favoritesQuery.data);
    changeFavoritesItemsMutation.mutate(
      {
        userId: user?.id,
        itemId: item.id,
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

  function findItem(value) {
    setSearchInput(value);
    // const searchedItems = itemsQuery.data.filter((item) => {
    //   return (
    //     value && item && item.title && item.title.toLowerCase().includes(value)
    //   );
    // });
    // console.log(searchedItems);
  }

  return (
    <>
      {/* icon */}
      <input
        type="search"
        placeholder="Type to search..."
        value={searchInput}
        onChange={(e) => findItem(e.target.value)}
      ></input>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {itemsQuery.data?.length === 0
          ? "..."
          : searchInput === ""
          ? null
          : itemsQuery.data
              ?.filter(
                (item) =>
                  searchInput &&
                  item &&
                  item.title &&
                  item.title.toLowerCase().includes(searchInput)
              )
              .map((item) => {
                return (
                  <div key={item.id}>
                    <div>
                      <a href="#" className="group">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                          <img
                            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                            alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                        <h3 className="mt-4 text-sm text-gray-700">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-lg font-medium text-gray-900">
                          ${item.price}
                        </p>
                      </a>
                      <p className="mt-1 text-sm font-medium text-gray-300">
                        {item.content}
                      </p>
                      <button
                        onClick={() => addToCart(item)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Add to cart
                      </button>
                      <button
                        onClick={() => changeFavorites(item)}
                        className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                      >
                        Add to favorites
                      </button>
                    </div>
                  </div>
                );
              })}
      </div>
    </>
  );
};

export default Search;