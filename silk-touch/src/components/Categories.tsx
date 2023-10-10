import Link from "next/link";
// import bedding_category from "../../public/bedding_category.jpeg";
// import pillows_category from "../../public/pillows1_category.webp";
// import towels_category from "../../public/towel_category.webp";

export default function Categories() {
  const categories = [
    {
      name: "Bedding",
      imageSrc: "/bedding2.jpg",
      imageAlt:
        "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
      href: "#",
    },
    {
      name: "Pillows & blankets",
      imageSrc: "/pillows1_category.jpg",
      imageAlt:
        "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
      href: "#",
    },
    {
      name: "Towels",
      imageSrc: "/towel_category.jpg",
      imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
      href: "#",
    },
  ];

  return (
    <>
      <div className="bg-off-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-8 sm:py-8 lg:max-w-none lg:py-8">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {categories.map((category) => (
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
                  {/* 
                  <Link href={category.href} passHref>
                    <button className="absolute text-white bg-black px-4 py-2 bottom-5 left-1/2 transform -translate-x-1/2 z-10 transition-all hover:bg-gray-500">
                      Shop Now
                    </button>
                  </Link> */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
