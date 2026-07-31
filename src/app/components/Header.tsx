// // // "use client";
// // // import React, { useState, useEffect } from "react";
// // // import { Search, ShoppingBag, User } from "lucide-react";
// // // import Image from "next/image";
// // // import Link from "next/link";
// // // import { useSelector } from "react-redux";
// // // import { RootState } from "../../redux/store";
// // // import { useRouter } from "next/navigation";

// // // // Định nghĩa type cho User và Cart
// // // interface UserType {
// // //   id?: string;
// // //   name?: string;
// // //   email?: string;
// // // }

// // // interface CartItem {
// // //   id: string | number;
// // //   quantity: number;
// // //   [key: string]: any;
// // // }

// // // interface CartType {
// // //   items: CartItem[];
// // // }

// // // const Header = () => {
// // //   const [currentMessage, setCurrentMessage] = useState(0);
// // //   const [cart, setCart] = useState<CartType>({ items: [] });
// // //   const [loggedInUser, setLoggedInUser] = useState<UserType | null>(null);
// // //   const [isMenuOpen, setIsMenuOpen] = useState(false);

// // //   const router = useRouter();
// // //   const reduxUser = useSelector((state: RootState) => state.auth.user);

// // //   // Lấy userId
// // //   let userId = "";
// // //   if (reduxUser?.id) {
// // //     userId = reduxUser.id;
// // //   } else if (typeof window !== "undefined") {
// // //     const localUser = localStorage.getItem("user");
// // //     if (localUser) {
// // //       const parsed = JSON.parse(localUser);
// // //       if (parsed?.id) userId = parsed.id;
// // //     }
// // //     if (!userId) {
// // //       userId = localStorage.getItem("guestId") || "";
// // //     }
// // //   }

// // //   // Lấy giỏ hàng
// // //   const fetchCart = async () => {
// // //     if (!userId) return;
// // //     try {
// // //       const res = await fetch(
// // //         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// // //         {
// // //           credentials: "include",
// // //         },
// // //       );
// // //       if (!res.ok) throw new Error("Failed to fetch cart");
// // //       const data = await res.json();
// // //       setCart(data);
// // //     } catch {
// // //       setCart({ items: [] });
// // //     }
// // //   };

// // //   useEffect(() => {
// // //     if (typeof window !== "undefined") {
// // //       const storedUser = localStorage.getItem("user");
// // //       if (storedUser) {
// // //         setLoggedInUser(JSON.parse(storedUser));
// // //       } else if (reduxUser) {
// // //         setLoggedInUser(reduxUser);
// // //       } else {
// // //         setLoggedInUser(null);
// // //       }
// // //     }
// // //     fetchCart();
// // //     // eslint-disable-next-line react-hooks/exhaustive-deps
// // //   }, [userId, reduxUser]);

// // //   // Lắng nghe sự kiện cập nhật giỏ hàng
// // //   useEffect(() => {
// // //     const handler = () => fetchCart();
// // //     window.addEventListener("cart-updated", handler);
// // //     return () => window.removeEventListener("cart-updated", handler);
// // //   }, []);

// // //   const cartCount = cart.items.reduce(
// // //     (sum, item) => sum + (item.quantity || 0),
// // //     0,
// // //   );

// // //   const messages = [
// // //     "Use code <span className='font-bold'>WELCOME</span> to get 10% discount",
// // //     "Free shipping on orders over $50",
// // //     "<span className='font-bold'>Use code SAVE20 for 20% off your first order</span>",
// // //     "Shop now and enjoy exclusive deals!",
// // //   ];

// // //   useEffect(() => {
// // //     const interval = setInterval(() => {
// // //       setCurrentMessage((prev) => (prev + 1) % messages.length);
// // //     }, 5000);
// // //     return () => clearInterval(interval);
// // //   }, []);

// // //   // Ngăn scroll khi menu mobile mở
// // //   useEffect(() => {
// // //     if (isMenuOpen) {
// // //       document.body.style.overflow = "hidden";
// // //     } else {
// // //       document.body.style.overflow = "auto";
// // //     }
// // //   }, [isMenuOpen]);

