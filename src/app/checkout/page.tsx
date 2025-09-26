// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { useRouter } from "next/navigation";

// // // const getUserId = () => {
// // //   if (typeof window !== "undefined") {
// // //     const user = JSON.parse(localStorage.getItem("user") || "null");
// // //     if (user?.id) return user.id;
// // //     return localStorage.getItem("guestId") || "";
// // //   }
// // //   return "";
// // // };

// // // const CheckoutPage = () => {
// // //   const router = useRouter();
// // //   const userId = getUserId();
// // //   const [cartItems, setCartItems] = useState<any[]>([]);
// // //   const [address, setAddress] = useState<any>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);

// // //   // Lấy giỏ hàng từ API để có đầy đủ thông tin sản phẩm
// // //   useEffect(() => {
// // //     const fetchCart = async () => {
// // //       try {
// // //         const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
// // //           credentials: "include",
// // //         });
// // //         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// // //         const data = await res.json();
// // //         setCartItems(data.items || []);
// // //       } catch (err: any) {
// // //         setError(err.message);
// // //       }
// // //     };

// // //     const fetchAddress = async () => {
// // //       const token = localStorage.getItem("token");
// // //       if (!token) {
// // //         setError("Không có token. Vui lòng đăng nhập lại.");
// // //         setLoading(false);
// // //         return;
// // //       }
// // //       try {
// // //         const res = await fetch("http://localhost:3000/api/address", {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //           body: JSON.stringify({
// // //             userId,
// // //             fullName: "Nguyen Van A",
// // //             address: "123 Duong ABC",
// // //             city: "Ha Noi",
// // //             country: "Viet Nam",
// // //             phone: "0909123456",
// // //             isDefault: true,
// // //           }),
// // //         });
// // //         if (!res.ok) {
// // //           const errorData = await res.json();
// // //           throw new Error(errorData.message || "Không thể tải địa chỉ");
// // //         }
// // //         const data = await res.json();
// // //         setAddress(data);
// // //       } catch (err: any) {
// // //         setError(err.message);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchCart();
// // //     fetchAddress();
// // //   }, [userId]);

// // //   const subtotal = cartItems.reduce(
// // //     (total, item) =>
// // //       total +
// // //       ((item.variant?.discountPrice &&
// // //       item.variant?.discountPrice < item.variant?.price
// // //         ? item.variant.discountPrice
// // //         : item.variant?.price) ||
// // //         (item.product?.discountPrice &&
// // //         item.product?.discountPrice < item.product?.price
// // //           ? item.product.discountPrice
// // //           : item.product?.price) ||
// // //         0) *
// // //         item.quantity,
// // //     0
// // //   );

// // //   const handleCheckout = async (e: React.FormEvent) => {
// // //     e.preventDefault();
// // //     const token = localStorage.getItem("token");
// // //     if (!address || cartItems.length === 0 || !token) {
// // //       setError("Vui lòng kiểm tra giỏ hàng, địa chỉ, hoặc đăng nhập lại.");
// // //       return;
// // //     }

// // //     try {
// // //       const res = await fetch("http://localhost:3000/api/orders", {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({
// // //           userId,
// // //           items: cartItems,
// // //           address,
// // //           totalPrice: subtotal,
// // //         }),
// // //       });
// // //       if (!res.ok) throw new Error("Thanh toán thất bại");
// // //       const data = await res.json();
// // //       alert("Đặt hàng thành công!");
// // //       router.push("/order-confirmation");
// // //     } catch (err: any) {
// // //       setError(err.message);
// // //     }
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="min-h-screen bg-white flex justify-center items-center">
// // //         Đang tải...
// // //       </div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
// // //         Lỗi: {error}
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-white">
// // //       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
// // //         <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

