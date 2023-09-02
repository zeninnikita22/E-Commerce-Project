import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { use, useState } from "react";
import { trpc } from "./utils/trpc";
import { useEffect } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInName, setLoggedInName] = useState("");
  const itemsQuery = trpc.getAllItems.useQuery();
  console.log(itemsQuery.data);

  useEffect(() => {
    console.log("Local storage data is:", localStorage.getItem("loggedUser"));
    const foundUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (foundUser.isAuthorized) {
      setIsLoggedIn(true);
      setLoggedInName(foundUser.name);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          loggedInName={loggedInName}
          setLoggedInName={setLoggedInName}
        />
      ) : null}
      <Login
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        loggedInName={loggedInName}
        setLoggedInName={setLoggedInName}
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
            </div>
          </>
        );
      })}
    </>
  );
}
