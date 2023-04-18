import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resolve } from "styled-jsx/css";
import { useState } from "react";

function About() {
  const [categoryName, setCategoryName] = useState("");
  // const [deleteCategoryId, setDeleteCategoryId] = useState();
  const queryClient = useQueryClient();

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
  const newCategoryMutation = useMutation({
    mutationFn: (newCategory) =>
      axios
        .post(
          `http://localhost:1337/api/categories/`,
          newCategory
          // newCategory
        )
        .then((response) => response.data),
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (deleteCategoryId) =>
      axios
        .delete(
          `http://localhost:1337/api/categories/${deleteCategoryId}`
          // newCategory
        )
        .then((response) => response.data),
  });

  if (categoryQuery.isLoading) return <h2>Loading!</h2>;
  if (categoryQuery.isError) return <h2>Error!</h2>;

  console.log(categoryQuery);
  const dataOfCategoryQuery = categoryQuery.data;

  function handleSubmit(e) {
    e.preventDefault();
    const newCategory = {
      data: {
        name: categoryName,
      },
    };
    newCategoryMutation.mutate(newCategory, {
      onSuccess: async () => {
        console.log(123);
        await queryClient.refetchQueries("categories");
      },
    });
  }

  function deleteCategory({ id }) {
    const deleteCategoryId = id;
    // console.log(id);
    // setDeleteCategoryId(id);
    // console.log(categoryId);
    deleteCategoryMutation.mutate(deleteCategoryId, {
      onSuccess: async () => {
        console.log(456);
        await queryClient.refetchQueries("categories");
      },
    });
  }

  // const handleCreatePost = (event) => {
  //   event.preventDefault();
  //   const newPost = {
  //     title: event.target.elements.title.value,
  //     body: event.target.elements.body.value,
  //   };
  //   createPostMutation
  //     .mutate(newPost)
  //     .then(() => {
  //       queryClient.invalidateQueries("posts");
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  return (
    <>
      <div>Temporary page for requests</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="type a name of new category here"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        ></input>
        <button type="submit">Add new category</button>
      </form>

      <div>
        {categoryQuery.isSuccess
          ? dataOfCategoryQuery.data.map((e) => {
              return (
                <div key={e.id}>
                  <div>{e.attributes.name}</div>
                  <div>
                    <button onClick={() => deleteCategory(e)}>Delete</button>
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}
// function delay(miliseconds) {
//   return new Promise((resolve) => setTimeout(resolve, miliseconds));
// }

export default About;