// // //         <div className="mb-6">
// // //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// // //             Giỏ hàng của bạn
// // //           </h2>
// // //           {cartItems.length === 0 ? (
// // //             <p className="text-gray-600">Giỏ hàng trống.</p>
// // //           ) : (
// // //             <div className="space-y-4">
// // //               {cartItems.map((item) => (
// // //                 <div
// // //                   key={item._id}
// // //                   className="flex items-center space-x-4 border-b pb-3"
// // //                 >
// // //                   <img
// // //                     src={
// // //                       item.variant?.image ||
// // //                       item.product?.images?.[0] ||
// // //                       "/img/placeholder.jpg"
// // //                     }
// // //                     alt={item.product?.name || "Sản phẩm"}
// // //                     className="w-16 h-16 object-cover rounded"
// // //                   />
// // //                   <div className="flex-1">
// // //                     <div className="font-semibold">{item.product?.name}</div>
// // //                     {item.variant && (
// // //                       <div className="text-xs text-gray-500">
// // //                         {item.variant.size} / {item.variant.color}
// // //                       </div>
// // //                     )}
// // //                     <div className="text-xs text-gray-500">
// // //                       Số lượng: {item.quantity}
// // //                     </div>
// // //                   </div>
// // //                   <div className="font-semibold">
// // //                     $
// // //                     {(
// // //                       ((item.variant?.discountPrice &&
// // //                       item.variant?.discountPrice < item.variant?.price
// // //                         ? item.variant.discountPrice
// // //                         : item.variant?.price) ||
// // //                         (item.product?.discountPrice &&
// // //                         item.product?.discountPrice < item.product?.price
// // //                           ? item.product.discountPrice
// // //                           : item.product?.price) ||
// // //                         0) * item.quantity
// // //                     ).toFixed(2)}
// // //                   </div>
// // //                 </div>
// // //               ))}
// // //               <div className="flex justify-between font-semibold mt-4">
// // //                 <span>Tổng cộng</span>
// // //                 <span>${subtotal.toFixed(2)} USD</span>
// // //               </div>
// // //             </div>
// // //           )}
// // //         </div>

// // //         <div className="mb-6">
// // //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// // //             Địa chỉ giao hàng
// // //           </h2>
// // //           {address ? (
// // //             <div>
// // //               <p>{address.fullName}</p>
// // //               <p>{address.address}</p>
// // //               <p>
// // //                 {address.city}, {address.country}
// // //               </p>
// // //               <p>Phone: {address.phone}</p>
// // //             </div>
// // //           ) : (
// // //             <p className="text-gray-600">
// // //               Chưa có địa chỉ. Vui lòng thêm địa chỉ trước.
// // //             </p>
// // //           )}
// // //         </div>

// // //         <form onSubmit={handleCheckout} className="space-y-4">
// // //           <button
// // //             type="submit"
// // //             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
// // //             disabled={!address || cartItems.length === 0}
// // //           >
// // //             Xác nhận đặt hàng
// // //           </button>
// // //           {error && <p className="text-red-600 text-sm">{error}</p>}
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CheckoutPage;

// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // const getUserId = () => {
// //   if (typeof window !== "undefined") {
// //     const user = JSON.parse(localStorage.getItem("user") || "null");
// //     if (user?.id) return user.id;
// //     return localStorage.getItem("guestId") || "";
// //   }
// //   return "";
// // };

// // const CheckoutPage = () => {
// //   const router = useRouter();
// //   const userId = getUserId();
// //   const [cartItems, setCartItems] = useState([]);
// //   const [addresses, setAddresses] = useState([]);
// //   const [selectedAddress, setSelectedAddress] = useState("");
// //   const [useNewAddress, setUseNewAddress] = useState(false);
// //   const [newAddress, setNewAddress] = useState({
// //     fullName: "",
// //     phone: "",
// //     address: "",
// //     city: "",
// //     country: "",
// //     isDefault: false,
// //   });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   // Fetch giỏ hàng và danh sách địa chỉ
// //   useEffect(() => {
// //     const fetchCart = async () => {
// //       try {
// //         const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
// //           credentials: "include",
// //         });
// //         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
// //         const data = await res.json();
// //         setCartItems(data.items || []);
// //       } catch (err) {
// //         setError(err.message);
// //       }
// //     };

