import React, { useState, useEffect } from "react";
import CartIcon from "./CartIcon";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Dashboard = ({ openDashboard, setOpenDashboard }) => {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  );
  const { isLoaded, isSignedIn, user } = useUser();
  const decreaseCartItemQuantityMutation = trpc.decreaseCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const changeCartItemQuantityMutation =
    trpc.updateCartItemQuantity.useMutation();
  const createCheckoutSessionMutation =
    trpc.createCheckoutSession.useMutation();
  const queryClient = useQueryClient();
  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });
  const router = useRouter();

  function addToCart(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    addItemToCartMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Add to cart OnSuccess", data);
        },
      }
    );
  }

  function decreaseItemQuantity(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    decreaseCartItemQuantityMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Decrased item", data);
        },
      }
    );
  }

  function deleteFromCart(element) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    deleteItemFromCartMutation.mutate(
      {
        userId: user?.id,
        itemId: element.item.id,
        cartItemId: cartElement === undefined ? "" : cartElement?.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["deleteCartItem"] });
          console.log("Deleted item", data);
        },
      }
    );
  }

  function changeItemQuantity({ e, element }) {
    const cartElement = cartQuery.data.find(
      (element) => element.itemId === element.item.id
    );
    const quantityValue = e.target.value;
    if (quantityValue !== "") {
      changeCartItemQuantityMutation.mutate(
        {
          userId: user?.id,
          itemId: element.item.id,
          cartItemId: cartElement === undefined ? "" : cartElement?.id,
          quantity: Number(e.target.value),
        },
        {
          onSuccess: (data) => {
            // Invalidate specific queries after the mutation is successful
            queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
            // console.log("Deleted item", data);
          },
        }
      );
    } else {
      console.log("No value!");
    }
  }

  function checkout() {
    const cartItems = cartQuery.data.map((cartItem) => ({
      quantity: cartItem.quantity,
      priceIdStrapi: cartItem.item.priceIdStrapi,
    }));

    createCheckoutSessionMutation.mutate(
      {
        cartItems, // Pass the cart items as an array
      },
      {
        onSuccess: (data) => {
          router.push(`${data.url}`);
        },
      }
    );
  }

  console.log(cartQuery.data);

  return (
    <>
      <Transition.Root show={openDashboard} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenDashboard}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                        <div className="flex items-start justify-between">
                          <Dialog.Title className="text-lg font-medium text-gray-900">
                            Shopping cart
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                              onClick={() => setOpenDashboard(false)}
                            >
                              <span className="absolute -inset-0.5" />
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>

                        <div className="mt-8">
                          <div className="flow-root">
                            <ul
                              role="list"
                              className="-my-6 divide-y divide-gray-200"
                            >
                              {cartQuery.data?.map((element) => {
                                return (
                                  <li key={element.id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                      <img
                                        src="https://tailwindui.com/img/ecommerce-images/category-page-04-image-card-01.jpg"
                                        alt="Tall slender porcelain bottle with natural clay textured body and cork stopper."
                                        className="h-full w-full object-cover object-center"
                                      />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                      <div>
                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                          <h3>
                                            <a href="#">{element.item.title}</a>
                                          </h3>
                                          <p className="ml-4">
                                            {element.item.price}
                                          </p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">
                                          {element.item.content}
                                        </p>
                                      </div>
                                      <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-gray-500">
                                          Qty {element.quantity}
                                        </p>

                                        <div className="flex">
                                          <button
                                            type="button"
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                          >
                                            Remove
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                    {/* <button onClick={() => addToCart(element)}>
                                      +
                                    </button>
                                    <div>{element.item.title}</div>
                                    <input
                                      type="number"
                                      min="0"
                                      max="99"
                                      value={
                                        cartQuery.data?.filter(
                                          (cartItem) =>
                                            cartItem.itemId === element.item.id
                                        )[0].quantity
                                      }
                                      onChange={(e) =>
                                        changeItemQuantity({ e, element })
                                      }
                                    ></input>
                                    <div>{element.quantity}</div>
                                    <div>
                                      {element.item.price * element.quantity}
                                    </div>
                                    <button
                                      onClick={() =>
                                        decreaseItemQuantity(element)
                                      }
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => deleteFromCart(element)}
                                    >
                                      DEL
                                    </button> */}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          $
                          {cartQuery.data?.reduce(
                            (acc, item) =>
                              acc + item.item.price * item.quantity,
                            0
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-gray-500">
                          Shipping and taxes calculated at checkout.
                        </p>
                        <div className="mt-6">
                          {/* <a
                            href="#"
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            Checkout
                          </a> */}
                          <button
                            onClick={() => checkout()}
                            className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                          >
                            Checkout
                          </button>
                        </div>
                        <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                          <p>
                            or
                            <button
                              type="button"
                              className="font-medium text-indigo-600 hover:text-indigo-500"
                              onClick={() => setOpenDashboard(false)}
                            >
                              Continue Shopping
                              <span aria-hidden="true"> &rarr;</span>
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default Dashboard;
