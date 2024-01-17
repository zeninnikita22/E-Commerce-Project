import Categories from "../components/Categories";
import Sort from "../components/Sort";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import AboutUsCard from "../components/AboutUsCard";
import Products from "../components/Products";

export default function Home() {
  const [sortInput, setSortInput] = useState("");
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Categories />
      <Sort setSortInput={setSortInput} />
      <Products sortInput={sortInput} />
      <AboutUsCard />
    </>
  );
}
