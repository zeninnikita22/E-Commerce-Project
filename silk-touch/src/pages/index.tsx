import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";
import { useState } from "react";
import { trpc } from "./utils/trpc";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const itemsQuery = trpc.getAllItems.useQuery();
  console.log(itemsQuery.data);

  return (
    <>
      {isLoggedIn ? (
        <Dashboard isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      ) : null}
      <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
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
