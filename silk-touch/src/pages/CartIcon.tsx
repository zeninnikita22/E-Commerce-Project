import React from "react";
import { trpc } from "./utils/trpc";
import { useState, useEffect } from "react";

const CartIcon = ({ loggedInUserId, numberOfCartItems }) => {
  const cartQuery = trpc.getCartItems.useQuery({
    userId: loggedInUserId,
  });

  console.log("cart", cartQuery.data);
  //   const getUserCartItemCountMutation = trpc.getUserCartItemCount.useMutation();
  //   const [numberOfCartItems, setNumberOfCartItems] = useState(0);

  //   useEffect(() => {
  //     getUserCartItemCountMutation.mutate(
  //       {
  //         userId: loggedInUserId,
  //       },
  //       {
  //         onSuccess(data, variables, context) {
  //           console.log("DASHBOARD Number of items in cart is", data);
  //           setNumberOfCartItems(data);
  //         },
  //       }
  //     );
  //   }, []);

  return (
    <>
      <div>
        NUMBER
        {cartQuery.data?.reduce((totalQuantity, cartItem) => {
          return totalQuantity + cartItem.quantity;
        }, 0)}
      </div>
    </>
  );
};

export default CartIcon;
