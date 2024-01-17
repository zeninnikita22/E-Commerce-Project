import { trpc } from "../../utils/trpc";
import prisma from "../../../../lib/prisma";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useUserId } from "../../UserContext";
import { Category, Item } from "@prisma/client";

export default function Category({ category }: any) {
  const userId = useUserId();
  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: userId,
  });

  function addToCart(item: Item) {
    const cartElement = cartQuery.data?.find(
      (element) => element.itemId === item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: userId,
        itemId: item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
        },
      }
    );
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <>
      <div className="flex items-center mt-10 ml-12 text-sm">
        <Link href={"/"}>Home</Link>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3 h-3 mx-1"
        >
          <path
            fillRule="evenodd"
            d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
            clipRule="evenodd"
          />
        </svg>
        <Link href={`/categories/${category.id}`}>
          {category.name
            .split("&")
            .map((word: any, i: any) =>
              i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
            )
            .join(" & ")}
        </Link>
      </div>
      <div className="container mx-auto px-12 py-12">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-2">
          {category.items.map((item: any) => {
            return (
              <div key={item.id}>
                <div className="flex flex-col items-center">
                  <Link
                    href={`${category.id}/products/${item.id}`}
                    className="group flex justify-center"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src={`${item.images[0].url}`}
                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      />
                    </div>
                  </Link>
                  <h1 className="mt-4 font-medium font-raleway text-black">
                    {item.title.toUpperCase()}
                  </h1>
                  <p className="mt-2 text-xs font-medium text-black">
                    {item.content}
                  </p>
                  <p className="mt-3 text-base font-roboto font-medium text-black">
                    € {item.price}
                  </p>

                  <button
                    onClick={() => addToCart(item)}
                    className="bg-pistachio mt-3 text-black font-raleway font-light py-2 px-20 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const categories = await prisma.category.findMany();

  const paths = categories.map((category) => ({
    params: { categoryId: category.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: any) {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(params.categoryId, 10),
    },
    include: {
      items: {
        include: {
          images: true, // Include images associated with each item
        },
      },
    },
  });
  if (!category) {
    return {
      notFound: true, // This will render a 404 page if no category with the given ID is found
    };
  }

  return {
    props: {
      category,
    },
    // revalidate: 1, // Optional: Adjust the revalidation time as per your requirements
  };
}
