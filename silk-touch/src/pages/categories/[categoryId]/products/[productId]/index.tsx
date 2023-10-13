import { trpc } from "../../../../utils/trpc";
// import { useUser } from "@clerk/nextjs";
import prisma from "../../../../../../lib/prisma";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

export default function Product({ product, category }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const [numberOfCartItems, setNumberOfCartItems] = useState(0);
  const itemsQuery = trpc.getAllItems.useQuery();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

  const favoritesQuery = trpc.getFavoritesItems.useQuery({
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

  function changeFavorites(item) {
    const favoritesElement = favoritesQuery.data?.find(
      (element) => element.itemId === item.id
    );
    console.log(favoritesQuery.data);
    changeFavoritesItemsMutation.mutate(
      {
        userId: user?.id,
        itemId: item.id,
        favoritesId: favoritesElement === undefined ? "" : favoritesElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getFavoritesItems"] });
          console.log("Add to favorites OnSuccess", data);
        },
      }
    );
  }

  // const [mainImage, setMainImage] = useState("");
  console.log(favoritesQuery.data);
  console.log(product);
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
          {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
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
      <div className="flex p-10">
        <div style={{ width: "55%" }} className="grid grid-cols-2 gap-4">
          <img
            className="w-full h-full object-cover"
            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
            alt={product.title}
          />
          <img
            className="w-full h-full object-cover"
            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
            alt={product.title}
          />
          <img
            className="w-full h-full object-cover"
            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
            alt={product.title}
          />
          <img
            className="w-full h-full object-cover"
            src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
            alt={product.title}
          />
        </div>

        <div style={{ width: "45%" }} className="pl-10">
          <h1 className="text-3xl mb-2 font-medium font-raleway text-black">
            {product.title}
          </h1>
          <p className="text-xl mb-5 text-base font-roboto font-medium text-black">
            ${product.price}
          </p>
          <p className="mb-8 text-sm font-normal text-gray-500">
            {product.content} Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Praesent vulputate magna diam, at consequat lectus semper
            eget. Proin sit amet pretium ex. Fusce dictum lacus eu tincidunt
            rutrum. Vivamus ac nulla ac arcu viverra dignissim. Donec sed
            commodo nisl. Sed quam diam, gravida ut metus et, egestas eleifend
            odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Vestibulum malesuada convallis dictum. Morbi molestie vel ipsum sed
            aliquam.
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

export async function getStaticProps({ params }) {
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

// import { useRouter } from 'next/router';

// export default function Product({ product }) {
//   const router = useRouter();

//   if (router.isFallback) {
//     return <div>Loading...</div>; // You can customize the loading state here
//   }

//   return (
//     <div>
//       <h1>{product.name}</h1>
//       {/* Render other details of the product */}
//     </div>
//   );
// }

// export async function getStaticPaths() {
//   // Fetch categories
//   const categoriesRes = await fetch('https://api.example.com/categories');
//   const categories = await categoriesRes.json();

//   // Fetch products for each category
//   let paths = [];
//   for (const category of categories) {
//     const productsRes = await fetch(`https://api.example.com/categories/${category.id}/products`);
//     const products = await productsRes.json();
//     const newPaths = products.map((product) => ({
//       params: { categoryId: category.id.toString(), productId: product.id.toString() },
//     }));
//     paths = [...paths, ...newPaths];
//   }

//   return { paths, fallback: true };
// }

// export async function getStaticProps({ params }) {
//   const res = await fetch(`https://api.example.com/products/${params.productId}`);
//   const product = await res.json();

//   return { props: { product } };
// }
