import Categories from "../components/Categories";
import Sort from "../components/Sort";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AboutUsCard from "../components/AboutUsCard";
import Products from "../components/Products";

export default function Home() {
  const [sortInput, setSortInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  // if (!isLoaded || !isSignedIn) {
  //   return null;
  // }
  // console.log(user);

  return (
    <div className="bg-off-white">
      <div className="mx-auto">
        <Categories />
        <Sort sortInput={sortInput} setSortInput={setSortInput} />
        <Products sortInput={sortInput} />
        <AboutUsCard />
      </div>
    </div>
  );
}
