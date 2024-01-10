import React from "react";

import { Fragment, useEffect } from "react";
import { useState } from "react";

import { Disclosure, Menu, Transition, Popover } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/router";
import { trpc } from "../pages/utils/trpc";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useUserId } from "../pages/UserContext";

import Search from "./Search";
import ShoppingCart from "./ShoppingCart";
import Image from "next/image";
import UserIcon from "../../public/user.png";
import Link from "next/link";

const navigation = [
  { name: "New", href: "/new", current: false },
  { name: "Sale", href: "/sale", current: false },
  { name: "About Us", href: "/about", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  const [iconIsHovered, setIconIsHovered] = useState(false);
  const [openShoppingCart, setOpenShoppingCart] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  // console.log(user);

  // if (!user) {
  //   return <div>Loading</div>;
  // }

  const userId = useUserId();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: userId,
  });
  const categoriesQuery = trpc.getAllCategoriesItems.useQuery();
  const router = useRouter();

  const redirectToFavorites = () => {
    router.push("/favorites");
  };

  // console.log("Categories", categoriesQuery.data);

  return (
    <>
      <ShoppingCart
        openShoppingCart={openShoppingCart}
        setOpenShoppingCart={setOpenShoppingCart}
      />
      <Disclosure as="nav" className="bg-off-white border-b text-black">
        {({ open }) => (
          <>
            <div className="mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-black hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-between">
                  {/* Logo navbar item */}
                  <div className="flex flex-shrink-0 items-center">
                    <Link href="/">
                      <Image
                        src="/Logo.png"
                        alt="Site Logo"
                        width={150}
                        height={50}
                      />
                    </Link>
                  </div>
                  {/* Menu navbar items */}
                  <div className="flex">
                    <div className="hidden sm:ml-6 sm:block">
                      <div className="flex space-x-4">
                        {/* Menu navbar item - Shop All with dropdown */}
                        <div>
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <div
                              onMouseEnter={() => setIconIsHovered(true)}
                              onMouseLeave={() => setIconIsHovered(false)}
                            >
                              <Menu.Button
                                className={`inline-flex items-center w-full justify-center gap-x-1.5 px-3 py-2 font-quicksand text-sm font-medium ${
                                  iconIsHovered
                                    ? "text-pistachio"
                                    : "text-black"
                                } transition-colors duration-300 ease-in-out`}
                              >
                                Shop All
                                {/* Issue with hovering both of them !!!!!*/}
                                <ChevronDownIcon
                                  className={`-mr-1 h-5 w-5 ${
                                    iconIsHovered
                                      ? "text-pistachio"
                                      : "text-black"
                                  } transition-colors duration-300 ease-in-out`}
                                  aria-hidden="true"
                                />
                              </Menu.Button>
                            </div>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 z-10 mt-4 w-56 origin-top-right rounded-md bg-off-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {categoriesQuery.data?.map((item) => {
                                    return (
                                      <Menu.Item key={item.id}>
                                        {({ active }) => (
                                          <a
                                            href={`/categories/${item.id}`}
                                            className={classNames(
                                              active
                                                ? "bg-pistachio text-black font-quicksand transition-colors duration-500 ease-in-out"
                                                : "text-black",
                                              "block px-4 py-2 text-sm"
                                            )}
                                          >
                                            {item.name
                                              .split("&")
                                              .map((word, i) =>
                                                i === 0
                                                  ? word
                                                      .charAt(0)
                                                      .toUpperCase() +
                                                    word.slice(1)
                                                  : word
                                              )
                                              .join(" & ")}
                                          </a>
                                        )}
                                      </Menu.Item>
                                    );
                                  })}
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                        {/* Menu navbar items - others */}
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="text-black font-quicksand font-medium  hover:text-pistachio transition-colors duration-300 ease-in-out rounded-md px-3 py-2 text-sm"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    </div>
                    {/* Icon navbar items */}
                    <div className="absolute inset-y-0 right-0 flex items-center relative pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                      {/* Search */}
                      <button
                        onClick={() => {
                          setSearchOpen(!searchOpen);
                        }}
                        type="button"
                        className="relative bg-off-white px-2 text-black hover:text-pistachio transition-colors duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                          />
                        </svg>
                      </button>
                      {/* Favorites */}
                      <button
                        onClick={redirectToFavorites}
                        type="button"
                        className="relative bg-off-white px-2 text-black hover:text-pistachio transition-colors duration-300 ease-in-out"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                      {/* Cart */}
                      <button
                        onClick={() => {
                          setOpenShoppingCart(!openShoppingCart);
                        }}
                        type="button"
                        className="relative bg-off-white px-2 text-black hover:text-pistachio transition-colors duration-300 ease-in-out"
                      >
                        <svg
                          className="h-6 w-6"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                          />
                        </svg>
                        {cartQuery.data &&
                        cartQuery.data?.reduce((totalQuantity, cartItem) => {
                          return totalQuantity + cartItem.quantity;
                        }, 0) > 0 ? (
                          <div className="absolute top-0 right-0 transform translate-x-0.5 -translate-y-1/2 bg-pistachio rounded-full w-4 h-4 flex items-center justify-center text-black font-semibold text-xs">
                            {cartQuery.data?.reduce(
                              (totalQuantity, cartItem) => {
                                return totalQuantity + cartItem.quantity;
                              },
                              0
                            )}
                          </div>
                        ) : null}
                      </button>
                      {/* Profile */}
                      <Popover className="relative">
                        <Popover.Button
                          // onClick={() => {
                          //   setLoginOpen(!loginOpen);
                          // }}
                          type="button"
                          className="relative bg-off-white px-2 text-black hover:text-pistachio transition-colors duration-300 ease-in-out"
                        >
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
                              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                            />
                          </svg>
                        </Popover.Button>

                        <Fragment>
                          <Transition
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                          >
                            <Popover.Panel className="absolute  mt-5 w-screen max-w-sm right-10 px-4 sm:px-0 lg:max-w-l">
                              <div className="relative ">
                                {isSignedIn ? (
                                  <UserButton afterSignOutUrl="/" />
                                ) : !loginOpen ? (
                                  <div className="flex flex-col justify-normal">
                                    {" "}
                                    <SignIn
                                      afterSignInUrl="/"
                                      appearance={{
                                        elements: {
                                          card: "bg-off-white",
                                          headerTitle: "font-quicksand",

                                          formButtonPrimary:
                                            "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
                                        },
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="flex flex-col justify-normal">
                                    <SignUp
                                      afterSignUpUrl="/"
                                      appearance={{
                                        elements: {
                                          card: "bg-off-white border-none shadow-white",
                                          headerTitle: "font-quicksand",

                                          formButtonPrimary:
                                            "bg-pistachio text-black hover:bg-slate-300 text-sm normal-case font-raleway",
                                        },
                                      }}
                                    />
                                  </div>
                                )}
                                {/* {isSignedIn ? (
                                    <UserButton afterSignOutUrl="/" />
                                  ) : (
                                    <div className="flex justify-center gap-6">
                                      <SignInButton>
                                        <button className="bg-pistachio mt-3 text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100">
                                          Log in
                                        </button>
                                      </SignInButton>
                                      <SignUpButton>
                                        <button className="bg-pistachio mt-3 text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100">
                                          Register
                                        </button>
                                      </SignUpButton>
                                    </div>
                                  )} */}
                              </div>
                            </Popover.Panel>
                          </Transition>
                        </Fragment>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-2 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      {/* Opening search component when search button is clicked */}
      {searchOpen ? <Search /> : null}
    </>
  );
}
