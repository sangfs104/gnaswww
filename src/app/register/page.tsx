// // "use client";

// // import React, { Suspense, useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import Link from "next/link";

// // function RegisterForm() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();

// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [confirmPassword, setConfirmPassword] = useState("");
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setError("");

// //     if (!name || !email || !password) {
// //       setError("Vui lòng điền đầy đủ thông tin.");
// //       return;
// //     }
// //     if (password.length < 6) {
// //       setError("Mật khẩu phải có ít nhất 6 ký tự.");
// //       return;
// //     }
// //     if (password !== confirmPassword) {
// //       setError("Mật khẩu nhập lại không khớp.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
// //         {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify({ name, email, password }),
// //         },
// //       );

// //       const data = await res.json();

// //       if (!res.ok) {
// //         setError(data.message || "Đăng ký thất bại");
// //         setLoading(false);
// //         return;
// //       }

// //       // Đăng ký xong -> tự động đăng nhập luôn (backend đã trả token)
// //       localStorage.setItem("token", data.token);
// //       localStorage.setItem("user", JSON.stringify(data.user));

// //       // Merge giỏ hàng khách (guest) vào tài khoản mới nếu có
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

// //       const redirect = searchParams.get("redirect") || "/";
// //       router.push(redirect);
// //     } catch (err) {
// //       console.error(err);
// //       setError("Có lỗi xảy ra. Vui lòng thử lại.");
// //       setLoading(false);
// //     }
// //   };

// //   const redirectParam = searchParams.get("redirect");
// //   const loginHref = redirectParam
// //     ? `/login?redirect=${encodeURIComponent(redirectParam)}`
// //     : "/login";

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
// //         <h1 className="text-2xl font-bold mb-6 text-center">Đăng ký</h1>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div>
// //             <label className="block mb-1 font-medium">Họ và tên</label>
// //             <input
// //               type="text"
// //               value={name}
// //               onChange={(e) => setName(e.target.value)}
// //               required
// //               className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

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
// //             <label className="block mb-1 font-medium">Mật khẩu</label>
// //             <input
// //               type="password"
// //               value={password}
// //               onChange={(e) => setPassword(e.target.value)}
// //               required
// //               className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           <div>
// //             <label className="block mb-1 font-medium">Nhập lại mật khẩu</label>
// //             <input
// //               type="password"
// //               value={confirmPassword}
// //               onChange={(e) => setConfirmPassword(e.target.value)}
// //               required
// //               className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //             />
// //           </div>

// //           {error && <p className="text-red-500 text-sm">{error}</p>}

// //           <button
// //             type="submit"
// //             disabled={loading}
// //             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
// //           >
// //             {loading ? "Đang đăng ký..." : "Đăng ký"}
// //           </button>

// //           <p className="text-sm text-center text-gray-600">
// //             Đã có tài khoản?{" "}
// //             <Link href={loginHref} className="text-blue-500 underline">
// //               Đăng nhập
// //             </Link>
// //           </p>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default function RegisterPage() {
// //   return (
// //     <Suspense fallback={null}>
// //       <RegisterForm />
// //     </Suspense>
// //   );
// // }
// "use client";

// import React, { Suspense, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";
// import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

// function RegisterForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!name || !email || !password || !confirmPassword) {
//       setError("Vui lòng điền đầy đủ thông tin.");
//       return;
//     }
//     if (password.length < 6) {
//       setError("Mật khẩu phải có ít nhất 6 ký tự.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Mật khẩu nhập lại không khớp.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ name, email, password }),
//         },
//       );

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.message || "Đăng ký thất bại");
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

//   const redirectParam = searchParams.get("redirect");
//   const loginHref = redirectParam
//     ? `/login?redirect=${encodeURIComponent(redirectParam)}`
//     : "/login";

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">
//           <div className="text-center mb-8">
//             <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4">
//               <User className="w-9 h-9 text-white" />
//             </div>
//             <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
//             <p className="text-gray-600 mt-2">
//               Tham gia ngay để mua sắm dễ dàng
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Họ và tên
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//                   placeholder="Nguyễn Văn A"
//                 />
//               </div>
//             </div>

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

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1.5">
//                 Nhập lại mật khẩu
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                   className="w-full pl-11 pr-12 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
//                   placeholder="••••••••"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showConfirmPassword ? (
//                     <EyeOff size={20} />
//                   ) : (
//                     <Eye size={20} />
//                   )}
//                 </button>
//               </div>
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
//               {loading ? <>Đang tạo tài khoản...</> : "Đăng ký"}
//             </button>
//           </form>

//           <p className="text-center text-sm text-gray-600 mt-8">
//             Đã có tài khoản?{" "}
//             <Link
//               href={loginHref}
//               className="text-blue-600 font-semibold hover:underline"
//             >
//               Đăng nhập ngay
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function RegisterPage() {
//   return (
//     <Suspense fallback={null}>
//       <RegisterForm />
//     </Suspense>
//   );
// }
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        setLoading(false);
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

  const redirectParam = searchParams.get("redirect");
  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-8 pt-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h1>
            <p className="text-gray-600 mt-2">
              Tham gia ngay để mua sắm dễ dàng
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Họ và tên
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="Nguyễn Văn A"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nhập lại mật khẩu
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-2xl focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 p-3.5 rounded-2xl border border-red-100">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-900 text-white py-4 rounded-2xl font-semibold text-lg transition-all disabled:opacity-70"
            >
              {loading ? "Đang tạo tài khoản..." : "Đăng ký"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-8">
            Đã có tài khoản?{" "}
            <Link
              href={loginHref}
              className="text-black font-semibold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
