import { trpc } from "../utils/trpc";
// import { prisma } from '../';
import prisma from "../../../lib/prisma";

export const getStaticPaths = async () => {
  const items = await prisma.item.findMany({
    select: {
      category: true, /// check if thats only field we need
    },
  });

  console.log(items);

  return {
    paths: items.map((item) => ({
      params: {
        category: item.category,
      },
    })),
    // https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-blocking
    fallback: "blocking",
  };
};

export default function Category() {
  const itemsQuery = trpc.getAllItems.useQuery();
  return (
    <div>
      <div>This is index page of category X</div>
    </div>
  );
}
