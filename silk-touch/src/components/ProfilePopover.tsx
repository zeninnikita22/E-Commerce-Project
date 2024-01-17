import { Fragment } from "react";

import { Transition, Popover } from "@headlessui/react";

import { useRouter } from "next/router";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useClerk } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";

export default function ProfilePopover() {
  const { isSignedIn } = useUser();
  const { signOut } = useClerk();

  const router = useRouter();

  const redirectToProfile = () => {
    router.push("/profile");
  };

  const handleLogout = async () => {
    await signOut();
  };

  return (
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
          <Popover.Panel className="absolute z-100 mt-5 w-screen max-w-xs right-0 px-4 sm:px-0 lg:max-w-l">
            <div className="relative ">
              {isSignedIn ? (
                <div className="flex-col justify-center rounded-lg bg-off-white transition duration-200 shadow-lg border border-transparent px-6 py-3">
                  <div className="py-3 transition duration-400 hover:text-pistachio">
                    <Popover.Button>
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
                    </Popover.Button>
                  </div>
                  <div className="py-3 transition duration-400 hover:text-pistachio">
                    <Popover.Button>
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
                    </Popover.Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-evenly rounded-lg shadow-lg ring-1 ring-black/5 py-4 px-2">
                  <Popover.Button>
                    <SignInButton>
                      <button className="bg-pistachio text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100">
                        Log in
                      </button>
                    </SignInButton>
                  </Popover.Button>
                  <Popover.Button>
                    <SignUpButton>
                      <button className="bg-pistachio text-black font-raleway font-light py-2 px-8 rounded-full border border-transparent transition hover:border-black hover:border-opacity-100">
                        Register
                      </button>
                    </SignUpButton>
                  </Popover.Button>
                </div>
              )}
            </div>
          </Popover.Panel>
        </Transition>
      </Fragment>
    </Popover>
  );
}
