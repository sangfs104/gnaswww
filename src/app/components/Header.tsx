"use client";
import React, { useState, useEffect } from "react";
import { Facebook, Instagram, Search, ShoppingBag } from "lucide-react";
import Image from "next/image";

const Header = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    "Use code <span className='font-bold'>WELCOME</span> to get 10% discount",
    "Free shipping on orders over $50",
    "<span className='font-bold'>Use code SAVE20 for 20% off your first order</span>",
    "Shop now and enjoy exclusive deals!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <>
      {/* Discount Banner */}
      <div className="bg-gray-100 text-center py-2 text-xs sm:text-sm text-gray-700">
        <div
          className="transition-opacity duration-500"
          dangerouslySetInnerHTML={{
            __html: `&lt;&nbsp;${messages[currentMessage]}&nbsp;&gt;`,
          }}
        />
      </div>

      {/* Main Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-60 py-4 border-b border-gray-300 bg-white">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex space-x-1 sm:space-x-2">
            <Facebook
              size={16}
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
            />
            <Instagram
              size={16}
              className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
            />
          </div>
          <Search size={16} className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
        </div>

        {/* Center Section */}
        <div className="text-center">
          <Image
            width={400}
            height={100}
            src="/img/Logo typography cá m1.png"
            alt="Offon Logo"
            className="w-[300px] h-[75px] sm:w-[400px] sm:h-[100px] md:w-[500px] md:h-[125px] lg:w-[600px] lg:h-[150px] object-contain"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-xs sm:text-sm text-gray-700">
            Vietnam | USD $
          </div>
          <ShoppingBag
            size={16}
            className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
          />
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="flex justify-center space-x-4 sm:space-x-6 py-4 text-gray-700 text-xs sm:text-sm">
        <a href="#" className="hover:underline">
          SHOP
        </a>
        <a href="#" className="hover:underline">
          CONTACT
        </a>
        <a href="#" className="hover:underline">
          TERMS & SHIPPING
        </a>
        <a href="#" className="hover:underline">
          ABOUT US
        </a>
      </nav>
    </>
  );
};

export default Header;
