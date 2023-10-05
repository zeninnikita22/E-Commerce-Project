import React from "react";
import Link from "next/link";

function CategoryCard({ imageUrl, title, categoryPage }) {
  return (
    <div
      className="relative bg-cover transition-transform transform hover:scale-105 cursor-pointer w-72 h-72"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <Link href={categoryPage}>
        <a
          className="block h-full w-full absolute top-0 left-0"
          aria-label={title}
        ></a>
      </Link>

      <h2 className="absolute text-white text-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        {title}
      </h2>

      <Link href={categoryPage}>
        <a className="absolute text-white bg-black px-4 py-2 bottom-5 left-1/2 transform -translate-x-1/2 z-10 transition-all hover:bg-gray-500">
          Shop Now
        </a>
      </Link>
    </div>
  );
}

export default CategoryCard;
