import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Admin() {
  const [editItemId, setEditItemId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const { isLoaded, isSignedIn, user } = useUser();
  const createItemMutation = trpc.createItem.useMutation();
  const updateItemMutation = trpc.updateItem.useMutation();
  const deleteItemMutation = trpc.deleteItem.useMutation();
  const itemsQuery = trpc.getAllItems.useQuery();
  const queryClient = useQueryClient();

  console.log("Admin panel - items query", itemsQuery.data);

  function createItem(e) {
    e.preventDefault();
    console.log(e);
    createItemMutation.mutate(
      {
        title: e.target[0].value,
        content: e.target[1].value,
        price: Number(e.target[2].value),
        category: e.target[3].value,
        subcategory: e.target[4].value,
        published: e.target[5].checked,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          console.log("Admin panel - add new item OnSuccess", data);
        },
      }
    );
  }

  function editItem(e, itemId) {
    e.preventDefault();
    console.log(e, itemId);
    updateItemMutation.mutate(
      {
        itemId: itemId,
        title: e.target[0].value,
        content: e.target[1].value,
        price: Number(e.target[2].value),
        category: e.target[3].value,
        subcategory: e.target[4].value,
        published: e.target[5].checked,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          console.log("Admin panel - update item OnSuccess", data);
        },
      }
    );
  }

  function deleteItem(id) {
    console.log(id);
    deleteItemMutation.mutate(
      {
        itemId: id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          console.log("Admin panel - delete item OnSuccess", data);
        },
      }
    );
  }

  const handleInputChange = (itemId, fieldName, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [itemId]: {
        ...prevData[itemId],
        [fieldName]: value,
      },
    }));
  };

  if (itemsQuery.isLoading && !itemsQuery.data) {
    return <div>...</div>;
  } else {
    return (
      <div>
        <h1>Admin panel</h1>
        <h2>Create an item</h2>
        <form onSubmit={(e) => createItem(e)}>
          <label htmlFor="title"> Title of item</label>
          <input type="text" name="title"></input>
          <label htmlFor="content"> Content of item</label>
          <input type="text" name="content"></input>
          <label htmlFor="price"> Price of item</label>
          <input type="number" name="price"></input>
          <label htmlFor="category"> Category of item</label>
          <input type="text" name="category"></input>
          <label htmlFor="subcategory"> Subcategory of item</label>
          <input type="text" name="subcategory"></input>
          <label htmlFor="published"> Is the item published?</label>
          <input type="checkbox" name="published" value="published"></input>
          <button type="submit">Create an item</button>
        </form>

        <div>Items list</div>
        {itemsQuery.data?.map((item) => {
          return (
            <div>
              <form key={item.id} onSubmit={(e) => editItem(e, item.id)}>
                <div>
                  <div>
                    <div>{item.title}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="title"> Title of item</label>
                        <input
                          type="text"
                          name="title"
                          value={
                            (editedData[item.id] &&
                              editedData[item.id]?.title) !== undefined
                              ? editedData[item.id]?.title
                              : item.title
                          }
                          onChange={(e) =>
                            handleInputChange(item.id, "title", e.target.value)
                          }
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div>{item.content}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="content"> Content of item</label>
                        <input
                          type="text"
                          name="content"
                          value={editedData[item.id]?.content || item.content}
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "content",
                              e.target.value
                            )
                          }
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div>{item.price}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="title"> Price of item</label>
                        <input
                          type="number"
                          name="price"
                          value={
                            (editedData[item.id] &&
                              editedData[item.id]?.price) !== undefined
                              ? editedData[item.id]?.price
                              : item.price
                          }
                          onChange={(e) =>
                            handleInputChange(item.id, "price", e.target.value)
                          }
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div>{item.category}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="category"> Category of item</label>
                        <input
                          type="text"
                          name="category"
                          value={
                            (editedData[item.id] &&
                              editedData[item.id]?.category) !== undefined
                              ? editedData[item.id]?.category
                              : item.category
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "category",
                              e.target.value
                            )
                          }
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div>{item.subcategory}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="subcategory">
                          {" "}
                          Subcategory of item
                        </label>
                        <input
                          type="text"
                          name="subcategory"
                          value={
                            (editedData[item.id] &&
                              editedData[item.id]?.subcategory) !== undefined
                              ? editedData[item.id]?.subcategory
                              : item.subcategory
                          }
                          onChange={(e) =>
                            handleInputChange(
                              item.id,
                              "subcategory",
                              e.target.value
                            )
                          }
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <div>{item.published}</div>
                    {editItemId === item.id ? (
                      <div>
                        <label htmlFor="published">
                          {" "}
                          Is the item published?
                        </label>
                        <input
                          type="checkbox"
                          name="published"
                          value="published"
                        ></input>
                      </div>
                    ) : null}
                  </div>
                  <button
                    onClick={() => {
                      if (editItemId === item.id) {
                        setEditItemId(null); // Close the edit option
                      } else {
                        setEditItemId(item.id); // Open the edit option for this item
                      }
                    }}
                  >
                    {editItemId === item.id ? "Cancel Edit" : "Edit Product"}
                  </button>
                  {editItemId === item.id ? (
                    <button type="submit">Submit changes</button>
                  ) : null}
                </div>
              </form>
              <button onClick={() => deleteItem(item.id)}>Delete item</button>
            </div>
          );
        })}
      </div>
    );
  }
}
