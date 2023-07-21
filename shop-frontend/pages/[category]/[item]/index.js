import { addToCart } from "@/pages/redux/cartReducer";
import { useDispatch } from "react-redux";

function Item({ items }) {
  const dispatch = useDispatch();
  const array = items.data;
  console.log(array);
  return (
    <div>
      <p>
        {array[0].attributes.name.charAt(0).toUpperCase() +
          array[0].attributes.name.slice(1)}{" "}
        &gt;
      </p>
      <p>{array[0].attributes.items.data[0].attributes.Title}</p>
      <div>Title: {array[0].attributes.items.data[0].attributes.Title}</div>
      <div>
        Description: {array[0].attributes.items.data[0].attributes.Description}
      </div>
      <div>Price: {array[0].attributes.items.data[0].attributes.Price}USD?</div>
      <button>+</button>
      <button>-</button>
      <button onClick={() => dispatch(addToCart())}>Add to cart</button>
    </div>
  );
}

export default Item;

export const getStaticProps = async ({ params }) => {
  const { category, item } = params;
  const result = await fetch(
    `http://localhost:1337/api/categories?filters[name][$eq]=${category}&populate[items][filters][id][$eq]=${item}`
  );
  const data = await result.json();
  return {
    props: { items: data },
  };
};

export const getStaticPaths = async () => {
  const result = await fetch(`http://localhost:1337/api/categories?populate=*`);

  const data = await result.json();
  console.log("data in getStaticPaths [irwm]", data);

  const flattenedData = data.data.flatMap((obj) =>
    obj.attributes.items.data.map((item) => ({
      id: item.id,
      category: obj.attributes.name,
      attributes: item.attributes,
    }))
  );

  const paths = flattenedData.map((i) => {
    return {
      params: { category: i.category, item: i.id.toString() },
    };
  });
  return {
    paths: paths,
    fallback: false,
  };
};
