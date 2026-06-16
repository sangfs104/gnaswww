"use client"; // Nếu dùng useState, useEffect...

import React from "react";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow">
        <h1 className="text-3xl font-bold text-center mb-8">Đăng ký</h1>
        {/* Nội dung form đăng ký của bạn */}
        <p className="text-center text-gray-600">
          Form đăng ký đang phát triển...
        </p>
      </div>
    </div>
  );
}