// //     const fetchAddresses = async () => {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         setError("Vui lòng đăng nhập lại.");
// //         router.push("/login");
// //         return;
// //       }
// //       try {
// //         const res = await fetch("http://localhost:3000/api/address", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //           credentials: "include",
// //         });
// //         if (!res.ok) {
// //           const errorData = await res.json();
// //           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
// //         }
// //         const data = await res.json();
// //         setAddresses(data);
// //         // Tự động chọn địa chỉ mặc định nếu có
// //         const defaultAddress = data.find((addr) => addr.isDefault);
// //         if (defaultAddress) setSelectedAddress(defaultAddress._id);
// //       } catch (err) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCart();
// //     fetchAddresses();
// //   }, [userId, router]);

// //   // Tính tổng giá
// //   const subtotal = cartItems.reduce(
// //     (total, item) =>
// //       total +
// //       ((item.variant?.discountPrice &&
// //       item.variant?.discountPrice < item.variant?.price
// //         ? item.variant.discountPrice
// //         : item.variant?.price) ||
// //         (item.product?.discountPrice &&
// //         item.product?.discountPrice < item.product?.price
// //           ? item.product.discountPrice
// //           : item.product?.price) ||
// //         0) *
// //         item.quantity,
// //     0
// //   );

// //   // Xử lý nhập địa chỉ mới
// //   const handleNewAddressChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setNewAddress((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   // Xử lý checkout
// //   const handleCheckout = async (e) => {
// //     e.preventDefault();
// //     const token = localStorage.getItem("token");
// //     if (!token) {
// //       setError("Vui lòng đăng nhập lại.");
// //       router.push("/login");
// //       return;
// //     }
// //     if (!selectedAddress && !useNewAddress) {
// //       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
// //       return;
// //     }
// //     if (cartItems.length === 0) {
// //       setError("Giỏ hàng trống.");
// //       return;
// //     }
// //     if (
// //       useNewAddress &&
// //       (!newAddress.fullName ||
// //         !newAddress.phone ||
// //         !newAddress.address ||
// //         !newAddress.city ||
// //         !newAddress.country)
// //     ) {
// //       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
// //       return;
// //     }

// //     try {
// //       const payload = {
// //         products: cartItems.map((item) => ({
// //           product: item.product._id,
// //           variant: item.variant._id,
// //           quantity: item.quantity,
// //         })),
// //         totalPrice: subtotal,
// //         ...(useNewAddress
// //           ? { newShippingAddress: newAddress }
// //           : { shippingAddress: selectedAddress }),
// //       };

// //       const res = await fetch("http://localhost:3000/api/orders", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         credentials: "include",
// //         body: JSON.stringify(payload),
// //       });

// //       if (!res.ok) {
// //         const errorData = await res.json();
// //         throw new Error(errorData.error || "Thanh toán thất bại");
// //       }

// //       const data = await res.json();
// //       alert("Đặt hàng thành công!");
// //       router.push("/order-confirmation");
// //     } catch (err) {
// //       setError(err.message);
// //     }
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen bg-white flex justify-center items-center">
// //         Đang tải...
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
// //         Lỗi: {error}
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white">
// //       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
// //         <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

