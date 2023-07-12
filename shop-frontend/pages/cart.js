import Head from "next/head";
import { useSelector } from "react-redux";

function Cart() {
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <>
      <p>This is our cart:</p>
    </>
  );
}

export default Cart;
