import Dashboard from "../components/ShoppingCart";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import AboutUsCard from "../components/AboutUsCard";
import Products from "../components/Products";

export default function Home() {
  // const [searchInput, setSearchInput] = useState("");
  const [sortInput, setSortInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  // const [numberOfCartItems, setNumberOfCartItems] = useState(0);
  // const queryClient = useQueryClient();
  // const itemsQuery = trpc.getAllItems.useQuery();
  // const addItemToCartMutation = trpc.addCartItem.useMutation();
  // const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  // const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  // const cartQuery = trpc.getCartItems.useQuery({
  //   userId: user?.id,
  // });

  // const favoritesQuery = trpc.getFavoritesItems.useQuery({
  //   userId: user?.id,
  // });

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
    <div className="bg-off-white">
      <div className="mx-auto">
        <Categories />
        <Sort sortInput={sortInput} setSortInput={setSortInput} />
        <Products sortInput={sortInput} />
        <AboutUsCard />
      </div>
    </div>
  );
}
