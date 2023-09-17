import React, { useState } from "react";
import CartIcon from "./CartIcon";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Dashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const decreaseCartItemQuantityMutation = trpc.decreaseCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const changeCartItemQuantityMutation =
    trpc.updateCartItemQuantity.useMutation();
  const queryClient = useQueryClient();
  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

  function addToCart(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
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

  function decreaseItemQuantity(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    decreaseCartItemQuantityMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Decrased item", data);
        },
      }
    );
  }

  function deleteFromCart(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    deleteItemFromCartMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["deleteCartItem"] });
          console.log("Deleted item", data);
        },
      }
    );
  }

  function changeItemQuantity({ e, element }) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    const quantityValue = e.target.value;
    if (quantityValue !== "") {
      changeCartItemQuantityMutation.mutate(
        {
          userId: user?.id,
          itemId: element.item.id,
          cartItemId: cartElement === undefined ? "" : cartElement?.id,
          quantity: Number(e.target.value),
        },
        {
          onSuccess: (data) => {
            // Invalidate specific queries after the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
            // console.log("Deleted item", data);
          },
        }
      );
    } else {
      console.log("No value!");
    }
  }

  console.log(cartQuery.data);

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <h1>Cart Items:</h1>
      <div>
        {cartQuery.data?.map((element) => {
          return (
            <div key={element.id}>
              <button onClick={() => addToCart(element)}>+</button>
              <div>{element.item.title}</div>
              <input
                type="number"
                min="0"
                max="99"
                value={
                  cartQuery.data?.filter(
                    (cartItem) => cartItem.itemId === element.item.id
                  )[0].quantity
                }
                onChange={(e) => changeItemQuantity({ e, element })}
              ></input>
              <div>{element.quantity}</div>
              <div>{element.item.price * element.quantity}</div>
              <button onClick={() => decreaseItemQuantity(element)}>-</button>
              <button onClick={() => deleteFromCart(element)}>DEL</button>
            </div>
          );
        })}
        <div>
          TOTAL PRICE:{" "}
          {cartQuery.data?.reduce(
            (acc, item) => acc + item.item.price * item.quantity,
            0
          )}
        </div>
        <button>Checkout</button>
      </div>

      <div>
        ICON and Number of items in a cart:{" "}
        {/* <CartIcon numberOfCartItems={numberOfCartItems} /> */}
      </div>
    </>
  );
};

export default Dashboard;
