// import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { trpc } from "./utils/trpc";

export default function Home() {
  const itemsQuery = trpc.getAllItems.useQuery();
  console.log(itemsQuery.data);

  return (
    <>
      {/* <Login /> */}
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
