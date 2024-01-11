import React from "react";

import { Fragment, useEffect } from "react";
import { useState } from "react";

import { Disclosure, Menu, Transition, Popover } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

import { useRouter } from "next/router";
import { trpc } from "../pages/utils/trpc";

import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { useUserId } from "../pages/UserContext";

import Search from "./Search";
import ShoppingCart from "./ShoppingCart";
import Image from "next/image";
import UserIcon from "../../public/user.png";
import Link from "next/link";

import { FaCloudUploadAlt, FaCog, FaSignOutAlt } from "react-icons/fa";

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
  const { signOut } = useClerk();

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

  const redirectToProfile = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    await signOut();
    // You can redirect or perform other actions after successful logout
  };

  // console.log("Categories", categoriesQuery.data);

  const popoverPosition = `absolute mt-5 w-screen ${
    isSignedIn ? "max-w-xs" : "max-w-sm"
  } ${isSignedIn ? "right-0" : "right-10"} px-4 sm:px-0 lg:max-w-l`;

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
                            <Popover.Panel className={popoverPosition}>
                              <div className="relative ">
                                {isSignedIn ? (
                                  <div className="flex-col justify-center rounded-lg bg-off-white transition duration-200 shadow-lg border border-transparent px-6 py-3">
                                    <div className="py-3 transition duration-400 hover:text-pistachio">
                                      <button
                                        onClick={() => redirectToProfile()}
                                        className="py-3"
                                      >
                                        <div className="flex justify-start gap-3">
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
                                              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                                            />
                                            <path
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                          </svg>
                                          <p>Profile settings</p>
                                        </div>
                                      </button>
                                    </div>
                                    <div className="py-3 transition duration-400 hover:text-pistachio">
                                      <button onClick={handleLogout}>
                                        <div className="flex justify-start gap-3">
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
                                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                            />
                                          </svg>
                                          <p>Log out</p>
                                        </div>
                                      </button>
                                    </div>
                                  </div>
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