// // //   return (
// // //     <>
// // //       {/* Discount Banner */}
// // //       <div className="bg-gray-100 text-center py-2 text-xs sm:text-sm text-gray-700">
// // //         <div
// // //           className="transition-opacity duration-500"
// // //           dangerouslySetInnerHTML={{
// // //             __html: `&lt;&nbsp;${messages[currentMessage]}&nbsp;&gt;`,
// // //           }}
// // //         />
// // //       </div>

// // //       {/* Main Header */}
// // //       <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-60 py-4 border-b border-gray-700 bg-white relative">
// // //         {/* Left Section */}
// // //         <div className="flex items-center space-x-2 sm:space-x-4">
// // //           <button
// // //             onClick={() => setIsMenuOpen(!isMenuOpen)}
// // //             className="sm:hidden text-gray-700 focus:outline-none z-20"
// // //           >
// // //             <svg
// // //               className="w-6 h-6"
// // //               fill="none"
// // //               stroke="currentColor"
// // //               viewBox="0 0 24 24"
// // //             >
// // //               {isMenuOpen ? (
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M6 18L18 6M6 6l12 12"
// // //                 />
// // //               ) : (
// // //                 <path
// // //                   strokeLinecap="round"
// // //                   strokeLinejoin="round"
// // //                   strokeWidth="2"
// // //                   d="M4 6h16M4 12h16m-7 6h7"
// // //                 />
// // //               )}
// // //             </svg>
// // //           </button>
// // //           <Search size={16} className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
// // //           <div className="hidden sm:flex text-xs sm:text-sm text-gray-700">
// // //             Vietnam | USD $
// // //           </div>
// // //         </div>

// // //         {/* Center Section - Logo */}
// // //         {/* <div className="text-center">
// // //           <Image
// // //             width={400}
// // //             height={100}
// // //             src="/img/Logo typography cá m1.png"
// // //             alt="Offon Logo"
// // //             className="w-[300px] h-[75px] sm:w-[400px] sm:h-[100px] md:w-[500px] md:h-[125px] lg:w-[600px] lg:h-[150px] object-contain"
// // //           />
// // //         </div> */}
// // //         {/* Center Section - Logo */}
// // //         {/* Center Section - Logo */}
// // //         <div className="text-center group">
// // //           {/* <Image
// // //             width={520}
// // //             height={130}
// // //             src="/img/Logo typography cá m1.png"
// // //             alt="Offon Logo"
// // //             className="w-[340px] h-[85px]
// // //                sm:w-[450px] sm:h-[113px]
// // //                md:w-[560px] md:h-[140px]
// // //                lg:w-[660px] lg:h-[165px]
// // //                object-contain
// // //                animate-float
// // //                group-hover:rotate-[360deg]
// // //                group-hover:scale-110
// // //                transition-all duration-700 ease-out
// // //                group-hover:drop-shadow-2xl"
// // //           /> */}
// // //           <Image
// // //             width={520}
// // //             height={130}
// // //             src="/img/Logo typography cá m1.png"
// // //             alt="Offon Logo"
// // //             className="w-[680px] h-[170px]
// // //      sm:w-[440px] sm:h-[110px]
// // //      md:w-[480px] md:h-[120px]
// // //      lg:w-[520px] lg:h-[130px]
// // //      object-contain
// // //      animate-float
// // //      group-hover:rotate-[360deg]
// // //      group-hover:scale-110
// // //      transition-all duration-700 ease-out
// // //      group-hover:drop-shadow-2xl"
// // //           />
// // //         </div>
// // //         {/* Right Section */}
// // //         <div className="flex items-center space-x-2 sm:space-x-4">
// // //           <div className="relative">
// // //             {loggedInUser?.name ? (
// // //               <span
// // //                 className="text-xs sm:text-sm cursor-pointer hover:underline"
// // //                 onClick={() => router.push("/profile")}
// // //               >
// // //                 {loggedInUser.name}
// // //               </span>
// // //             ) : (
// // //               <User
// // //                 size={16}
// // //                 className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
// // //                 onClick={() => router.push("/login")}
// // //               />
// // //             )}
// // //           </div>
// // //           <div className="relative">
// // //             <ShoppingBag
// // //               size={16}
// // //               className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer"
// // //               onClick={() => router.push("/cart")}
// // //             />
// // //             {cartCount > 0 && (
// // //               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
// // //                 {cartCount}
// // //               </span>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </header>

