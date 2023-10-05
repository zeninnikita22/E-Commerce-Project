import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 px-4 md:px-12">
      <div className="container mx-auto flex flex-wrap justify-between items-start">
        {/* Left Side */}
        <div className="w-full md:w-3/5 mb-8 md:mb-0">
          <Image src="/logo.png" alt="Site Logo" width={150} height={50} />
          <p className="mt-4 mb-6 text-gray-300">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter size={24} />
            </a>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-2/5 flex justify-between">
          <div>
            <h3 className="text-lg font-bold mb-4">Navigation</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/bedding">Bedding</Link>
              </li>
              <li>
                <Link href="/pillows-blankets">Pillows & Blankets</Link>
              </li>
              <li>
                <Link href="/towels">Towels</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Customers</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/payment">Payment</Link>
              </li>
              <li>
                <Link href="/delivery">Delivery</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">About</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/our-story">Our Story</Link>
              </li>
              <li>
                <Link href="/materials">Materials</Link>
              </li>
              <li>
                <Link href="/quality">Quality</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
