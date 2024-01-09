import Link from "next/link";
import { trpc } from "../pages/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { useUserId } from "../pages/UserContext";

export default function Categories() {
  const user = useUser();
  const userId = useUserId();

  const itemsCategoriesQuery = trpc.getAllCategoriesItems.useQuery(undefined, {
    enabled: !!userId,
  });

  return (
    <>
      <div className="bg-off-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-8 lg:max-w-none lg:py-8">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {itemsCategoriesQuery.data?.map((category) => (
                <div
                  className="relative bg-cover transition-transform transform duration-500 shadow-categoryCard rounded-lg hover:scale-105 cursor-pointer w-96 h-96"
                  style={{ backgroundImage: `url(${category.imageUrl})` }}
                  key={category.id}
                >
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

                  <Link href={`/categories/${category.id}`} passHref>
                    <div className="block h-full w-full absolute top-0 left-0 z-1"></div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
