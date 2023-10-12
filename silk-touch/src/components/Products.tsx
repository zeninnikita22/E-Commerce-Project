import React, { useState } from "react";
import { trpc } from "../pages/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Products = ({ sortInput }) => {
  const queryClient = useQueryClient();
  const itemsQuery = trpc.getAllItems.useQuery();
  // const itemsCategoriesQuery = trpc.getAllCategoriesItems.useQuery();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const { isLoaded, isSignedIn, user } = useUser();

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
    const cartElement = cartQuery.data?.find(
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

  return (
    <div className="container mx-auto px-12 py-12">
      <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-2">
        {" "}
        {itemsQuery.data?.length === 0
          ? "..."
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
                    <div className="flex flex-col items-center">
                      <a
                        href={`/categories/${item.categoryId}/products/${item.id}`}
                        className="group flex justify-center"
                      >
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                          <img
                            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                            alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                            className="h-full w-full object-cover object-center group-hover:opacity-75"
                          />
                        </div>
                      </a>
                      <h1 className="mt-4 font-medium font-raleway text-black">
                        {item.title.toUpperCase()}
                      </h1>
                      <p className="mt-2 text-xs font-medium text-black">
                        {item.content}
                      </p>
                      <p className="mt-3 text-base font-roboto font-medium text-black">
                        $ {item.price}
                      </p>

                      <button
                        onClick={() => addToCart(item)}
                        className="bg-pistachio mt-3 text-black font-raleway font-light py-2 px-20 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
                      >
                        Add to cart
                      </button>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default Products;
