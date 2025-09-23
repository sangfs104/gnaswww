"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Banner = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    "/img/banner1.jpg",
    "/img/banner2.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {images.map((src, index) => (
        <Image
          key={index}
          src={src}
          alt={`Banner ${index + 1}`}
          width={1200}
          height={400}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
            index === currentImage ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
};

export default Banner;