// //         {/* Giỏ hàng */}
// //         <div className="mb-6">
// //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// //             Giỏ hàng của bạn
// //           </h2>
// //           {cartItems.length === 0 ? (
// //             <p className="text-gray-600">Giỏ hàng trống.</p>
// //           ) : (
// //             <div className="space-y-4">
// //               {cartItems.map((item) => (
// //                 <div
// //                   key={item._id}
// //                   className="flex items-center space-x-4 border-b pb-3"
// //                 >
// //                   <img
// //                     src={
// //                       item.variant?.image ||
// //                       item.product?.images?.[0] ||
// //                       "/img/placeholder.jpg"
// //                     }
// //                     alt={item.product?.name || "Sản phẩm"}
// //                     className="w-16 h-16 object-cover rounded"
// //                   />
// //                   <div className="flex-1">
// //                     <div className="font-semibold">{item.product?.name}</div>
// //                     {item.variant && (
// //                       <div className="text-xs text-gray-500">
// //                         {item.variant.size} / {item.variant.color}
// //                       </div>
// //                     )}
// //                     <div className="text-xs text-gray-500">
// //                       Số lượng: {item.quantity}
// //                     </div>
// //                   </div>
// //                   <div className="font-semibold">
// //                     $
// //                     {(
// //                       ((item.variant?.discountPrice &&
// //                       item.variant?.discountPrice < item.variant?.price
// //                         ? item.variant.discountPrice
// //                         : item.variant?.price) ||
// //                         (item.product?.discountPrice &&
// //                         item.product?.discountPrice < item.product?.price
// //                           ? item.product.discountPrice
// //                           : item.product?.price) ||
// //                         0) * item.quantity
// //                     ).toFixed(2)}
// //                   </div>
// //                 </div>
// //               ))}
// //               <div className="flex justify-between font-semibold mt-4">
// //                 <span>Tổng cộng</span>
// //                 <span>${subtotal.toFixed(2)} USD</span>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* Địa chỉ giao hàng */}
// //         <div className="mb-6">
// //           <h2 className="text-lg sm:text-xl font-semibold mb-4">
// //             Địa chỉ giao hàng
// //           </h2>
// //           {addresses.length > 0 && (
// //             <div className="mb-4">
// //               <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
// //               {addresses.map((addr) => (
// //                 <div key={addr._id} className="flex items-center mb-2">
// //                   <input
// //                     type="radio"
// //                     name="address"
// //                     value={addr._id}
// //                     checked={selectedAddress === addr._id}
// //                     onChange={() => {
// //                       setSelectedAddress(addr._id);
// //                       setUseNewAddress(false);
// //                     }}
// //                     className="mr-2"
// //                   />
// //                   <div>
// //                     <p className="font-semibold">{addr.fullName}</p>
// //                     <p>
// //                       {addr.address}, {addr.city}, {addr.country}
// //                     </p>
// //                     <p>SĐT: {addr.phone}</p>
// //                     {addr.isDefault && (
// //                       <span className="text-green-600 text-xs">[Mặc định]</span>
// //                     )}
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //           <div className="mb-4">
// //             <label className="flex items-center">
// //               <input
// //                 type="checkbox"
// //                 checked={useNewAddress}
// //                 onChange={() => setUseNewAddress(!useNewAddress)}
// //                 className="mr-2"
// //               />
// //               Nhập địa chỉ mới
// //             </label>
// //           </div>
// //           {useNewAddress && (
// //             <div className="space-y-4">
// //               <input
// //                 type="text"
// //                 name="fullName"
// //                 value={newAddress.fullName}
// //                 onChange={handleNewAddressChange}
// //                 placeholder="Họ và tên"
// //                 className="w-full border rounded px-3 py-2"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="phone"
// //                 value={newAddress.phone}
// //                 onChange={handleNewAddressChange}
// //                 placeholder="Số điện thoại"
// //                 className="w-full border rounded px-3 py-2"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="address"
// //                 value={newAddress.address}
// //                 onChange={handleNewAddressChange}
// //                 placeholder="Địa chỉ"
// //                 className="w-full border rounded px-3 py-2"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="city"
// //                 value={newAddress.city}
// //                 onChange={handleNewAddressChange}
// //                 placeholder="Thành phố"
// //                 className="w-full border rounded px-3 py-2"
// //                 required
// //               />
// //               <input
// //                 type="text"
// //                 name="country"
// //                 value={newAddress.country}
// //                 onChange={handleNewAddressChange}
// //                 placeholder="Quốc gia"
// //                 className="w-full border rounded px-3 py-2"
// //                 required
// //               />
// //               <label className="flex items-center">
// //                 <input
// //                   type="checkbox"
// //                   name="isDefault"
// //                   checked={newAddress.isDefault}
// //                   onChange={handleNewAddressChange}
// //                   className="mr-2"
// //                 />
// //                 Đặt làm địa chỉ mặc định
// //               </label>
// //             </div>
// //           )}
// //         </div>

