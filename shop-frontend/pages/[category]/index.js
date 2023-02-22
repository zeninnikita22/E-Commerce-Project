function Category({ categories }) {
  const array = categories.data;
  console.log(array);
  return (
    <>
      <div>xyz</div>
      {/* <div>{categories.data.attributes.name}</div> */}
      {/* {array.map((item) => {
        return <div>{item.attributes.name}</div>;
      })} */}
    </>
  );

  // return <div>123</div>;
}

export default Category;

export const getStaticProps = async ({ params }) => {
  const { category } = params;
  const result = await fetch(
    `http://localhost:1337/api/categories/${category}?populate=*`
  );
  const data = await result.json();
  console.log("abc", data);
  return {
    props: { categories: data },
  };
};

export const getStaticPaths = async () => {
  const result = await fetch("http://localhost:1337/api/categories");
  const { data } = await result.json();

  const paths = data.map((item) => {
    return {
      params: { category: item.attributes.name.toLowerCase() },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};
