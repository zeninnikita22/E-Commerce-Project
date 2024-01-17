import { useState, useEffect } from "react";
import Products from "@/components/admin/Products";
import Feedback from "@/components/admin/Feedback";
import { trpc } from "./utils/trpc";
import { useQueryClient } from "@tanstack/react-query";
import { SignInButton, useUser } from "@clerk/nextjs";

const navigationItems = [
  {
    icon: (
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
          d="M6 6.878V6a2.25 2.25 0 0 1 2.25-2.25h7.5A2.25 2.25 0 0 1 18 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 0 0 4.5 9v.878m13.5-3A2.25 2.25 0 0 1 19.5 9v.878m0 0a2.246 2.246 0 0 0-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0 1 21 12v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6c0-.98.626-1.813 1.5-2.122"
        />
      </svg>
    ),
    text: "Products",
    component: "Products",
  },
  {
    icon: (
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
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
        />
      </svg>
    ),
    text: "Feedback",
    component: "Feedback",
  },
  // Add more navigation items if needed
];

export default function PageLayout() {
  const [activeComponent, setActiveComponent] = useState("Products");
  const { user } = useUser();

  if (user?.id !== "user_2VG30N54vdFrI0AO0O0Wn1ldRzN") {
    return (
      <div className="text-center mt-16">
        <h3>Please log in as an admin</h3>

        <SignInButton>
          <button className="rounded-full bg-night text-off-white font-normal py-2 px-4 mt-2">
            Log in
          </button>
        </SignInButton>
      </div>
    );
  }
  return (
    <div className="flex flex-1">
      {/* Sidebar */}
      <aside className="flex flex-col w-64 rounded-lg bg-off-white transition duration-200 shadow-lg border border-transparent px-6 py-3">
        <nav>
          {navigationItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center py-3 transition duration-400 hover:text-pistachio cursor-pointer"
              onClick={() => setActiveComponent(item.component)}
            >
              {item.icon}
              <span className="ml-2">{item.text}</span>
            </div>
          ))}
        </nav>
      </aside>

      {/* Content area */}
      <div className="flex-1 p-4">
        {/* Think out how to improve that if more componens are added */}
        {activeComponent === "Products" ? <Products /> : <Feedback />}
      </div>
    </div>
  );
}
