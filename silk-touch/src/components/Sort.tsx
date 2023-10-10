import React, { useState } from "react";
import { trpc } from "../pages/utils/trpc";
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
    <div className="inline-block relative w-48 mt-6 ml-12">
      <select
        onChange={(e) => sortItems(e.target.value)}
        className="block appearance-none w-full bg-off-white border transition-all transition-duration-500 border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
      >
        <option value="" className="">
          Sort by
        </option>
        <option value="nameAZ" className="">
          Name: A-Z
        </option>
        <option value="nameZA" className="">
          Name: Z-A
        </option>
        <option value="priceLH" className="">
          Price: Low to High
        </option>
        <option value="priceHL" className="">
          Price: High to Low
        </option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
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
