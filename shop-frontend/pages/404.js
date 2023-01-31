import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";

function NotFound() {
  const redirect = useRouter();

  useEffect(() => {
    setTimeout(() => {
      redirect.push("/");
    }, 10000);
  }, []);

  return (
    <div>
      <div>This page doesn't exist!</div>
      <Link href="/">Press here to go to the home page</Link>
    </div>
  );
}

export default NotFound;