// //         {/* Form thanh toán */}
// //         <form onSubmit={handleCheckout} className="space-y-4">
// //           <button
// //             type="submit"
// //             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
// //             disabled={
// //               cartItems.length === 0 || (!selectedAddress && !useNewAddress)
// //             }
// //           >
// //             Xác nhận đặt hàng
// //           </button>
// //           {error && <p className="text-red-600 text-sm">{error}</p>}
// //         </form>
// //       </div>
// //     </div>
// //   );
// // };

// // export default CheckoutPage;

// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const getUserId = () => {
//   if (typeof window !== "undefined") {
//     const user = JSON.parse(localStorage.getItem("user") || "null");
//     if (user?.id) return user.id;
//     return localStorage.getItem("guestId") || "";
//   }
//   return "";
// };

// const CheckoutPage = () => {
//   const router = useRouter();
//   const userId = getUserId();
//   const [cartItems, setCartItems] = useState([]);
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState("");
//   const [useNewAddress, setUseNewAddress] = useState(false);
//   const [newAddress, setNewAddress] = useState({
//     fullName: "",
//     phone: "",
//     address: "",
//     city: "",
//     country: "",
//     isDefault: false,
//   });
//   const [paymentMethod, setPaymentMethod] = useState("cash"); // Thêm state này
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch giỏ hàng và danh sách địa chỉ
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
//           credentials: "include",
//         });
//         if (!res.ok) throw new Error("Không thể tải giỏ hàng");
//         const data = await res.json();
//         setCartItems(data.items || []);
//       } catch (err) {
//         setError(err.message);
//       }
//     };

//     const fetchAddresses = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Vui lòng đăng nhập lại.");
//         router.push("/login");
//         return;
//       }
//       try {
//         const res = await fetch("http://localhost:3000/api/address", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });
//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
//         }
//         const data = await res.json();
//         setAddresses(data);
//         // Tự động chọn địa chỉ mặc định nếu có
//         const defaultAddress = data.find((addr) => addr.isDefault);
//         if (defaultAddress) setSelectedAddress(defaultAddress._id);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCart();
//     fetchAddresses();
//   }, [userId, router]);

//   // Tính tổng giá
//   const subtotal = cartItems.reduce(
//     (total, item) =>
//       total +
//       ((item.variant?.discountPrice &&
//       item.variant?.discountPrice < item.variant?.price
//         ? item.variant.discountPrice
//         : item.variant?.price) ||
//         (item.product?.discountPrice &&
//         item.product?.discountPrice < item.product?.price
//           ? item.product.discountPrice
//           : item.product?.price) ||
//         0) *
//         item.quantity,
//     0
//   );

//   // Xử lý nhập địa chỉ mới
//   const handleNewAddressChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setNewAddress((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Xử lý checkout
//   const handleCheckout = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setError("Vui lòng đăng nhập lại.");
//       router.push("/login");
//       return;
//     }
//     if (!selectedAddress && !useNewAddress) {
//       setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
//       return;
//     }
//     if (cartItems.length === 0) {
//       setError("Giỏ hàng trống.");
//       return;
//     }
//     if (
//       useNewAddress &&
//       (!newAddress.fullName ||
//         !newAddress.phone ||
//         !newAddress.address ||
//         !newAddress.city ||
//         !newAddress.country)
//     ) {
//       setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
//       return;
//     }
//     if (!paymentMethod) {
//       setError("Vui lòng chọn phương thức thanh toán.");
//       return;
//     }

//     try {
//       const payload = {
//         products: cartItems.map((item) => ({
//           product: item.product._id,
//           variant: item.variant._id,
//           quantity: item.quantity,
//         })),
//         totalPrice: subtotal,
//         paymentMethod, // Gửi lên backend
//         ...(useNewAddress
//           ? { newShippingAddress: newAddress }
//           : { shippingAddress: selectedAddress }),
//       };

