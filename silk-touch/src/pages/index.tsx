import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Sort from "./Sort";
import Navigation from "./Navigation";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Search from "./Search";

export default function Home() {
  const [openDashboard, setOpenDashboard] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  // const [numberOfCartItems, setNumberOfCartItems] = useState(0);
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

  console.log("items", itemsQuery.data);
  console.log("favorites", favoritesQuery.data);
  console.log("cart", cartQuery.data);

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

  // const { isSignedIn, sessionId, userId } = useAuth();
  // if (isSignedIn) {
  //   return null;
  // }
  // console.log(sessionId, userId);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  console.log(user);

  // if (itemsQuery.isLoading && !itemsQuery.data) {
  //   return "...";
  // }

  return (
    <div class="bg-white">
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <Navigation
          openDashboard={openDashboard}
          setOpenDashboard={setOpenDashboard}
        />
        <Search searchInput={searchInput} setSearchInput={setSearchInput} />
        <div>Hello, {user.id} welcome to Clerk</div>
        {/* <button
          onClick={() => {
            setOpenDashboard(!openDashboard);
          }}
        >
          --Cart icon--
        </button> */}
        <Dashboard
          openDashboard={openDashboard}
          setOpenDashboard={setOpenDashboard}
        />
        <Sort sortInput={sortInput} setSortInput={setSortInput} />
        {/* osoznanno peresmotri cod! */}
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {" "}
          {itemsQuery.data?.length === 0
            ? "..."
            : searchInput !== ""
            ? itemsQuery.data
                ?.filter(
                  (item) =>
                    searchInput &&
                    item &&
                    item.title &&
                    item.title.toLowerCase().includes(searchInput)
                )
                .sort((a, b) => {
                  if (sortInput === "priceLH") return a.price - b.price;
                  if (sortInput === "priceHL") return b.price - a.price;
                  return 0;
                })
                .map((item) => {
                  return (
                    <div key={item.id}>
                      <div>
                        <a href="#" class="group">
                          <div>{item.title}</div>
                          <div>{item.content}</div>
                          <div>{item.price}</div>
                          <button onClick={() => addToCart(item)}>
                            Add to cart
                          </button>
                          <button onClick={() => changeFavorites(item)}>
                            Add to favorites
                          </button>
                        </a>
                      </div>
                    </div>
                  );
                })
            : itemsQuery.data
                ?.sort((a, b) => {
                  if (sortInput === "priceLH") return a.price - b.price;
                  if (sortInput === "priceHL") return b.price - a.price;
                  if (sortInput === "nameAZ")
                    return a.title.toUpperCase() < b.title.toUpperCase()
                      ? -1
                      : a.title.toUpperCase() > b.title.toUpperCase()
                      ? 1
                      : 0;
                  if (sortInput === "nameZA")
                    return a.title.toUpperCase() < b.title.toUpperCase()
                      ? 1
                      : a.title.toUpperCase() > b.title.toUpperCase()
                      ? -1
                      : 0;
                  return 0;
                })
                .map((item) => {
                  return (
                    <div key={item.id}>
                      <div>
                        <a href="#" class="group">
                          <div class="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                            <img
                              src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                              alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                              class="h-full w-full object-cover object-center group-hover:opacity-75"
                            />
                          </div>
                          <h3 class="mt-4 text-sm text-gray-700">
                            {item.title}
                          </h3>
                          <p class="mt-1 text-lg font-medium text-gray-900">
                            ${item.price}
                          </p>
                        </a>
                        <p class="mt-1 text-sm font-medium text-gray-300">
                          {item.content}
                        </p>
                        <button
                          onClick={() => addToCart(item)}
                          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                          Add to cart
                        </button>
                        <button
                          onClick={() => changeFavorites(item)}
                          class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                        >
                          Add to favorites
                        </button>
                      </div>
                    </div>
                  );
                })}
        </div>
      </div>
    </div>
  );
}