// // //       {/* Mobile Navigation Menu */}
// // //       <nav
// // //         className={`sm:hidden fixed top-[140px] left-0 h-[calc(100%-100px)] w-screen bg-white shadow-lg z-10 p-4 ${
// // //           isMenuOpen ? "block" : "hidden"
// // //         }`}
// // //       >
// // //         <Link
// // //           href="/products"
// // //           className="block py-2 hover:underline"
// // //           onClick={() => setIsMenuOpen(false)}
// // //         >
// // //           SHOP
// // //         </Link>
// // //         <a
// // //           href="#"
// // //           className="block py-2 hover:underline"
// // //           onClick={() => setIsMenuOpen(false)}
// // //         >
// // //           CONTACT
// // //         </a>
// // //         <a
// // //           href="#"
// // //           className="block py-2 hover:underline"
// // //           onClick={() => setIsMenuOpen(false)}
// // //         >
// // //           TERMS & SHIPPING
// // //         </a>
// // //         <a
// // //           href="#"
// // //           className="block py-2 hover:underline"
// // //           onClick={() => setIsMenuOpen(false)}
// // //         >
// // //           ABOUT US
// // //         </a>
// // //       </nav>

// // //       {/* Desktop Navigation */}
// // //       <nav className="hidden sm:flex justify-center space-x-4 sm:space-x-6 py-4 text-gray-700 text-xs sm:text-sm">
// // //         <Link href="/products" className="hover:underline">
// // //           SHOP
// // //         </Link>
// // //         <a href="#" className="hover:underline">
// // //           CONTACT
// // //         </a>
// // //         <a href="#" className="hover:underline">
// // //           TERMS & SHIPPING
// // //         </a>
// // //         <a href="#" className="hover:underline">
// // //           ABOUT US
// // //         </a>
// // //       </nav>
// // //     </>
// // //   );
// // // };

// // // export default Header;

// // "use client";

// // import React, { useState, useEffect } from "react";
// // import { Search, ShoppingBag, User } from "lucide-react";
// // import Image from "next/image";
// // import Link from "next/link";
// // import { useSelector } from "react-redux";
// // import { RootState } from "../../redux/store";
// // import { useRouter } from "next/navigation";
// // import { getUser, getGuestId, StoredUser } from "@/lib/auth";

// // interface CartItem {
// //   id: string | number;
// //   quantity: number;
// //   [key: string]: any;
// // }

// // interface CartType {
// //   items: CartItem[];
// // }

// // const Header = () => {
// //   const [currentMessage, setCurrentMessage] = useState(0);
// //   const [cart, setCart] = useState<CartType>({ items: [] });
// //   const [loggedInUser, setLoggedInUser] = useState<StoredUser | null>(null);
// //   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const router = useRouter();
// //   const reduxUser = useSelector((state: RootState) => state.auth.user);

// //   let userId = "";
// //   if (reduxUser?.id) {
// //     userId = reduxUser.id;
// //   } else if (typeof window !== "undefined") {
// //     const authUser = getUser();
// //     if (authUser?.id) {
// //       userId = authUser.id;
// //     } else {
// //       userId = getGuestId();
// //     }
// //   }

// //   const fetchCart = async () => {
// //     if (!userId) return;
// //     try {
// //       const res = await fetch(
// //         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
// //         {
// //           credentials: "include",
// //         },
// //       );
// //       if (!res.ok) throw new Error("Failed to fetch cart");
// //       const data = await res.json();
// //       setCart(data);
// //     } catch {
// //       setCart({ items: [] });
// //     }
// //   };

