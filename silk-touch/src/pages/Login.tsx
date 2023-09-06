import React, { useState } from "react";
import { trpc } from "./utils/trpc";
import bcrypt from "bcryptjs";
import { useQueryClient } from "@tanstack/react-query";

const Login = ({
  isLoggedIn,
  setIsLoggedIn,
  loggedInName,
  setLoggedInName,
  numberOfCartItems,
  setNumberOfCartItems,
  setCartItems,
  cartItems,
}) => {
  const loginUserMutation = trpc.loginUser.useMutation();
  const queryClient = useQueryClient();
  // if (loginUserMutation.data?.isAuthorized === true) {
  //   setIsLoggedIn(true);
  // }

  // console.log(loginUserMutation.data?.isAuthorized);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login data submitted:", formData);

    // const passwordMatch = await bcrypt.compare(formData.password, user.hashedPassword);

    loginUserMutation.mutate(
      {
        email: `${formData.email}`,
        password: `${formData.password}`,
      },
      {
        onSuccess(data, variables, context) {
          queryClient.invalidateQueries({ queryKey: ["loginUser"] });
          console.log("OnSuccess data received", data);

          setIsLoggedIn(data.isAuthorized);
          setLoggedInName(data.name);
          setNumberOfCartItems(data.cartItems.length);
          setCartItems(data.cartItems);
          localStorage.setItem("loggedUser", JSON.stringify(data));
        },
      }
    );

    // console.log(loginUserMutation.data?.isAuthorized);
  };

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
