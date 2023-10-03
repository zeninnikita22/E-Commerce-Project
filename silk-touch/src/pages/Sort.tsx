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
    <div class="inline-block relative w-64">
      <select
        onChange={(e) => sortItems(e.target.value)}
        class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="">Sort</option>
        <option value="nameAZ">Name: A-Z</option>
        <option value="nameZA">Name: Z-A</option>
        <option value="priceLH">Price: Low to High</option>
        <option value="priceHL">Price: High to Low</option>
      </select>
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          class="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default Sort;
