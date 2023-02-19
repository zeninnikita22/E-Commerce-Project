function Item() {
  return <div>Item 123</div>;
}

export default Item;

export const getStaticProps = async () => {
  const result = await fetch("http://localhost:1337/api/categories/items");
  const data = await result.json();

  return {
    props: { categories: data },
  };
};
