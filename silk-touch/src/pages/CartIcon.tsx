import React from "react";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const CartIcon = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

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
