import React from "react";
import CartIcon from "./CartIcon";
import { trpc } from "./utils/trpc";

const Dashboard = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInName,
  setLoggedInName,
  loggedInUserId,
  numberOfCartItems,
  cartItems,
  setCartItems,
}) => {
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
  };

  const cartQuery = trpc.getCartItems.useQuery({
    userId: loggedInUserId,
  });

  return (
    <>
      <p>/// This is hidden dashboard ///</p>
      <h1>Cart Items:</h1>
      <div>
        {cartQuery.data?.map((item) => {
          return item.title;
        })}
      </div>
      <div>
        ICON and Number of items in a cart:{" "}
        <CartIcon
          numberOfCartItems={numberOfCartItems}
          loggedInUserId={loggedInUserId}
        />
      </div>
      <p>Hello, {loggedInName}</p>
      <button onClick={handleLogout}>Log out</button>
    </>
  );
};

export default Dashboard;
