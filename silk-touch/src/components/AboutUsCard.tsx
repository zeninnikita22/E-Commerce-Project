import React from "react";
import Link from "next/link";

const AboutUsCard = () => {
  return (
    <div className="flex w-full h-96 overflow-hidden">
      <div className="flex flex-col justify-center items-start bg-pistachio text-night py-8 px-12 w-1/2">
        <h1 className="font-raleway text-4xl mb-4">About us</h1>
        <h3 className="mb-6">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus //
          illum vitae et unde inventore excepturi totam nulla eos deserunt //
          reiciendis, tenetur vel eius exercitationem? Pariatur illum //
          perferendis accusamus praesentium quasi!
        </h3>
        <Link href="/about" passHref>
          <button className="transition-transform duration-800 transform hover:scale-105 rounded-full bg-night text-off-white font-normal py-2 px-8">
            Read more
          </button>
        </Link>
      </div>
      <div className="w-1/2">
        <img
          src="https://storage.googleapis.com/silk-touch/Images/About/Cotton.jpeg"
          alt="About Us"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default AboutUsCard;
