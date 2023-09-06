import React, { useState } from "react";
import CartIcon from "./CartIcon";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

const Dashboard = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInName,
  setLoggedInName,
  loggedInUserId,
  numberOfCartItems,
  cartItems,
  setCartItems,
}) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };
  const decreaseCartItemQuantityMutation = trpc.decreaseCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const changeCartItemQuantityMutation =
    trpc.updateCartItemQuantity.useMutation();
  const queryClient = useQueryClient();
  const cartQuery = trpc.getCartItems.useQuery({
    userId: loggedInUserId,
  });

  function addToCart(item) {
    // console.log(item)
    // console.log(loggedInUserId);
    addItemToCartMutation.mutate(
      {
        userId: loggedInUserId,
        itemId: item.itemId,
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

  function decreaseItemQuantity(item) {
    // console.log(item);
    /// you are calling it on Click only, right? how about call it on login too?
    decreaseCartItemQuantityMutation.mutate(
      {
        userId: loggedInUserId,
        itemId: item.itemId,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          // console.log("Deleted item", data);
        },
      }
    );
  }

  function deleteFromCart(item) {
    // console.log(item);
    /// you are calling it on Click only, right? how about call it on login too?
    deleteItemFromCartMutation.mutate(
      {
        userId: loggedInUserId,
        itemId: item.itemId,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["deleteCartItem"] });
          // console.log("Deleted item", data);
        },
      }
    );
  }

  function changeItemQuantity({ e, item }) {
    console.log(e.target.value);
    const quantityValue = e.target.value;
    if (quantityValue !== "") {
      changeCartItemQuantityMutation.mutate(
        {
          userId: loggedInUserId,
          itemId: item.itemId,
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

    // // console.log("Item quantity is", item.quantity, item.itemId);
  }

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <h1>Cart Items:</h1>
      <div>
        {cartQuery.data?.map((item) => {
          return (
            <div key={item.id}>
              <button onClick={() => addToCart(item)}>+</button>
              <div>{item.title}</div>
              <input
                type="number"
                min="0"
                max="99"
                value={
                  cartQuery.data?.filter(
                    (cartItem) => cartItem.itemId === item.itemId
                  )[0].quantity
                }
                onChange={(e) => changeItemQuantity({ e, item })}
              ></input>
              <div>{item.quantity}</div>
              <button onClick={() => decreaseItemQuantity(item)}>-</button>
              <button onClick={() => deleteFromCart(item)}>DEL</button>
            </div>
          );
        })}
      </div>
      <div>
        ICON and Number of items in a cart:{" "}
        <CartIcon
          numberOfCartItems={numberOfCartItems}
          loggedInUserId={loggedInUserId}
        />
      </div>
      <p>Hello, {loggedInName}</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Dashboard;
