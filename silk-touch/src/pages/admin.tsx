import { useState, useEffect } from "react";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const createItemMutation = trpc.createItem.useMutation();
  const updateItemMutation = trpc.updateItem.useMutation();
  const deleteItemMutation = trpc.deleteItem.useMutation();
  const itemsQuery = trpc.getAllItems.useQuery();
  const queryClient = useQueryClient();

  const [editingItem, setEditingItem] = useState(null);

  const startEditing = (item) => {
    setEditingItem(item);
  };

  const stopEditing = () => {
    setEditingItem(null);
  };

  console.log("Admin panel - items query", itemsQuery.data);

  function createItem(e: any) {
    e.preventDefault();
    console.log("Create item event", e);
    createItemMutation.mutate(
      {
        title: e.target[0].value,
        content: e.target[1].value,
        price: Number(e.target[2].value),
        categoryId: Number(e.target[3].value),
        published: e.target[4].checked,
        new: e.target[5].checked,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          console.log("Admin panel - add new item OnSuccess", data);
        },
      }
    );
  }

  function editItem(e: any, itemId: number) {
    e.preventDefault();
    console.log("Edit item event", e, itemId);
    updateItemMutation.mutate(
      {
        itemId: itemId,
        title: e.target[0].value,
        content: e.target[1].value,
        price: Number(e.target[2].value),
        categoryId: Number(e.target[3].value),
        published: e.target[4].checked,
        new: e.target[5].checked,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
          console.log("Admin panel - update item OnSuccess", data);
        },
      }
    );
  }

  function deleteItem(id: number) {
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

  if (itemsQuery.isLoading && !itemsQuery.data) {
    return <div>...</div>;
  } else {
    return (
      <div>
        <h1>Admin panel</h1>
        <h2>Create an item</h2>
        {/* Form for creating an item */}
        <form onSubmit={(e) => createItem(e)}>
          <label htmlFor="title"> Title of item</label>
          <input type="text" name="title"></input>
          <label htmlFor="content"> Content of item</label>
          <input type="text" name="content"></input>
          <label htmlFor="price"> Price of item</label>
          <input type="number" name="price"></input>
          <label htmlFor="category"> Category of item</label>
          <input type="text" name="category"></input>
          <label htmlFor="published"> Is the item published?</label>
          <input type="checkbox" name="published" value="published"></input>
          <label htmlFor="new"> Is the item new?</label>
          <input type="checkbox" name="new" value="new"></input>
          <button type="submit">Create an item</button>
        </form>

        {/* Edit Item Form */}
        {editingItem && (
          <form onSubmit={(e) => editItem(e, editingItem.id)}>
            <h2>Edit an item</h2>
            <label htmlFor="title">Title of item</label>
            <input type="text" name="title" defaultValue={editingItem.title} />
            <label htmlFor="content">Content of item</label>
            <input
              type="text"
              name="content"
              defaultValue={editingItem.content}
            />

            <label htmlFor="price">Price of item</label>
            <input
              type="number"
              name="price"
              defaultValue={editingItem.price}
            />

            <label htmlFor="categoryId">Category ID of item</label>
            <input
              type="number"
              name="categoryId"
              defaultValue={editingItem.categoryId}
            />

            <label htmlFor="published">Is the item published?</label>
            <input
              type="checkbox"
              name="published"
              defaultChecked={editingItem.published}
            />

            <label htmlFor="new">Is the item new?</label>
            <input
              type="checkbox"
              name="new"
              defaultChecked={editingItem.new}
            />

            <button type="submit">Update item</button>
            <button type="button" onClick={stopEditing}>
              Cancel
            </button>
          </form>
        )}

        {/* List of items */}
        <div>Items list</div>
        {itemsQuery.data?.map((item) => {
          return (
            <div key={item.id}>
              <div className="flex flex-col items-center">
                <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {/* <img
                        src={`${item.images[0].url}`}
                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                        className="h-full w-full object-cover object-center group-hover:opacity-75"
                      /> */}
                </div>
              </div>
              <div>
                <div>
                  <h1 className="mt-4 font-medium font-raleway text-black">
                    {item.title}
                  </h1>
                </div>
                <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                  {/* <img
                        src={`${item.images[0].url}`}
                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                        className="h-8 w-auto object-cover object-center group-hover:opacity-75"
                      /> */}
                </div>
                <p className="mt-2 text-xs font-medium text-black">
                  {item.content}
                </p>
                <p className="mt-3 text-base font-roboto font-medium text-black">
                  € {item.price}
                </p>
              </div>
              <button onClick={() => deleteItem(item.id)}>Delete item</button>
              <button onClick={() => startEditing(item)}>Edit item</button>
            </div>
          );
        })}
      </div>
    );
  }
}
