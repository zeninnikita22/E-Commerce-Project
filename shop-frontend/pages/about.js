import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resolve } from "styled-jsx/css";
import { useState } from "react";

function About() {
  const [categoryName, setCategoryName] = useState("");
  // const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const [updateCategoryId, setUpdateCategoryId] = useState("");
  const [selectedUpdateIds, setSelectedUpdateIds] = useState([]);
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
        .post(`http://localhost:1337/api/categories/`, newCategory)
        .then((response) => response.data),
  });
  const deleteCategoryMutation = useMutation({
    mutationFn: (deleteCategoryId) =>
      axios
        .delete(`http://localhost:1337/api/categories/${deleteCategoryId}`)
        .then((response) => response.data),
  });
  const updateCategoryMutation = useMutation({
    mutationFn: ({ a, b }) =>
      // console.log(a, b, typeof a)
      axios
        .put(`http://localhost:1337/api/categories/${b}`, {
          data: {
            name: a,
          },
        })
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
        console.log("new category created!");
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
        console.log("category deleted!");
        await queryClient.refetchQueries("categories");
      },
    });
  }

  function updateCategory(e) {
    e.preventDefault();
    // console.log(e);
    // console.log(updateCategoryId);

    // console.log(event);
    // console.log(updateCategoryId );
    // setUpdateCategoryId(event.id);
    // setUpdatedCategoryName(e.target[0].value);
    // setUpdatedCategoryName({
    //   data: {
    //     name: e.target[0].value,
    //   },
    // });

    updateCategoryMutation.mutate(
      { a: e.target[0].value, b: updateCategoryId },
      {
        onSuccess: async () => {
          console.log("category updated!");
          await queryClient.refetchQueries("categories");
        },
      }
    );
  }

  function handleClick(e) {
    setUpdateCategoryId(e.id);
    const idExists = selectedUpdateIds.includes(e.id);

    if (idExists) {
      const filteredIds = selectedUpdateIds.filter(
        (selectedUpdateId) => selectedUpdateId !== e.id
      );
      setSelectedUpdateIds(filteredIds);
    } else {
      setSelectedUpdateIds([...selectedUpdateIds, e.id]);
    }
  }

  function UpdateInput() {
    return (
      <div>
        <form onSubmit={updateCategory}>
          <input
            type="text"
            // placeholder="update the name"
            // value={updatedCategoryName}
            // onChange={() => setUpdatedCategoryName(e.target.value)}
          ></input>
          <button type="submit">Update</button>
        </form>
      </div>
    );
  }

  // function openSection() {
  //   setUpdateSectionToggled(!updateSectionToggled);
  // }

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
                    <button onClick={() => handleClick(e)}>Update name</button>
                    {selectedUpdateIds.includes(e.id) ? <UpdateInput /> : null}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </>
  );
}

export default About;
