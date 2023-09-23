import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import Sort from "./Sort";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Search from "./Search";

export default function Home() {
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

  console.log("TEXTOVY MARKER", itemsQuery.data);

  return (
    <>
      <Search searchInput={searchInput} setSearchInput={setSearchInput} />
      <UserButton afterSignOutUrl="/" />
      <div>Hello, {user.id} welcome to Clerk</div>
      <Dashboard />
      <Sort sortInput={sortInput} setSortInput={setSortInput} />
      {/* osoznanno peresmotri cod! */}
      {
        itemsQuery.data?.length === 0
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
                      <div>{item.title}</div>
                      <div>{item.content}</div>
                      <div>{item.price}</div>
                      <button onClick={() => addToCart(item)}>
                        Add to cart
                      </button>
                      <button onClick={() => changeFavorites(item)}>
                        Add to favorites
                      </button>
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
                      <div>{item.title}</div>
                      <div>{item.content}</div>
                      <div>{item.price}</div>
                      <button onClick={() => addToCart(item)}>
                        Add to cart
                      </button>
                      <button onClick={() => changeFavorites(item)}>
                        Add to favorites
                      </button>
                    </div>
                  </div>
                );
              })

        // itemsQuery.data?.length === 0
        //   ? "..."
        //   : itemsQuery.data
        //       ?.sort((a, b) => {
        //         if (sortInput === "priceLH") return a.price - b.price;
        //         if (sortInput === "priceHL") return b.price - a.price;
        //         return 0;
        //       })
        //       .map((item) => {
        //         return (
        //           <>
        //             <>{item.title}</>
        //             <>{item.price}</>
        //           </>
        //         );
        //       })
      }
    </>
  );
}
