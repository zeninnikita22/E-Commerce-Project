function Item({ items }) {
  return <div>Item 123</div>;
}

export default Item;

export const getStaticProps = async ({ params }) => {
  const { category, item } = params;

  const result = await fetch(
    `http://localhost:1337/api/categories?filters[name][$eq]=${category}&populate[items][filters][id][$eq]=${item}`
    // if params.category return category name what does item return? how to check it?
  );
  const data = await result.json();
  // console.log("data from getProps [item]", data);

  return {
    props: { items: data },
  };
};

export const getStaticPaths = async () => {
  const result = await fetch(`http://localhost:1337/api/categories?populate=*`); // Error: A required parameter (category) was not provided as a string in getStaticPaths for /[category]/[item]
  // something is wrong in this link, I don't understand where I should take this category from? I should have multiple params somehow?
  const data = await result.json();
  console.log("data in getStaticPaths [irwm]", data);

  //change data array here to one-level structure - flatMap?

  const paths = data.data.map((i) => {
    return {
      params: { category: i.category, item: i.id.toString() }, // should I somehow put a category name here? category name is on level up then the items, we are mapping items on their level so I would need to use two maps?
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
};
