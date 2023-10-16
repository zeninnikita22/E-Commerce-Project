import Link from "next/link";
import { trpc } from "../pages/utils/trpc";

export default function Categories() {
  const itemsCategoriesQuery = trpc.getAllCategoriesItems.useQuery();

  console.log(itemsCategoriesQuery.data);

  const categories = [
    {
      name: "Bedding",
      imageSrc: "/bedding2.jpg",
      imageAlt:
        "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
      href: "/categories/2",
    },
    {
      name: "Pillows & blankets",
      imageSrc: "/pillows1_category.jpg",
      imageAlt:
        "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
      href: "/categories/1",
    },
    {
      name: "Towels",
      imageSrc: "/towel_category.jpg",
      imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
      href: "/categories/3",
    },
  ];

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
                    <div className="block h-full w-full absolute top-0 left-0 z-0"></div>
                  </Link>
                </div>
              ))}
              {/* {categories.map((category) => (
                <div
                  className="relative bg-cover transition-transform transform duration-500 shadow-categoryCard rounded-lg hover:scale-105 cursor-pointer w-96 h-96"
                  style={{ backgroundImage: `url(${category.imageSrc})` }}
                >
                  <h2 className="absolute text-white font-raleway font-medium text-2xl bottom-4 left-4 mb-3 ml-3 z-10">
                    {category.name}
                  </h2>

                  <Link href={category.href} passHref>
                    <div className="block h-full w-full absolute top-0 left-0 z-0"></div>
                  </Link>
                </div>
              ))} */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
