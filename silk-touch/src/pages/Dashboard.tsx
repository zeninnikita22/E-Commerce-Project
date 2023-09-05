import React from "react";
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
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const queryClient = useQueryClient();
  const cartQuery = trpc.getCartItems.useQuery({
    userId: loggedInUserId,
  });

  function addToCart(item) {
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

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <h1>Cart Items:</h1>
      <div>
        {cartQuery.data?.map((item) => {
          return (
            <>
              <button onClick={() => addToCart(item)}>+</button>
              <div>{item.title}</div>
              <button onClick={() => deleteFromCart(item)}>-</button>
            </>
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
