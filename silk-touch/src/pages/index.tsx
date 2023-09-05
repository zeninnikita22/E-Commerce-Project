import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInName, setLoggedInName] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(0);
  const [numberOfCartItems, setNumberOfCartItems] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const itemsQuery = trpc.getAllItems.useQuery();
  const addItemToCartMutation = trpc.addCartItem.useMutation();
  const deleteItemFromCartMutation = trpc.deleteCartItem.useMutation();
  console.log(itemsQuery.data);

  const queryClient = useQueryClient();

  const cartQuery = trpc.getCartItems.useQuery({
    userId: loggedInUserId,
  });

  console.log("cart", cartQuery.data);

  useEffect(() => {
    console.log("Local storage data is:", localStorage.getItem("loggedUser"));
    if (localStorage.getItem("loggedUser") === null) {
    } else {
      const foundUser = JSON.parse(localStorage.getItem("loggedUser"));
      if (foundUser.isAuthorized) {
        setIsLoggedIn(true);
        setLoggedInName(foundUser.name);
        setLoggedInUserId(foundUser.id);
      } else if (foundUser.isAuthorized === null) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(false);
      }
    }
  }, []);

  function addToCart(item) {
    console.log(loggedInUserId);
    addItemToCartMutation.mutate(
      {
        userId: loggedInUserId,
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

  function deleteFromCart(item) {
    /// you are calling it on Click only, right? how about call it on login too?
    deleteItemFromCartMutation.mutate(
      {
        userId: loggedInUserId,
        itemId: item.id,
      },
      {
        onSuccess: (data) => {
          // Invalidate specific queries after the mutation is successful
          queryClient.invalidateQueries({ queryKey: ["getCartItems"] });
          console.log("Deleted item", data);
        },
      }
    );
  }

  return (
    <>
      {isLoggedIn ? (
        <Dashboard
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInName={loggedInName}
          setLoggedInName={setLoggedInName}
          loggedInUserId={loggedInUserId}
          numberOfCartItems={numberOfCartItems}
          cartItems={cartItems}
          setCartItems={setCartItems}
        />
      ) : null}
      <Login
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        loggedInName={loggedInName}
        setLoggedInName={setLoggedInName}
        numberOfCartItems={numberOfCartItems}
        setNumberOfCartItems={setNumberOfCartItems}
        cartItems={cartItems}
        setCartItems={setCartItems}
      />
      <Register />
      <p>Home</p>

      {itemsQuery.data?.map((item) => {
        return (
          <>
            <div key={item.id}>
              <div>{item.title}</div>
              <div>{item.content}</div>
              <div>{item.id}</div>
              <button onClick={() => addToCart(item)}>Add to cart</button>
            </div>
          </>
        );
      })}
    </>
  );
}
