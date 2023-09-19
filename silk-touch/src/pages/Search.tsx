import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

const Search = ({ searchInput, setSearchInput }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const itemsQuery = trpc.getAllItems.useQuery();
  //   const [searchInput, setSearchInput] = useState("");

  function findItem(value) {
    setSearchInput(value);
    // const searchedItems = itemsQuery.data.filter((item) => {
    //   return (
    //     value && item && item.title && item.title.toLowerCase().includes(value)
    //   );
    // });
    // console.log(searchedItems);
  }

  return (
    <>
      {/* icon */}
      <input
        type="search"
        placeholder="Type to search..."
        value={searchInput}
        onChange={(e) => findItem(e.target.value)}
      ></input>
    </>
  );
};

export default Search;
