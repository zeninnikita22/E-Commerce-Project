import { trpc } from "../utils/trpc";
// import { prisma } from '../';
import prisma from "../../../lib/prisma";

export const getStaticPaths = async () => {
  const items = await prisma.item.findMany();

  console.log(items);

  return {
    paths: items.map((item) => ({
      params: {
        category: item.category,
      },
    })),
    fallback: "blocking",
  };
};

export async function getStaticProps({ params }) {
  const categoryName = params.category;
  const item = await prisma.item.findMany({
    where: { category: categoryName },
  });

  return {
    props: {
      item,
    },
  };
}

export default function Category({ item }) {
  // const itemsQuery = trpc.getAllItems.useQuery();
  console.log(item);

  return (
    <div>
      <p>Temp</p>
      <div>This is index page of category {item[0].category}</div>
      <div>
        {item.map((element) => {
          return <div key={element.id}>{element.title}</div>;
        })}
      </div>
    </div>
  );
}