// //   useEffect(() => {
// //     if (typeof window !== "undefined") {
// //       const authUser = getUser();
// //       if (authUser) {
// //         setLoggedInUser(authUser);
// //       } else if (reduxUser) {
// //         setLoggedInUser(reduxUser);
// //       } else {
// //         setLoggedInUser(null);
// //       }
// //     }
// //     fetchCart();
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [userId, reduxUser]);

// //   useEffect(() => {
// //     const handler = () => fetchCart();
// //     window.addEventListener("cart-updated", handler);
// //     return () => window.removeEventListener("cart-updated", handler);
// //   }, []);

// //   const cartCount = cart.items.reduce(
// //     (sum, item) => sum + (item.quantity || 0),
// //     0,
// //   );

// //   const messages = [
// //     "Use code <span className='font-bold'>WELCOME</span> to get 10% discount",
// //     "Free shipping on orders over $50",
// //     "<span className='font-bold'>Use code SAVE20 for 20% off your first order</span>",
// //     "Shop now and enjoy exclusive deals!",
// //   ];

// //   useEffect(() => {
// //     const interval = setInterval(() => {
// //       setCurrentMessage((prev) => (prev + 1) % messages.length);
// //     }, 5000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   useEffect(() => {
// //     if (isMenuOpen) {
// //       document.body.style.overflow = "hidden";
// //     } else {
// //       document.body.style.overflow = "auto";
// //     }
// //   }, [isMenuOpen]);

// //   return (
// //     <>
// //       {/* Discount Banner */}
// //       <div className="bg-gray-100 text-center py-2 text-xs sm:text-sm text-gray-700">
// //         <div
// //           className="transition-opacity duration-500"
// //           dangerouslySetInnerHTML={{
// //             __html: `&lt;&nbsp;${messages[currentMessage]}&nbsp;&gt;`,
// //           }}
// //         />
// //       </div>

// //       {/* Main Header */}
// //       <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-60 py-4 border-b border-gray-700 bg-white relative">
// //         {/* Left Section */}
// //         <div className="flex items-center space-x-2 sm:space-x-4">
// //           <button
// //             onClick={() => setIsMenuOpen(!isMenuOpen)}
// //             className="sm:hidden text-gray-700 focus:outline-none z-20"
// //           >
// //             <svg
// //               className="w-6 h-6"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               {isMenuOpen ? (
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M6 18L18 6M6 6l12 12"
// //                 />
// //               ) : (
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth="2"
// //                   d="M4 6h16M4 12h16m-7 6h7"
// //                 />
// //               )}
// //             </svg>
// //           </button>
// //           <Search size={16} className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
// //           <div className="hidden sm:flex text-xs sm:text-sm text-gray-700">
// //             Vietnam | USD $
// //           </div>
// //         </div>

// //         {/* Center Section - Logo */}
// //         <div className="text-center group">
// //           <Image
// //             width={520}
// //             height={130}
// //             src="/img/Logo typography cá m1.png"
// //             alt="Offon Logo"
// //             className="w-[680px] h-[170px] sm:w-[440px] sm:h-[110px] md:w-[480px] md:h-[120px] lg:w-[520px] lg:h-[130px] object-contain animate-float group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 ease-out group-hover:drop-shadow-2xl"
// //           />
// //         </div>

// //         {/* Right Section */}
// //         <div className="flex items-center space-x-2 sm:space-x-4">
// //           <div className="relative">
// //             {loggedInUser?.name ? (
// //               <span
// //                 className="text-xs sm:text-sm cursor-pointer hover:underline"
// //                 onClick={() => router.push("/profile")}
// //               >
// //                 {loggedInUser.name}
// //               </span>
// //             ) : (
// //               <User
// //                 size={16}
// //                 className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
// //                 onClick={() => router.push("/login")}
// //               />
// //             )}
// //           </div>
// //           <div className="relative">
// //             <ShoppingBag
// //               size={16}
// //               className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer"
// //               onClick={() => router.push("/cart")}
// //             />
// //             {cartCount > 0 && (
// //               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
// //                 {cartCount}
// //               </span>
// //             )}
// //           </div>
// //         </div>
// //       </header>

