// "use client";
// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// interface Variant {
//   _id: string;
//   size: string;
//   color: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   image?: string;
// }

// interface Product {
//   _id: string;
//   name: string;
//   images: string[];
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   description?: string;
//   variants?: Variant[];
// }

// interface CartItem {
//   _id: string;
//   product: Product | null;
//   variant?: Variant | null;
//   quantity: number;
// }

// interface CartData {
//   _id: string;
//   user: string;
//   items: CartItem[];
// }

// interface CartModalProps {
//   userId: string;
//   open: boolean;
//   onClose: () => void;
// }

// const CartModal: React.FC<CartModalProps> = ({ userId, open, onClose }) => {
//   const [cart, setCart] = useState<CartData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [quantityUpdates, setQuantityUpdates] = useState<{
//     [key: string]: number;
//   }>({});

//   // Lấy giỏ hàng
//   useEffect(() => {
//     if (!open) return;
//     setLoading(true);
//     fetch(`http://localhost:3000/api/cart/${userId}`, {
//       credentials: "include",
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
//         return res.json();
//       })
//       .then((data) => {
//         setCart(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [userId, open]);

//   // Thêm sản phẩm vào giỏ (ví dụ: thêm sản phẩm mới)
//   const handleAddToCart = async (productId: string, variantId?: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/api/cart/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           userId,
//           productId,
//           variantId,
//           quantity: 1,
//         }),
//       });
//       if (!response.ok) throw new Error("Không thể thêm sản phẩm");
//       const updatedCart = await response.json();
//       setCart(updatedCart);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Xóa sản phẩm khỏi giỏ
//   const handleRemoveFromCart = async (
//     itemId: string,
//     productId: string,
//     variantId?: string
//   ) => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/api/cart/remove", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           userId,
//           productId,
//           variantId,
//         }),
//       });
//       if (!response.ok) throw new Error("Không thể xóa sản phẩm");
//       const updatedCart = await response.json();
//       setCart(updatedCart);
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Cập nhật số lượng
//   const handleUpdateQuantity = async (
//     itemId: string,
//     productId: string,
//     variantId?: string,
//     newQuantity: number
//   ) => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:3000/api/cart/update", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({
//           userId,
//           productId,
//           variantId,
//           quantity: newQuantity,
//         }),
//       });
//       if (!response.ok) throw new Error("Không thể cập nhật số lượng");
//       const updatedCart = await response.json();
//       setCart(updatedCart);
//       setQuantityUpdates((prev) => ({ ...prev, [itemId]: newQuantity }));
//       setError(null);
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
//       <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
//         <button
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
//           onClick={onClose}
//         >
//           ×
//         </button>
//         <h2 className="text-lg font-bold mb-4">Giỏ hàng của bạn</h2>
//         {loading ? (
//           <div className="text-center text-gray-500">Đang tải...</div>
//         ) : error ? (
//           <div className="text-center text-red-500">{error}</div>
//         ) : !cart || !cart.items.length ? (
//           <div className="text-gray-500">Giỏ hàng trống.</div>
//         ) : (
//           <div>
//             <ul className="space-y-3 mb-4 max-h-64 overflow-y-auto">
//               {cart.items.map((item) =>
//                 !item.product ? null : (
//                   <li
//                     key={item._id}
//                     className="flex items-center space-x-3 py-2 border-b"
//                   >
//                     <Image
//                       src={
//                         item.variant?.image ||
//                         item.product.images?.[0] ||
//                         "/img/placeholder.jpg"
//                       }
//                       alt={item.product.name}
//                       width={48}
//                       height={48}
//                       className="rounded"
//                     />
//                     <div className="flex-1">
//                       <div className="font-semibold">{item.product.name}</div>
//                       {item.variant && (
//                         <div className="text-xs text-gray-500">
//                           {item.variant.size} / {item.variant.color}
//                         </div>
//                       )}
//                       <div className="text-xs">
//                         Số lượng:{" "}
//                         <input
//                           type="number"
//                           min="1"
//                           value={quantityUpdates[item._id] ?? item.quantity}
//                           onChange={(e) =>
//                             setQuantityUpdates((prev) => ({
//                               ...prev,
//                               [item._id]: Math.max(
//                                 1,
//                                 parseInt(e.target.value) || 1
//                               ),
//                             }))
//                           }
//                           className="w-16 p-1 border rounded text-xs"
//                         />
//                         <button
//                           onClick={() =>
//                             handleUpdateQuantity(
//                               item._id,
//                               item.product._id,
//                               item.variant?._id,
//                               quantityUpdates[item._id] ?? item.quantity
//                             )
//                           }
//                           className="ml-2 text-blue-500 text-xs hover:underline"
//                         >
//                           Cập nhật
//                         </button>
//                       </div>
//                       <div className="text-xs">
//                         Giá:{" "}
//                         <span className="font-bold text-red-600">
//                           {item.variant?.discountPrice ??
//                             item.product.discountPrice ??
//                             item.variant?.price ??
//                             item.product.price}{" "}
//                           ₫
//                         </span>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() =>
//                         handleRemoveFromCart(
//                           item._id,
//                           item.product._id,
//                           item.variant?._id
//                         )
//                       }
//                       className="text-red-500 hover:text-red-700 text-xs"
//                     >
//                       Xóa
//                     </button>
//                   </li>
//                 )
//               )}
//             </ul>
//             <div className="flex justify-between">
//               <button
//                 onClick={() =>
//                   handleAddToCart(cart.items[0]?.product._id || "")
//                 } // Ví dụ: thêm lại sản phẩm đầu tiên
//                 className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
//                 disabled={!cart.items.length}
//               >
//                 Thêm sản phẩm
//               </button>
//               <a
//                 href="/cart"
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//               >
//                 Xem giỏ hàng
//               </a>
//               <a
//                 href="/checkout"
//                 className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 text-sm"
//               >
//                 Thanh toán
//               </a>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CartModal;
