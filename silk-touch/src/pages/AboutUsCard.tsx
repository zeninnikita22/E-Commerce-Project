import React from "react";
import Link from "next/link";

const AboutUsCard = () => {
  return (
    <div className="flex w-full h-96 border border-gray-300 overflow-hidden">
      <div className="flex flex-col justify-center items-start p-8 w-1/2">
        <h1 className="text-4xl mb-4">About us</h1>
        <p className="mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus //
          illum vitae et unde inventore excepturi totam nulla eos deserunt //
          reiciendis, tenetur vel eius exercitationem? Pariatur illum //
          perferendis accusamus praesentium quasi!
        </p>
        <Link href="/about" passHref>
          <button>Read more</button>
        </Link>
      </div>
      <div className="w-1/2">
        <img
          src="https://tailwindui.com/img/ecommerce-images/home-page-02-edition-03.jpg"
          alt="About Us"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AboutUsCard;
