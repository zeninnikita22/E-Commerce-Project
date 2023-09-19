import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Sort = ({ sortInput, setSortInput }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const itemsQuery = trpc.getAllItems.useQuery();

  function sortItems(value) {
    setSortInput(value);
  }

  return (
    <>
      <select onChange={(e) => sortItems(e.target.value)}>
        <option value="">--Please choose an option--</option>
        <option value="nameAZ">Name: A-Z</option>
        <option value="nameZA">Name: Z-A</option>
        <option value="priceLH">Price: Low to High</option>
        <option value="priceHL">Price: High to Low</option>
      </select>
    </>
  );
};

export default Sort;
