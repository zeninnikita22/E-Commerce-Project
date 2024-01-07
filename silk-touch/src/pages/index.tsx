import Categories from "../components/Categories";
import Sort from "../components/Sort";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import AboutUsCard from "../components/AboutUsCard";
import Products from "../components/Products";

export default function Home() {
  const [sortInput, setSortInput] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();

  // Optionally, handle loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // User-specific content (e.g., user's name or profile link) can be rendered conditionally
  return (
    <div className="bg-off-white">
      <div className="mx-auto">
        {/* {isSignedIn && <div>Welcome, {user.firstName}!</div>} */}
        <Categories />
        <Sort setSortInput={setSortInput} />
        <Products sortInput={sortInput} />
        <AboutUsCard />
      </div>
    </div>
  );
}
