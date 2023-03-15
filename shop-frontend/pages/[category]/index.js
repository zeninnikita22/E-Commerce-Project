import Link from "next/link";

function Category({ categories }) {
  const array = categories.data;
  console.log(array);
  return (
    <>
      <div>xyz</div>
      <div>{array[0].attributes.name}</div>
      {array[0].attributes.items.data.map((item) => {
        return (
          <Link key={item.id} href={`/${array[0].attributes.name}/${item.id}`}>
            {item.attributes.Title}
          </Link>
        );
      })}
    </>
  );
}

export default Category;

export const getStaticProps = async (context) => {
  const category = context.params.category;

  console.log(context);
  const result = await fetch(
    `http://localhost:1337/api/categories?filters[name][$eq]=${category}&populate=*`
  );
  const data = await result.json();
  console.log("data in get staticProps [category]", { data });
  return {
    props: { categories: data },
  };
};

export const getStaticPaths = async () => {
  const result = await fetch(`http://localhost:1337/api/categories/`);
  const data = await result.json(); // look with attention to the console output below, you will see that you data here is an object that contains data as one of the keys. hence it's either data.data.map or const {data} = result.json() - fuuuuu
  console.log("data in getStaticPaths [category]", data);
  const paths = data.data.map((item) => {
    return {
      params: { category: item.attributes.name },
    };
  });
  console.log(123);
  return {
    paths: paths,
    fallback: false,
  };
};