// //       {/* Mobile Navigation Menu */}
// //       <nav
// //         className={`sm:hidden fixed top-[140px] left-0 h-[calc(100%-100px)] w-screen bg-white shadow-lg z-10 p-4 ${
// //           isMenuOpen ? "block" : "hidden"
// //         }`}
// //       >
// //         <Link
// //           href="/products"
// //           className="block py-2 hover:underline"
// //           onClick={() => setIsMenuOpen(false)}
// //         >
// //           SHOP
// //         </Link>

// //         <a
// //           href="#"
// //           className="block py-2 hover:underline"
// //           onClick={() => setIsMenuOpen(false)}
// //         >
// //           CONTACT
// //         </a>

// //         <a
// //           href="#"
// //           className="block py-2 hover:underline"
// //           onClick={() => setIsMenuOpen(false)}
// //         >
// //           TERMS & SHIPPING
// //         </a>

// //         <a
// //           href="#"
// //           className="block py-2 hover:underline"
// //           onClick={() => setIsMenuOpen(false)}
// //         >
// //           ABOUT US
// //         </a>
// //       </nav>

// //       {/* Desktop Navigation */}
// //       <nav className="hidden sm:flex justify-center space-x-4 sm:space-x-6 py-4 text-gray-700 text-xs sm:text-sm">
// //         <Link href="/products" className="hover:underline">
// //           SHOP
// //         </Link>
// //         <a href="#" className="hover:underline">
// //           CONTACT
// //         </a>
// //         <a href="#" className="hover:underline">
// //           TERMS & SHIPPING
// //         </a>
// //         <a href="#" className="hover:underline">
// //           ABOUT US
// //         </a>
// //       </nav>
// //     </>
// //   );
// // };

// // export default Header;
// "use client";

// import React, { useState, useEffect } from "react";
// import { Search, ShoppingBag, User } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { useRouter } from "next/navigation";
// import { getUser, getGuestId, StoredUser } from "@/lib/auth";

// interface CartItem {
//   id: string | number;
//   quantity: number;
//   [key: string]: any;
// }

// interface CartType {
//   items: CartItem[];
// }

// const Header = () => {
//   const [cart, setCart] = useState<CartType>({ items: [] });
//   const [loggedInUser, setLoggedInUser] = useState<StoredUser | null>(null);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const router = useRouter();
//   const reduxUser = useSelector((state: RootState) => state.auth.user);

//   let userId = "";
//   if (reduxUser?.id) {
//     userId = reduxUser.id;
//   } else if (typeof window !== "undefined") {
//     const authUser = getUser();
//     if (authUser?.id) {
//       userId = authUser.id;
//     } else {
//       userId = getGuestId();
//     }
//   }

//   const fetchCart = async () => {
//     if (!userId) return;
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//         {
//           credentials: "include",
//         },
//       );
//       if (!res.ok) throw new Error("Failed to fetch cart");
//       const data = await res.json();
//       setCart(data);
//     } catch {
//       setCart({ items: [] });
//     }
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const authUser = getUser();
//       if (authUser) {
//         setLoggedInUser(authUser);
//       } else if (reduxUser) {
//         setLoggedInUser(reduxUser);
//       } else {
//         setLoggedInUser(null);
//       }
//     }
//     fetchCart();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId, reduxUser]);

//   useEffect(() => {
//     const handler = () => fetchCart();
//     window.addEventListener("cart-updated", handler);
//     return () => window.removeEventListener("cart-updated", handler);
//   }, []);

//   const cartCount = cart.items.reduce(
//     (sum, item) => sum + (item.quantity || 0),
//     0,
//   );

//   useEffect(() => {
//     if (isMenuOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//   }, [isMenuOpen]);

