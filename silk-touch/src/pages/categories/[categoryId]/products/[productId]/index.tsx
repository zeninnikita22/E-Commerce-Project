import { trpc } from "../../../../utils/trpc";
import prisma from "../../../../../../lib/prisma";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Category, Item, ItemImage } from "@prisma/client";
import { useUserId } from "../../../../UserContext";
import { Dialog, Transition } from "@headlessui/react";

export default function Product({
  product,
  category,
}: {
  product: Item & { images: ReadonlyArray<ItemImage> };
  category: Category;
}) {
  const { isSignedIn, user } = useUser();
  const userId = useUserId();

  let [dialogIsOpen, setDialogIsOpen] = useState(false);

  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  const cartQuery = trpc.getCartItems.useQuery(
    {
      userId: userId,
    },
    {
      enabled: !!userId,
    }
  );

  const favoritesQuery = trpc.getFavoritesItems.useQuery(
    {
      userId: user?.id || "",
    },
    {
      enabled: !!user?.id,
    }
  );

  function addToCart(item: Item) {
    // checkUserId();
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

  function changeFavorites(item: Item) {
    if (!isSignedIn) {
      setDialogIsOpen(true);
    } else {
      const favoritesElement = favoritesQuery.data?.find(
        (element) => element.itemId === item.id
      );

      changeFavoritesItemsMutation.mutate(
        {
          userId: user?.id,
          itemId: item.id,
          favoritesId:
            favoritesElement === undefined ? "" : favoritesElement?.id,
        },
        {
          onSuccess: (data) => {
            // Invalidate specific queries after the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["getFavoritesItems"] });
          },
        }
      );
    }
  }

  const [selectedImage, setSelectedImage] = useState(product?.images[0]);

  const handleHover = (image: ItemImage) => {
    setSelectedImage(image);
  };

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
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
        <Link href={`/categories/${product.categoryId}`}>
          {category.name
            .split("&")
            .map((word, i) =>
              i === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word
            )
            .join(" & ")}
        </Link>
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
        <Link href={`/categories/${product.categoryId}/products/${product.id}`}>
          {product.title.charAt(0).toUpperCase() + product.title.slice(1)}
        </Link>
      </div>
      <div className="flex p-10 space-x-8">
        <div style={{ width: "45%" }}>
          <img
            style={{ objectFit: "cover", borderRadius: "10px" }}
            className="w-full h-5/6 object-cover transition-transform duration-500 transform hover:scale-105"
            src={`${selectedImage.url}`}
            alt={product.title}
          />
        </div>

        <div style={{ width: "55%" }} className="flex">
          <div className="flex flex-col space-y-2 mr-8">
            {product.images.map((image) => (
              <img
                key={image.id}
                className="w-24 h-24 object-cover cursor-pointer transition-transform duration-500 transform hover:scale-105"
                src={`${image.url}`}
                alt={product.title}
                onMouseOver={() => handleHover(image)}
              />
            ))}
          </div>

          <div>
            <h1 className="text-3xl mb-2 font-medium font-raleway text-black">
              {product.title}
            </h1>
            <p className="text-xl mb-5 text-base font-roboto font-medium text-black">
              € {product.price}
            </p>
            <p className="mb-8 text-sm font-normal text-gray-500">
              {product.content}
            </p>

            <div className="flex">
              <button
                onClick={() => addToCart(product)}
                className="bg-pistachio text-black font-raleway font-light py-2 px-20 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
              >
                Add to cart
              </button>

              <button
                onClick={() => changeFavorites(product)}
                type="button"
                className="relative bg-off-white px-3 py-1 ml-4 text-black transition-colors duration-300 ease-in-out border rounded-full hover:text-madder"
              >
                {favoritesQuery.data?.some(
                  (element) => element.item.id === product.id
                ) ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#A41623"
                    className="w-6 h-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <>
        <Transition appear show={dialogIsOpen}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setDialogIsOpen(false)}
          >
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      Please log in to add products to your favorites
                    </Dialog.Title>
                    <div className="flex justify-evenly">
                      <div className="mt-6">
                        <SignInButton>
                          <button
                            onClick={() => setDialogIsOpen(false)}
                            className="bg-pistachio text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
                          >
                            Log in
                          </button>
                        </SignInButton>
                      </div>

                      <div className="mt-6">
                        <button
                          onClick={() => setDialogIsOpen(false)}
                          className="bg-gray-200 text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch categories with their related products (items)
  const categories = await prisma.category.findMany({
    include: {
      items: true, // Including the related items (products) for each category
    },
  });

  // Create paths for each category and product combination
  const paths = categories.flatMap((category) =>
    category.items.map((item) => ({
      params: {
        categoryId: category.id.toString(),
        productId: item.id.toString(), // Using productId as the identifier
      },
    }))
  );

  return { paths, fallback: true };
}

export async function getStaticProps({ params }: any) {
  // Destructure params to extract categoryId and productId
  const { categoryId, productId } = params;

  // Fetch the specific category
  const category = await prisma.category.findUnique({
    where: {
      id: parseInt(categoryId, 10), // Convert categoryId to a number
    },
  });

  // Fetch the specific product (item) associated with the categoryId
  const product = await prisma.item.findUnique({
    where: {
      id: parseInt(productId, 10), // Convert productId to a number
    },
    include: {
      images: true,
    },
  });

  // Check if category and product data exist
  if (!category || !product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      category,
      product,
    },
    revalidate: 1, // Optional: Adjust the revalidation time as needed
  };
}
