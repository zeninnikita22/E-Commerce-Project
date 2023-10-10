import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
// import { useUser } from "@clerk/nextjs";
import prisma from "../../../../../../lib/prisma";
import { useQueryClient } from "@tanstack/react-query";

export default function Product({ product }) {
  const queryClient = useQueryClient();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const router = useRouter();

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div>
      <h1>{product.title}</h1>
      {/* Render other details of the product */}
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
