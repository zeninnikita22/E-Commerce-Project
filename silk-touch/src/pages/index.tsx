import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [loggedInName, setLoggedInName] = useState("");
  // const [loggedInUserId, setLoggedInUserId] = useState(0);
  // const [numberOfCartItems, setNumberOfCartItems] = useState(0);
  // const [cartItems, setCartItems] = useState([]);
  const itemsQuery = trpc.getAllItems.useQuery();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  const changeFavoritesItemsMutation = trpc.changeFavorites.useMutation();

  const queryClient = useQueryClient();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: user?.id,
  });

  const favoritesQuery = trpc.getFavoritesItems.useQuery({
    userId: user?.id,
  });

  console.log("items", itemsQuery.data);
  console.log("favorites", favoritesQuery.data);
  console.log("cart", cartQuery.data);

  // useEffect(() => {
  //   console.log("Local storage data is:", localStorage.getItem("loggedUser"));
  //   if (localStorage.getItem("loggedUser") === null) {
  //   } else {
  //     const foundUser = JSON.parse(localStorage.getItem("loggedUser"));
  //     if (foundUser.isAuthorized) {
  //       setIsLoggedIn(true);
  //       setLoggedInName(foundUser.name);
  //       setLoggedInUserId(foundUser.id);
  //     } else if (foundUser.isAuthorized === null) {
  //       setIsLoggedIn(false);
  //     } else {
  //       setIsLoggedIn(false);
  //     }
  //   }
  // }, []);

  function addToCart(item) {
    addItemToCartMutation.mutate(
      {
        userId: user?.id,
        itemId: item.id,
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

  function changeFavorites(item) {
    changeFavoritesItemsMutation.mutate(
      {
        userId: user?.id,
        itemId: item.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getFavoritesItems"] });
          console.log("Add to favorites OnSuccess", data);
        },
      }
    );
  }

  // const { isSignedIn, sessionId, userId } = useAuth();
  // if (isSignedIn) {
  //   return null;
  // }
  // console.log(sessionId, userId);

  if (!isLoaded || !isSignedIn) {
    return null;
  }
  console.log(user);
  return (
    <>
      <UserButton afterSignOutUrl="/" />
      <div>Hello, {user.id} welcome to Clerk</div>
      {itemsQuery.data?.map((item) => {
        return (
          <div key={item.id}>
            <div>
              <div>{item.title}</div>
              <div>{item.content}</div>
              <div>{item.id}</div>
              <button onClick={() => addToCart(item)}>Add to cart</button>
              <button onClick={() => changeFavorites(item)}>
                Add to favorites
              </button>
            </div>
          </div>
        );
      })}
    </>
  );

  // return (
  //   <>
  //     {/* <UserButton afterSignOutUrl="/" />
  //     {isLoggedIn ? (
  //       <Dashboard
  //         isLoggedIn={isLoggedIn}
  //         setIsLoggedIn={setIsLoggedIn}
  //         loggedInName={loggedInName}
  //         setLoggedInName={setLoggedInName}
  //         loggedInUserId={loggedInUserId}
  //         numberOfCartItems={numberOfCartItems}
  //         cartItems={cartItems}
  //         setCartItems={setCartItems}
  //       />
  //     ) : null}
  //     <Login
  //       isLoggedIn={isLoggedIn}
  //       setIsLoggedIn={setIsLoggedIn}
  //       loggedInName={loggedInName}
  //       setLoggedInName={setLoggedInName}
  //       numberOfCartItems={numberOfCartItems}
  //       setNumberOfCartItems={setNumberOfCartItems}
  //       cartItems={cartItems}
  //       setCartItems={setCartItems}
  //     />
  //     <Register />
  //     <p>Home</p> */}

  //     {/* {itemsQuery.data?.map((item) => {
  //       return (
  //         <div key={item.id}>
  //           <div>
  //             <div>{item.title}</div>
  //             <div>{item.content}</div>
  //             <div>{item.id}</div>
  //             <button onClick={() => addToCart(item)}>Add to cart</button>
  //             <button onClick={() => changeFavorites(item)}>
  //               Add to favorites
  //             </button>
  //           </div>
  //         </div>
  //       );
  //     })} */}
  //   </>
  // );
}