//   return (
//     <>
//       {/* Main Header */}
//       <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-60 py-4 border-b border-gray-700 bg-white relative">
//         {/* Left Section */}
//         <div className="flex items-center space-x-2 sm:space-x-4">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="sm:hidden text-gray-700 focus:outline-none z-20"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               {isMenuOpen ? (
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               ) : (
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M4 6h16M4 12h16m-7 6h7"
//                 />
//               )}
//             </svg>
//           </button>
//           <Search size={16} className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
//           <div className="hidden sm:flex text-xs sm:text-sm text-gray-700">
//             Vietnam | USD $
//           </div>
//         </div>

//         {/* Center Section - Logo */}
//         <div className="text-center group">
//           <Image
//             width={520}
//             height={130}
//             src="/img/Logo typography cá m1.png"
//             alt="Offon Logo"
//             className="w-[680px] h-[170px] sm:w-[440px] sm:h-[110px] md:w-[480px] md:h-[120px] lg:w-[520px] lg:h-[130px] object-contain animate-float group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 ease-out group-hover:drop-shadow-2xl"
//           />
//         </div>

//         {/* Right Section */}
//         <div className="flex items-center space-x-2 sm:space-x-4">
//           <div className="relative">
//             {loggedInUser?.name ? (
//               <span
//                 className="text-xs sm:text-sm cursor-pointer hover:underline"
//                 onClick={() => router.push("/profile")}
//               >
//                 {loggedInUser.name}
//               </span>
//             ) : (
//               <User
//                 size={16}
//                 className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
//                 onClick={() => router.push("/login")}
//               />
//             )}
//           </div>
//           <div className="relative">
//             <ShoppingBag
//               size={16}
//               className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer"
//               onClick={() => router.push("/cart")}
//             />
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
//                 {cartCount}
//               </span>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Mobile Navigation Menu */}
//       <nav
//         className={`sm:hidden fixed top-[140px] left-0 h-[calc(100%-100px)] w-screen bg-white shadow-lg z-10 p-4 ${
//           isMenuOpen ? "block" : "hidden"
//         }`}
//       >
//         <Link
//           href="/products"
//           className="block py-2 hover:underline"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           SHOP
//         </Link>

//         <a
//           href="#"
//           className="block py-2 hover:underline"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           CONTACT
//         </a>

//         <a
//           href="#"
//           className="block py-2 hover:underline"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           TERMS & SHIPPING
//         </a>

//         <a
//           href="#"
//           className="block py-2 hover:underline"
//           onClick={() => setIsMenuOpen(false)}
//         >
//           ABOUT US
//         </a>
//       </nav>

//       {/* Desktop Navigation */}
//       <nav className="hidden sm:flex justify-center space-x-4 sm:space-x-6 py-4 text-gray-700 text-xs sm:text-sm">
//         <Link href="/products" className="hover:underline">
//           SHOP
//         </Link>
//         <a href="#" className="hover:underline">
//           CONTACT
//         </a>
//         <a href="#" className="hover:underline">
//           TERMS & SHIPPING
//         </a>
//         <a href="#" className="hover:underline">
//           ABOUT US
//         </a>
//       </nav>
//     </>
//   );
// };

// export default Header;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, ShoppingBag, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useRouter } from "next/navigation";
import {
  getUser,
  getGuestId,
  getToken,
  validateAuth,
  clearAuth,
  StoredUser,
} from "@/lib/auth";

interface CartItem {
  id?: string | number;
  _id?: string;
  quantity: number;
  [key: string]: any;
}

interface CartType {
  items: CartItem[];
}

const Header = () => {
  const [cart, setCart] = useState<CartType>({ items: [] });
  const [loggedInUser, setLoggedInUser] = useState<StoredUser | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const reduxUser = useSelector((state: RootState) => state.auth.user);

  // Lấy userId ưu tiên: redux → localStorage → guest
  const resolveUserId = useCallback(() => {
    if (reduxUser?.id) return reduxUser.id;
    const authUser = getUser();
    if (authUser?.id) return authUser.id;
    return getGuestId();
  }, [reduxUser]);

  const fetchCart = useCallback(async () => {
    const userId = resolveUserId();
    if (!userId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
        { credentials: "include", cache: "no-store" },
      );
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart({ items: data.items || data || [] });
    } catch {
      setCart({ items: [] });
    }
  }, [resolveUserId]);

  // Validate token khi mount + khi reduxUser đổi
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // Có token → validate với server
      if (getToken()) {
        const validUser = await validateAuth();
        if (!cancelled) {
          setLoggedInUser(validUser);
          setAuthChecked(true);
        }
      } else {
        // Không có token → dùng redux hoặc null
        if (!cancelled) {
          setLoggedInUser(reduxUser || null);
          setAuthChecked(true);
        }
      }
      fetchCart();
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [reduxUser, fetchCart]);

  // Lắng nghe cart-updated
  useEffect(() => {
    const handler = () => fetchCart();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [fetchCart]);

  // Lắng nghe auth thay đổi (login/logout từ trang khác)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        if (!getToken()) {
          setLoggedInUser(null);
        } else {
          validateAuth().then(setLoggedInUser);
        }
        fetchCart();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchCart]);

  const cartCount = cart.items.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0,
  );

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
  }, [isMenuOpen]);

  return (
    <>
      <header className="flex justify-between items-center px-4 sm:px-8 md:px-16 lg:px-60 py-4 border-b border-gray-700 bg-white relative">
        {/* Left */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden text-gray-700 focus:outline-none z-20"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
          <Search size={16} className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer" />
          <div className="hidden sm:flex text-xs sm:text-sm text-gray-700">
            Vietnam | USD $
          </div>
        </div>

        {/* Logo */}
        <div className="text-center group">
          <Image
            width={520}
            height={130}
            src="/img/Logo typography cá m1.png"
            alt="Offon Logo"
            className="w-[680px] h-[170px] sm:w-[440px] sm:h-[110px] md:w-[480px] md:h-[120px] lg:w-[520px] lg:h-[130px] object-contain animate-float group-hover:rotate-[360deg] group-hover:scale-110 transition-all duration-700 ease-out group-hover:drop-shadow-2xl"
          />
        </div>

        {/* Right */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="relative">
            {authChecked && loggedInUser?.name ? (
              <span
                className="text-xs sm:text-sm cursor-pointer hover:underline"
                onClick={() => router.push("/profile")}
              >
                {loggedInUser.name}
              </span>
            ) : (
              <User
                size={16}
                className="w-4 h-4 sm:w-5 sm:h-5 cursor-pointer"
                onClick={() => router.push("/login")}
              />
            )}
          </div>
          <div className="relative">
            <ShoppingBag
              size={16}
              className="w-6 h-6 sm:w-5 sm:h-5 cursor-pointer"
              onClick={() => router.push("/cart")}
            />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-1 text-xs">
                {cartCount}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <nav
        className={`sm:hidden fixed top-[140px] left-0 h-[calc(100%-100px)] w-screen bg-white shadow-lg z-10 p-4 ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <Link
          href="/products"
          className="block py-2 hover:underline"
          onClick={() => setIsMenuOpen(false)}
        >
          SHOP
        </Link>
        <a
          href="#"
          className="block py-2 hover:underline"
          onClick={() => setIsMenuOpen(false)}
        >
          CONTACT
        </a>
        <a
          href="#"
          className="block py-2 hover:underline"
          onClick={() => setIsMenuOpen(false)}
        >
          TERMS & SHIPPING
        </a>
        <a
          href="#"
          className="block py-2 hover:underline"
          onClick={() => setIsMenuOpen(false)}
        >
          ABOUT US
        </a>
      </nav>

      {/* Desktop nav */}
      <nav className="hidden sm:flex justify-center space-x-4 sm:space-x-6 py-4 text-gray-700 text-xs sm:text-sm">
        <Link href="/products" className="hover:underline">
          SHOP
        </Link>
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
