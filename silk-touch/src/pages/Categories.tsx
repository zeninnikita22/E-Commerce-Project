import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      name: "Bedding",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-01.jpg",
      imageAlt:
        "Desk with leather desk pad, walnut desk organizer, wireless keyboard and mouse, and porcelain mug.",
      href: "#",
    },
    {
      name: "Pillows & blankets",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-02.jpg",
      imageAlt:
        "Wood table with porcelain mug, leather journal, brass pen, leather key ring, and a houseplant.",
      href: "#",
    },
    {
      name: "Towels",
      imageSrc:
        "https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg",
      imageAlt: "Collection of four insulated travel bottles on wooden shelf.",
      href: "#",
    },
  ];

  return (
    <>
      {/* {categories.map((category) => {
        <div>
          <p>Blah</p>
          <CategoryCard
            imageUrl={category.imageSrc}
            title={category.name}
            categoryPage={category.href}
          />
        </div>;
      })} */}
      <div className="bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-10 sm:py-10 lg:max-w-none lg:py-10">
            <div className="mt-6 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-6 lg:space-y-0">
              {categories.map((category) => (
                <div
                  className="relative bg-cover transition-transform transform hover:scale-105 cursor-pointer w-96 h-96"
                  style={{ backgroundImage: `url(${category.imageSrc})` }}
                >
                  <h2 className="absolute text-white text-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                    {category.name}
                  </h2>

                  <Link href={category.href} passHref>
                    <div className="block h-full w-full absolute top-0 left-0 z-0"></div>
                  </Link>

                  <Link href={category.href} passHref>
                    <button className="absolute text-white bg-black px-4 py-2 bottom-5 left-1/2 transform -translate-x-1/2 z-10 transition-all hover:bg-gray-500">
                      Shop Now
                    </button>
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
