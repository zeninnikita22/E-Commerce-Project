import { useState } from "react";
import { trpc } from "../pages/utils/trpc";

const Search = () => {
  const [searchInput, setSearchInput] = useState("");
  const itemsQuery = trpc.getAllItems.useQuery();

  function findItem(value: string) {
    setSearchInput(value);
  }

  return (
    <div>
      <div className="bg-pistachio flex justify-center alight-center">
        <input
          type="search"
          placeholder="Type to search..."
          value={searchInput}
          onChange={(e) => findItem(e.target.value)}
          className="my-4 mx-6 h-8 w-30 outline-none border-0 text-base rounded-full px-5 py-3 placeholder:text-gray placeholder:font-quicksand placeholder:text-sm"
        ></input>
      </div>
      <div
        className={`transition-transform duration-300 transform ${
          searchInput === "" ? "-translate-y-full" : "translate-y-0"
        } grid grid-cols-4 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-6 xl:gap-x-8 bg-pistachio pl-12`}
      >
        {itemsQuery.data?.length === 0
          ? "..."
          : searchInput === ""
          ? null
          : itemsQuery.data
              ?.filter(
                (item) =>
                  searchInput &&
                  item &&
                  item.title &&
                  item.title.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((item) => {
                return (
                  <div key={item.id} className="py-10">
                    <a
                      href={`/categories/${item.categoryId}/products/${item.id}`}
                      className="group"
                    >
                      <div className="overflow-hidden">
                        <img
                          style={{ borderRadius: "10px" }}
                          src={`${item.images[0].url}`}
                          alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                          className="h-40 w-40"
                        />
                      </div>
                      <h3 className="mt-4 text-lg font-raleway font-medium text-black">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-gray-700">
                        €{item.price}
                      </p>
                    </a>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default Search;
