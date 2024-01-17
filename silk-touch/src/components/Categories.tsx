import Link from "next/link";
import { trpc } from "../pages/utils/trpc";
import { useUserId } from "../pages/UserContext";

export default function Categories() {
  const userId = useUserId();

  // Categories are fetched if there is a user
  const itemsCategoriesQuery = trpc.getAllCategoriesItems.useQuery(undefined, {
    enabled: !!userId,
  });

  return (
    <>
      <div className="bg-off-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-8 lg:max-w-none lg:py-8">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {/* Fetching our categories from the database */}
              {itemsCategoriesQuery.data?.map((category) => (
                <div
                  className="relative bg-cover transition-transform transform duration-500  rounded-lg hover:scale-105 cursor-pointer w-96 h-96 shadow-categoryCard"
                  style={{ backgroundImage: `url(${category.imageUrl})` }}
                  key={category.id}
                >
                  {/* Correcting the names of categories as they are lowercase in database */}
                  <h2 className="absolute text-white font-raleway font-medium text-2xl bottom-4 left-4 mb-3 ml-3 z-10">
                    {category.name
                      .split("&")
                      .map((word, i) =>
                        i === 0
                          ? word.charAt(0).toUpperCase() + word.slice(1)
                          : word
                      )
                      .join(" & ")}
                  </h2>
                  <Link href={`/categories/${category.id}`} passHref></Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
