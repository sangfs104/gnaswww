// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const ProfileUser = () => {
//   const router = useRouter();
//   const [user, setUser] = useState<{
//     id: string;
//     name: string;
//     email: string;
//   } | null>(null);

//   // Load user từ localStorage
//   useEffect(() => {
//     const storedUser =
//       typeof window !== "undefined" ? localStorage.getItem("user") : null;
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleLogout = () => {
//     // Xóa user khỏi localStorage
//     localStorage.removeItem("user");
//     setUser(null);

//     // Redirect về login
//     router.push("/login");
//   };

//   if (!user) {
//     return (
//       <div className="text-center p-4">
//         Không tìm thấy thông tin người dùng.
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center">
//           Thông tin cá nhân
//         </h1>
//         <div className="space-y-4">
//           <div>
//             <label className="block mb-1 font-medium">ID:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.id}</p>
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Tên:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.name}</p>
//           </div>
//           <div>
//             <label className="block mb-1 font-medium">Email:</label>
//             <p className="border border-gray-300 p-2 rounded">{user.email}</p>
//           </div>
//         </div>

//         {/* Nút đăng xuất */}
//         <button
//           onClick={handleLogout}
//           className="mt-6 w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
//         >
//           Đăng xuất
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfileUser;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProfileUser = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses"
  >("profile");

  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null>(null);

  // Load user từ localStorage
  useEffect(() => {
    const storedUser =
      typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">
            Không tìm thấy thông tin người dùng.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header Profile */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image
              src={user.avatar || "/img/avatar-default.jpg"}
              alt={user.name}
              width={96}
              height={96}
              className="object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-semibold text-gray-900">
              {user.name}
            </h1>
            <p className="text-gray-600 mt-1">{user.email}</p>
            <p className="text-sm text-gray-500 mt-1">ID: {user.id}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl font-medium transition"
          >
            Đăng xuất
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex px-6">
              {[
                { id: "profile", label: "Thông tin cá nhân" },
                { id: "orders", label: "Đơn hàng của tôi" },
                { id: "addresses", label: "Địa chỉ" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-8 py-5 font-medium text-sm transition border-b-2 ${
                    activeTab === tab.id
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* ==================== TAB 1: THÔNG TIN CÁ NHÂN ==================== */}
            {activeTab === "profile" && (
              <div className="max-w-md">
                <h2 className="text-xl font-semibold mb-6">
                  Thông tin cá nhân
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Họ và tên
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user.name}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900">
                      {user.email}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      ID người dùng
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 font-mono">
                      {user.id}
                    </div>
                  </div>
                </div>

                <button className="mt-8 w-full py-3.5 bg-black text-white rounded-xl hover:bg-gray-800 transition">
                  Chỉnh sửa thông tin
                </button>
              </div>
            )}

            {/* ==================== TAB 2: ĐƠN HÀNG ==================== */}
            {activeTab === "orders" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Đơn hàng của tôi</h2>
                  <span className="text-sm text-gray-500">0 đơn hàng</span>
                </div>

                <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <div className="text-6xl mb-4">📦</div>
                  <p className="text-gray-500">Bạn chưa có đơn hàng nào</p>
                  <button
                    onClick={() => router.push("/")}
                    className="mt-4 text-black underline hover:text-gray-600"
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: ĐỊA CHỈ ==================== */}
            {activeTab === "addresses" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Sổ địa chỉ</h2>
                  <button className="px-5 py-2.5 bg-black text-white text-sm rounded-xl hover:bg-gray-800 transition flex items-center gap-2">
                    + Thêm địa chỉ mới
                  </button>
                </div>

                {/* Danh sách địa chỉ (demo) */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-2xl p-6 hover:border-black transition">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Nguyễn Văn A</p>
                        <p className="text-sm text-gray-600 mt-1">
                          0123 456 789
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full h-fit">
                        Mặc định
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-gray-600">
                      123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh
                    </p>
                    <div className="mt-5 flex gap-3">
                      <button className="text-sm text-blue-600 hover:underline">
                        Sửa
                      </button>
                      <button className="text-sm text-red-600 hover:underline">
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>

                {/** Nếu chưa có địa chỉ nào */}
                {/* <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <p className="text-gray-500">Bạn chưa có địa chỉ nào</p>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUser;
