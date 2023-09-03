import React from "react";
import { trpc } from "./utils/trpc";
import { useState, useEffect } from "react";

const CartIcon = ({ loggedInUserId, numberOfCartItems }) => {
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
      <div>NUMBER {numberOfCartItems + 1}</div>
    </>
  );
};

export default CartIcon;
