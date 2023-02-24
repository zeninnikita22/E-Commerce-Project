function Category({ categories }) {
  const array = categories.data;
  console.log(array);
  return (
    <>
      <div>xyz</div>
      <div>{array[0].attributes.name}</div>
      {array[0].attributes.items.data.map((item) => {
        return <div>{item.attributes.Title}</div>;
      })}
    </>
  );

  // return <div>123</div>;
}

export default Category;

export const getStaticProps = async (context) => {
  const category = context.params.category;

  console.log("category", { category });
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
      params: { category: item.attributes.name }, // :D hz
    };
  });
  console.log(123);
  return {
    paths: paths,
    fallback: false,
  };
};

// `http://localhost:1337/api/categories/2?populate=*`
// http://localhost:1337/api/categories/?populate=*

// fetch in strapi by something other than id
// http://localhost:1337/api/posts?filters[slug][$eq]=entrada-de-prueba-2