//       const res = await fetch("http://localhost:3000/api/orders", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         credentials: "include",
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || "Thanh toán thất bại");
//       }

//       const data = await res.json();
//       alert("Đặt hàng thành công!");
//       router.push("/order-confirmation");
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center">
//         Đang tải...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
//         Lỗi: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
//         <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

//         {/* Giỏ hàng */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Giỏ hàng của bạn
//           </h2>
//           {cartItems.length === 0 ? (
//             <p className="text-gray-600">Giỏ hàng trống.</p>
//           ) : (
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex items-center space-x-4 border-b pb-3"
//                 >
//                   <img
//                     src={
//                       item.variant?.image ||
//                       item.product?.images?.[0] ||
//                       "/img/placeholder.jpg"
//                     }
//                     alt={item.product?.name || "Sản phẩm"}
//                     className="w-16 h-16 object-cover rounded"
//                   />
//                   <div className="flex-1">
//                     <div className="font-semibold">{item.product?.name}</div>
//                     {item.variant && (
//                       <div className="text-xs text-gray-500">
//                         {item.variant.size} / {item.variant.color}
//                       </div>
//                     )}
//                     <div className="text-xs text-gray-500">
//                       Số lượng: {item.quantity}
//                     </div>
//                   </div>
//                   <div className="font-semibold">
//                     $
//                     {(
//                       ((item.variant?.discountPrice &&
//                       item.variant?.discountPrice < item.variant?.price
//                         ? item.variant.discountPrice
//                         : item.variant?.price) ||
//                         (item.product?.discountPrice &&
//                         item.product?.discountPrice < item.product?.price
//                           ? item.product.discountPrice
//                           : item.product?.price) ||
//                         0) * item.quantity
//                     ).toFixed(2)}
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-between font-semibold mt-4">
//                 <span>Tổng cộng</span>
//                 <span>${subtotal.toFixed(2)} USD</span>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Địa chỉ giao hàng */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Địa chỉ giao hàng
//           </h2>
//           {addresses.length > 0 && (
//             <div className="mb-4">
//               <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
//               {addresses.map((addr) => (
//                 <div key={addr._id} className="flex items-center mb-2">
//                   <input
//                     type="radio"
//                     name="address"
//                     value={addr._id}
//                     checked={selectedAddress === addr._id}
//                     onChange={() => {
//                       setSelectedAddress(addr._id);
//                       setUseNewAddress(false);
//                     }}
//                     className="mr-2"
//                   />
//                   <div>
//                     <p className="font-semibold">{addr.fullName}</p>
//                     <p>
//                       {addr.address}, {addr.city}, {addr.country}
//                     </p>
//                     <p>SĐT: {addr.phone}</p>
//                     {addr.isDefault && (
//                       <span className="text-green-600 text-xs">[Mặc định]</span>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//           <div className="mb-4">
//             <label className="flex items-center">
//               <input
//                 type="checkbox"
//                 checked={useNewAddress}
//                 onChange={() => setUseNewAddress(!useNewAddress)}
//                 className="mr-2"
//               />
//               Nhập địa chỉ mới
//             </label>
//           </div>
//           {useNewAddress && (
//             <div className="space-y-4">
//               <input
//                 type="text"
//                 name="fullName"
//                 value={newAddress.fullName}
//                 onChange={handleNewAddressChange}
//                 placeholder="Họ và tên"
//                 className="w-full border rounded px-3 py-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="phone"
//                 value={newAddress.phone}
//                 onChange={handleNewAddressChange}
//                 placeholder="Số điện thoại"
//                 className="w-full border rounded px-3 py-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="address"
//                 value={newAddress.address}
//                 onChange={handleNewAddressChange}
//                 placeholder="Địa chỉ"
//                 className="w-full border rounded px-3 py-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="city"
//                 value={newAddress.city}
//                 onChange={handleNewAddressChange}
//                 placeholder="Thành phố"
//                 className="w-full border rounded px-3 py-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="country"
//                 value={newAddress.country}
//                 onChange={handleNewAddressChange}
//                 placeholder="Quốc gia"
//                 className="w-full border rounded px-3 py-2"
//                 required
//               />
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="isDefault"
//                   checked={newAddress.isDefault}
//                   onChange={handleNewAddressChange}
//                   className="mr-2"
//                 />
//                 Đặt làm địa chỉ mặc định
//               </label>
//             </div>
//           )}
//         </div>

