// // "use client";

// // import React, { Suspense, useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";

// // function LoginForm() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setLoading(true);
// //     setError("");

// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({ email, password }),
// //         },
// //       );

// //       const data = await res.json();

// //       if (!res.ok) {
// //         setError(data.message || "Login thất bại");
// //         setLoading(false);
// //         return;
// //       }

// //       // Lưu token và user vào localStorage
// //       localStorage.setItem("token", data.token);
// //       localStorage.setItem("user", JSON.stringify(data.user));

// //       // Nếu có guestId thì merge giỏ hàng guest vào user
// //       const guestId = localStorage.getItem("guestId");
// //       if (guestId) {
// //         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`, {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ guestId, userId: data.user.id }),
// //         });
// //         localStorage.removeItem("guestId");
// //       }

// //       window.dispatchEvent(new Event("cart-updated"));

// //       // Đăng nhập thành công → quay lại trang trước đó (nếu có), mặc định về trang chủ
// //       const redirect = searchParams.get("redirect") || "/";
// //       router.push(redirect);
// //     } catch (err) {
// //       console.error(err);
// //       setError("Có lỗi xảy ra. Vui lòng thử lại.");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
// //         <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h1>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block mb-1 font-medium">Email</label>
// //             <input
// //               type="email"
// //               value={email}
// //               onChange={(e) => setEmail(e.target.value)}
// //               required
// //               className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           <div>
// //             <label className="block mb-1 font-medium">Mật khẩu :</label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //               className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>
// //           {error && <p className="text-red-500 text-sm">{error}</p>}
// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
// //           >
// //             {loading ? "Đang đăng nhập..." : "Đăng nhập"}
// //           </button>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function LoginPage() {
// //   return (
// //     <Suspense fallback={null}>
// //       <LoginForm />
// //     </Suspense>
// //   );
// // }
// "use client";

// import React, { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, Mail, Lock } from "lucide-react";

// function LoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ email, password }),
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Đăng nhập thất bại");
//         setLoading(false);
//         return;
//       }

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       const guestId = localStorage.getItem("guestId");
//       if (guestId) {
//         await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ guestId, userId: data.user.id }),
//         });
//         localStorage.removeItem("guestId");
//       }

//       window.dispatchEvent(new Event("cart-updated"));

//       const redirect = searchParams.get("redirect") || "/";
//       router.push(redirect);
//     } catch (err) {
//       console.error(err);
//       setError("Có lỗi xảy ra. Vui lòng thử lại.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
//           <div className="text-center mb-8">
//             <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
//               <Lock className="w-9 h-9 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               Chào mừng trở lại
//             </h1>
//             <p className="text-gray-600 mt-2">Đăng nhập để tiếp tục mua sắm</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//                   placeholder="example@email.com"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Mật khẩu
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//             </div>

//             <div className="flex items-center justify-between text-sm">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={rememberMe}
//                   onChange={(e) => setRememberMe(e.target.checked)}
//                   className="w-4 h-4 accent-blue-600"
//                 />
//                 <span className="text-gray-600">Ghi nhớ tôi</span>
//               </label>
//               <Link
//                 href="/forgot-password"
//                 className="text-blue-600 hover:underline"
//               >
//                 Quên mật khẩu?
//               </Link>
//             </div>

//             {error && (
//               <p className="text-red-500 text-sm bg-red-50 p-3 rounded-2xl border border-red-100">
//                 {error}
//               </p>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-2xl font-semibold text-lg hover:brightness-105 transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
//             >
//               {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 mt-8">
//             Chưa có tài khoản?{" "}
//             <Link
//               href="/register"
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Đăng ký ngay
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function LoginPage() {
//   return (
//     <Suspense fallback={null}>
//       <LoginForm />
//     </Suspense>
//   );
// }
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      const guestId = localStorage.getItem("guestId");
      if (guestId) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guestId, userId: data.user.id }),
        });
        localStorage.removeItem("guestId");
      }

      window.dispatchEvent(new Event("cart-updated"));

      const redirect = searchParams.get("redirect") || "/";
      router.push(redirect);
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-10">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="mx-auto w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-5">
              <Lock className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Đăng nhập</h1>
            <p className="text-gray-600 mt-2">Chào mừng bạn trở lại</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-gray-600">Ghi nhớ tôi</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-gray-600 hover:text-black hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3.5 rounded-2xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-70 mt-2"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Chưa có tài khoản?{" "}
            <Link
              href="/register"
              className="text-black font-semibold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
