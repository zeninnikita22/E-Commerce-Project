import { trpc } from "../../utils/trpc";
import { useUser } from "@clerk/nextjs";
import prisma from "../../../../lib/prisma";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

export default function Category({ category }) {
  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const { isLoaded, isSignedIn, user } = useUser();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

  function addToCart(item) {
    const cartElement = cartQuery.data?.find(
      (element) => element.itemId === item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: user?.id,
        itemId: item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Add to cart OnSuccess", data);
        },
      }
    );
  }

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    // <div className="container mx-auto px-12 py-12">
    //   <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-2"></div>
    <>
      <h1>{category.name}</h1>
      <div className="container mx-auto px-12 py-12">
        <div className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 xl:gap-x-2">
          {category.items.map((item) => {
            return (
              <div key={item.id}>
                <div className="flex flex-col items-center">
                  <Link
                    href={`${category.id}/products/${item.id}`}
                    className="group flex justify-center"
                  >
                    <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                      <img
                        src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
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
                    $ {item.price}
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

        {/* Render other details of the category */}
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const categories = await prisma.category.findMany();
  // console.log("getStaticPaths prisma", categories);

  const paths = categories.map((category) => ({
    params: { categoryId: category.id.toString() },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(params.categoryId, 10), // Ensure to parse the ID as an integer, if it's stored as an integer in your database
    },
    include: {
      items: true, // This line includes the items related to the category in the fetched data
    },
  });
  // console.log("GetStaticProps Category:", category);
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