//         {/* Phương thức thanh toán */}
//         <div className="mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold mb-4">
//             Phương thức thanh toán
//           </h2>
//           <div className="flex items-center space-x-6">
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="cash"
//                 checked={paymentMethod === "cash"}
//                 onChange={() => setPaymentMethod("cash")}
//                 className="mr-2"
//               />
//               Thanh toán khi nhận hàng (COD)
//             </label>
//             <label className="flex items-center">
//               <input
//                 type="radio"
//                 name="paymentMethod"
//                 value="bank_transfer"
//                 checked={paymentMethod === "bank_transfer"}
//                 onChange={() => setPaymentMethod("bank_transfer")}
//                 className="mr-2"
//               />
//               Chuyển khoản ngân hàng
//             </label>
//           </div>
//         </div>

//         {/* Form thanh toán */}
//         <form onSubmit={handleCheckout} className="space-y-4">
//           <button
//             type="submit"
//             className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
//             disabled={
//               cartItems.length === 0 || (!selectedAddress && !useNewAddress)
//             }
//           >
//             Xác nhận đặt hàng
//           </button>
//           {error && <p className="text-red-600 text-sm">{error}</p>}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const getUserId = () => {
  if (typeof window !== "undefined") {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user?.id) return user.id;
    return localStorage.getItem("guestId") || "";
  }
  return "";
};

