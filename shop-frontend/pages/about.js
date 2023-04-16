import { useQuery, useQueryClient } from "@tanstack/react-query";
import { resolve } from "styled-jsx/css";

function About() {
  const axios = require("axios");
  const categoryQuery = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios.get("http://localhost:1337/api/categories/").then(
        ({ data }) => {
          return data;
        }
        // console.log(data);
      ),
  });

  if (categoryQuery.isLoading) return <h2>Loading!</h2>;
  if (categoryQuery.isError) return <h2>Error!</h2>;

  console.log(categoryQuery);

  const dataOfCategoryQuery = categoryQuery.data;

  return (
    <>
      <div>Temporary page for requests</div>
      <div>
        {categoryQuery.isSuccess
          ? dataOfCategoryQuery.data.map((e) => {
              return <div>{e.attributes.name}</div>;
            })
          : null}
      </div>
    </>
  );

  // function delay(miliseconds) {
  //   return new Promise((resolve) => setTimeout(resolve, miliseconds));
  // }
}

export default About;
