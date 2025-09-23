import React from "react";

const Header = () => {
  return (
    <>
      {/* Discount Banner */}
      <div className="bg-gray-100 text-center py-2 text-sm text-gray-700">
        &lt; Use code <span className="font-bold">WELLCOME</span> to get 10%
        discount &gt;
      </div>

      {/* Main Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-300 bg-white">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="text-xl cursor-pointer">&lt;</div>
          <div className="flex space-x-2">
            <img
              src="https://via.placeholder.com/20?text=FB"
              alt="Facebook"
              className="w-5 h-5"
            />
            <img
              src="https://via.placeholder.com/20?text=IG"
              alt="Instagram"
              className="w-5 h-5"
            />
          </div>
          <div className="text-xl cursor-pointer">🔍</div>
        </div>

        {/* Center Section */}
        <div className="text-center">
          <div className="text-4xl font-bold text-black leading-none">
            offon
          </div>
          <div className="text-xs text-gray-600">MARRIED TO THE STREET</div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-700">Vietnam | USD $</div>
          <div className="text-2xl cursor-pointer">🛒</div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="flex justify-center space-x-6 py-4 text-gray-700">
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