const CheckoutPage = () => {
  const router = useRouter();
  const userId = getUserId();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    isDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Fetch giỏ hàng và danh sách địa chỉ
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/cart/${userId}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Không thể tải giỏ hàng");
        const data = await res.json();
        setCartItems(data.items || []);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchAddresses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:3000/api/address", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Không thể tải danh sách địa chỉ");
        }
        const data = await res.json();
        setAddresses(data);
        // Tự động chọn địa chỉ mặc định nếu có
        const defaultAddress = data.find((addr) => addr.isDefault);
        if (defaultAddress) setSelectedAddress(defaultAddress._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
    fetchAddresses();
  }, [userId, router]);

  // Tính tổng giá
  const subtotal = cartItems.reduce(
    (total, item) =>
      total +
      ((item.variant?.discountPrice &&
      item.variant?.discountPrice < item.variant?.price
        ? item.variant.discountPrice
        : item.variant?.price) ||
        (item.product?.discountPrice &&
        item.product?.discountPrice < item.product?.price
          ? item.product.discountPrice
          : item.product?.price) ||
        0) *
        item.quantity,
    0
  );

  // Xử lý nhập địa chỉ mới
  const handleNewAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Xử lý checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vui lòng đăng nhập lại.");
      router.push("/login");
      return;
    }
    if (!selectedAddress && !useNewAddress) {
      setError("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Giỏ hàng trống.");
      return;
    }
    if (
      useNewAddress &&
      (!newAddress.fullName ||
        !newAddress.phone ||
        !newAddress.address ||
        !newAddress.city ||
        !newAddress.country)
    ) {
      setError("Vui lòng điền đầy đủ thông tin địa chỉ mới.");
      return;
    }
    if (!paymentMethod) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    try {
      const payload = {
        products: cartItems.map((item) => ({
          product: item.product._id,
          variant: item.variant._id,
          quantity: item.quantity,
        })),
        totalPrice: subtotal,
        paymentMethod,
        ...(useNewAddress
          ? { newShippingAddress: newAddress }
          : { shippingAddress: selectedAddress }),
      };

      const res = await fetch("http://localhost:3000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Thanh toán thất bại");
      }

      const data = await res.json();
      alert("Đặt hàng thành công!");
      router.push("/order-confirmation");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        Đang tải...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center text-red-600">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Thanh toán</h1>

        {/* Giỏ hàng */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Giỏ hàng của bạn
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-600">Giỏ hàng trống.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => {
                const effectivePrice =
                  (item.variant?.discountPrice &&
                  item.variant?.discountPrice < item.variant?.price
                    ? item.variant.discountPrice
                    : item.variant?.price) ||
                  (item.product?.discountPrice &&
                  item.product?.discountPrice < item.product?.price
                    ? item.product.discountPrice
                    : item.product?.price) ||
                  0;
                const isOnSale =
                  (item.variant?.discountPrice &&
                    item.variant?.discountPrice < item.variant?.price) ||
                  (item.product?.discountPrice &&
                    item.product?.discountPrice < item.product?.price);
                const originalPrice =
                  item.variant?.price || item.product?.price || 0;

                return (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 border-b pb-3"
                  >
                    <img
                      src={
                        item.variant?.image ||
                        item.product?.images?.[0] ||
                        "/img/placeholder.jpg"
                      }
                      alt={item.product?.name || "Sản phẩm"}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{item.product?.name}</div>
                      {item.variant && (
                        <div className="text-xs text-gray-500">
                          Kích thước: {item.variant.size} / Màu sắc:{" "}
                          {item.variant.color}
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Số lượng: {item.quantity}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isOnSale ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-red-500">
                              {formatPrice(effectivePrice)}
                            </span>
                            <span className="line-through text-gray-400">
                              {formatPrice(originalPrice)}
                            </span>
                          </div>
                        ) : (
                          <span>{formatPrice(effectivePrice)}</span>
                        )}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(effectivePrice * item.quantity)}
                    </div>
                  </div>
                );
              })}
              <div className="flex justify-between font-semibold mt-4">
                <span>Tổng cộng</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Địa chỉ giao hàng
          </h2>
          {addresses.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Chọn địa chỉ có sẵn:</h3>
              {addresses.map((addr) => (
                <div key={addr._id} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddress === addr._id}
                    onChange={() => {
                      setSelectedAddress(addr._id);
                      setUseNewAddress(false);
                    }}
                    className="mr-2"
                  />
                  <div>
                    <p className="font-semibold">{addr.fullName}</p>
                    <p>
                      {addr.address}, {addr.city}, {addr.country}
                    </p>
                    <p>SĐT: {addr.phone}</p>
                    {addr.isDefault && (
                      <span className="text-green-600 text-xs">[Mặc định]</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useNewAddress}
                onChange={() => setUseNewAddress(!useNewAddress)}
                className="mr-2"
              />
              Nhập địa chỉ mới
            </label>
          </div>
          {useNewAddress && (
            <div className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={newAddress.fullName}
                onChange={handleNewAddressChange}
                placeholder="Họ và tên"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="phone"
                value={newAddress.phone}
                onChange={handleNewAddressChange}
                placeholder="Số điện thoại"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="address"
                value={newAddress.address}
                onChange={handleNewAddressChange}
                placeholder="Địa chỉ"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="city"
                value={newAddress.city}
                onChange={handleNewAddressChange}
                placeholder="Thành phố"
                className="w-full border rounded px-3 py-2"
                required
              />
              <input
                type="text"
                name="country"
                value={newAddress.country}
                onChange={handleNewAddressChange}
                placeholder="Quốc gia"
                className="w-full border rounded px-3 py-2"
                required
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={newAddress.isDefault}
                  onChange={handleNewAddressChange}
                  className="mr-2"
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          )}
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4">
            Phương thức thanh toán
          </h2>
          <div className="flex items-center space-x-6">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
                className="mr-2"
              />
              Thanh toán khi nhận hàng (COD)
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={() => setPaymentMethod("bank_transfer")}
                className="mr-2"
              />
              Chuyển khoản ngân hàng
            </label>
          </div>
        </div>

        {/* Form thanh toán */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-sm"
            disabled={
              cartItems.length === 0 || (!selectedAddress && !useNewAddress)
            }
          >
            Xác nhận đặt hàng
          </button>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
