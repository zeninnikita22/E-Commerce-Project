import { useRouter } from "next/router";

function Category() {
  const router = useRouter();
  console.log(router);
  return <div>123</div>;
}

export default Category;
