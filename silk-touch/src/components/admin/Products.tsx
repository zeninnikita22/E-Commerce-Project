import { useState } from "react";
import { trpc } from "../../pages/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function Products() {
  interface Item {
    id: number;
    title: string;
    content: string;
    price: number;
    categoryId: number;
    published: boolean;
    new: boolean;
  }

  const queryClient = useQueryClient();
  const itemsQuery = trpc.getAllItems.useQuery();
  const createItemMutation = trpc.createItem.useMutation();
  const updateItemMutation = trpc.updateItem.useMutation();
  const deleteItemMutation = trpc.deleteItem.useMutation();

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [createFormOpen, setCreateFormOpen] = useState(false);

  const toggleCreateForm = () => {
    setCreateFormOpen(!createFormOpen);
  };

  const toggleEditForm = (item: any) => {
    if (editingItem?.id === item.id) {
      setEditingItem(null);
    } else {
      setEditingItem(item);
    }
  };

  /// CRUD functions

  function createItem(e: any) {
    e.preventDefault();
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

          // Reset the form fields
          e.target.reset();
          // Close the form
          setCreateFormOpen(false);
        },
      }
    );
  }

  function editItem(e: any, itemId: number) {
    e.preventDefault();
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
          // Close the form
          setEditingItem(null);
        },
      }
    );
  }

  function deleteItem(id: number) {
    deleteItemMutation.mutate(
      {
        itemId: id,
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({ queryKey: ["getAllItems"] });
        },
      }
    );
  }

  if (itemsQuery.isLoading && !itemsQuery.data) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        {/* Button to open form for creating a product */}
        <button
          onClick={toggleCreateForm}
          className="flex gap-3 bg-pistachio text-black font-raleway font-medium py-2 px-4 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100 mb-4"
        >
          New product
          {createFormOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </button>
        {/* Form for creating a product */}
        {createFormOpen && (
          <form
            className="flex flex-col rounded-lg bg-off-white transition duration-200 shadow-lg border border-transparent px-6 py-3"
            onSubmit={(e) => createItem(e)}
          >
            <div className="py-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title of the product
              </label>
              <input
                type="text"
                name="title"
                className="mt-1 px-2 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Description of the product
              </label>
              <input
                type="text"
                name="content"
                className="mt-1 px-2 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Price of the product (€)
              </label>
              <input
                type="number"
                name="price"
                className="mt-1 px-2 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>

            <div className="py-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Category of the product
              </label>
              <select
                name="category"
                className="mt-1 py-1 px-2 block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 text-sm"
              >
                <option value="" disabled selected>
                  Choose name of category
                </option>
                <option value="1">Pillows and blankets</option>
                <option value="2">Bedding</option>
                <option value="3">Towels</option>
              </select>
            </div>

            <div className="flex items-center py-2">
              <label
                htmlFor="published"
                className="mr-2 block text-sm text-gray-900"
              >
                Published
              </label>
              <input
                id="published"
                name="published"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center py-2">
              <label
                htmlFor="new"
                className="mr-2 block text-sm
-sm text-gray-900"
              >
                New
              </label>
              <input
                id="new"
                name="new"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
            </div>
            <button
              className="my-2 transition-transform w-1/5 duration-800 transform hover:scale-105 rounded-full bg-night text-off-white font-normal py-2 px-8"
              type="submit"
            >
              Create a product
            </button>
          </form>
        )}

        {/* List of products */}
        <div>
          <h1 className="text-lg font-semibold font-quicksand mt-8 text-center">
            List of products
          </h1>
        </div>
        {itemsQuery.data?.map((item) => {
          return (
            <div className="flex py-4" key={item.id}>
              <div className="aspect-h-1 aspect-w-1 w-1/12 overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7 mr-6">
                <img
                  src={`${item.images[0].url}`}
                  alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                  className="h-full w-full object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="flex flex-col justify-between">
                {" "}
                <div className="mr-6">
                  <div>
                    <h1 className="mt-4 font-medium font-raleway text-black">
                      {item.title}
                    </h1>
                  </div>
                  <p className="mt-2 text-xs font-medium text-black">
                    {item.content}
                  </p>
                  <p className="mt-3 text-base font-roboto font-medium text-black">
                    € {item.price}
                  </p>
                </div>
                <div className="mt-8 flex gap-2">
                  <button
                    className="transition duration-400 hover:text-pistachio"
                    onClick={() => deleteItem(item.id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                  </button>
                  <button
                    className="transition duration-400 hover:text-pistachio"
                    onClick={() => toggleEditForm(item)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Form for editing a product */}
              {editingItem?.id === item.id && (
                <form
                  onSubmit={(e) => editItem(e, item.id)}
                  className="flex flex-wrap justify-between w-3/4 bg-off-white p-4 rounded-lg shadow-md border border-gray-200 text-sm"
                >
                  <div className="flex flex-col justify-center">
                    <label htmlFor="title">Title of the product</label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingItem.title}
                      className="mt-1 py-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 text-sm"
                    />
                    <label htmlFor="content" className="mt-2">
                      Product description
                    </label>
                    <input
                      type="text"
                      name="content"
                      defaultValue={editingItem.content}
                      className="mt-1 py-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 text-sm"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <label htmlFor="price">Price of item (€)</label>
                    <input
                      type="number"
                      name="price"
                      defaultValue={editingItem.price}
                      className="mt-1 py-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 text-sm"
                    />

                    <label htmlFor="category" className="mt-2">
                      Category of the product
                    </label>
                    <select
                      name="category"
                      className="mt-1 py-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-500 text-sm"
                      defaultValue={editingItem.categoryId}
                    >
                      <option value="1">Pillows and blankets</option>
                      <option value="2">Bedding</option>
                      <option value="3">Towels</option>
                    </select>
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex gap-2">
                      <label htmlFor="published">
                        Is the product published?
                      </label>
                      <input
                        type="checkbox"
                        name="published"
                        defaultChecked={editingItem.published}
                      />
                    </div>

                    <div className="flex gap-2 mt-2">
                      <label htmlFor="new">Is the product new?</label>
                      <input
                        type="checkbox"
                        name="new"
                        defaultChecked={editingItem.new}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center">
                    <button
                      type="submit"
                      className="rounded-full bg-night text-off-white font-normal py-2 px-4"
                    >
                      Update item
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-night text-off-white font-normal py-2 px-4 mt-2"
                      onClick={() => setEditingItem(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
