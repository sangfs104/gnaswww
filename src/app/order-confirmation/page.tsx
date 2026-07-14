// // "use client";

// // import { useState, useEffect } from "react";
// // import { useRouter } from "next/navigation";

// // const OrderHistory = () => {
// //   const router = useRouter();
// //   const [orders, setOrders] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     const fetchOrders = async () => {
// //       const token = localStorage.getItem("token");
// //       if (!token) {
// //         setError("Vui lòng đăng nhập lại.");
// //         router.push("/login");
// //         return;
// //       }

// //       try {
// //         const res = await fetch("http://localhost:3000/api/orders", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //           credentials: "include",
// //         });
// //         if (!res.ok) {
// //           const errorData = await res.json();
// //           throw new Error(
// //             errorData.error || "Không thể tải danh sách đơn hàng"
// //           );
// //         }
// //         const data = await res.json();
// //         setOrders(data);
// //       } catch (err: any) {
// //         setError(err.message);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchOrders();
// //   }, [router]);

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

// //   if (orders.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-white px-4 py-6">
// //         <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
// //         <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-white px-4 py-6">
// //       <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
// //       <div className="space-y-6">
// //         {orders.map((order) => (
// //           <div
// //             key={order._id}
// //             className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
// //           >
// //             <div className="flex justify-between items-center mb-2">
// //               <span className="font-semibold">Mã đơn hàng: {order._id}</span>
// //               <span className="text-gray-600">
// //                 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
// //               </span>
// //             </div>
// //             <div className="flex justify-between mb-2">
// //               <span>Tổng giá: ${order.totalPrice.toFixed(2)} USD</span>
// //               <span
// //                 className={`text-sm ${
// //                   order.status === "completed"
// //                     ? "text-green-600"
// //                     : order.status === "cancelled"
// //                     ? "text-red-600"
// //                     : "text-yellow-600"
// //                 }`}
// //               >
// //                 Trạng thái: {order.status}
// //               </span>
// //             </div>
// //             <div className="mt-2">
// //               <h3 className="font-medium">Chi tiết sản phẩm:</h3>
// //               <ul className="list-disc pl-5">
// //                 {order.products.map((item) => (
// //                   <li key={item._id} className="flex items-center">
// //                     <img
// //                       src={
// //                         item.variant?.image || item.product?.images?.[0] || ""
// //                       }
// //                       alt={item.product?.name || "Sản phẩm"}
// //                       className="w-16 h-16 mr-4 object-cover rounded"
// //                       onError={(e) => {
// //                         e.target.src = "/placeholder-image.jpg";
// //                       }} // Placeholder nếu lỗi
// //                     />
// //                     <div>
// //                       {item.product?.name} (Biến thể:{" "}
// //                       {item.variant?.size || "N/A"}, Số lượng: {item.quantity})
// //                     </div>
// //                   </li>
// //                 ))}
// //               </ul>
// //             </div>
// //             <button
// //               onClick={() => router.push(`/order-confirmation/${order._id}`)}
// //               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //             >
// //               Xem chi tiết
// //             </button>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderHistory;
// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// // Định nghĩa TypeScript interfaces
// interface OrderItem {
//   _id: string;
//   product?: {
//     _id: string;
//     name: string;
//     images?: string[];
//   };
//   variant?: {
//     _id: string;
//     size?: string;
//     color?: string;
//     image?: string;
//   };
//   quantity: number;
// }

// interface Order {
//   _id: string;
//   createdAt: string;
//   totalPrice: number;
//   status: "pending" | "completed" | "cancelled" | "processing";
//   products: OrderItem[];
// }

// const OrderHistory = () => {
//   const router = useRouter();
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Vui lòng đăng nhập lại.");
//         router.push("/login");
//         return;
//       }

//       try {
//         const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });

//         if (!res.ok) {
//           const errorData = await res.json();
//           throw new Error(
//             errorData.error || "Không thể tải danh sách đơn hàng",
//           );
//         }

//         const data = await res.json();
//         setOrders(data);
//       } catch (err: unknown) {
//         const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
//         setError(message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrders();
//   }, [router]);

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

//   if (orders.length === 0) {
//     return (
//       <div className="min-h-screen bg-white px-4 py-6">
//         <h1 className="text-2xl font-bold mb-4">Lịch sử đơn hàng</h1>
//         <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white px-4 py-6">
//       <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
//       <div className="space-y-6">
//         {orders.map((order) => (
//           <div
//             key={order._id}
//             className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
//           >
//             <div className="flex justify-between items-center mb-2">
//               <span className="font-semibold">Mã đơn hàng: {order._id}</span>
//               <span className="text-gray-600">
//                 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
//               </span>
//             </div>

//             <div className="flex justify-between mb-2">
//               <span>Tổng giá: ${order.totalPrice.toFixed(2)} USD</span>
//               <span
//                 className={`text-sm ${
//                   order.status === "completed"
//                     ? "text-green-600"
//                     : order.status === "cancelled"
//                       ? "text-red-600"
//                       : "text-yellow-600"
//                 }`}
//               >
//                 Trạng thái: {order.status}
//               </span>
//             </div>

//             <div className="mt-2">
//               <h3 className="font-medium mb-2">Chi tiết sản phẩm:</h3>
//               <ul className="space-y-3">
//                 {order.products.map((item) => {
//                   const imageSrc =
//                     item.variant?.image ||
//                     item.product?.images?.[0] ||
//                     "/placeholder-image.jpg";

//                   return (
//                     <li key={item._id} className="flex items-center">
//                       <div className="relative w-16 h-16 mr-4 rounded overflow-hidden flex-shrink-0">
//                         <Image
//                           src={imageSrc}
//                           alt={item.product?.name || "Sản phẩm"}
//                           fill
//                           className="object-cover"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src =
//                               "/placeholder-image.jpg";
//                           }}
//                         />
//                       </div>
//                       <div>
//                         <p className="font-medium">{item.product?.name}</p>
//                         <p className="text-sm text-gray-600">
//                           Biến thể: {item.variant?.size || "N/A"} • Số lượng:{" "}
//                           {item.quantity}
//                         </p>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             <button
//               onClick={() => router.push(`/order-confirmation/${order._id}`)}
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
//             >
//               Xem chi tiết
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrderHistory;
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface OrderProductItem {
  product: { name: string; images?: string[] };
  variant?: { size?: string; color?: string };
  quantity: number;
}

interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

interface OrderDetail {
  _id: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  products: OrderProductItem[];
  shippingAddress?: ShippingAddress;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const statusLabel: Record<string, string> = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipped: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
};

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    if (!orderId) {
      setError("Không tìm thấy mã đơn hàng");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      if (!res.ok) throw new Error("Không thể tải đơn hàng");
      const data = await res.json();
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleCancel = async () => {
    if (!order) return;
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;

    setCancelling(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/cancel`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Không thể hủy đơn hàng");
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Lỗi khi hủy đơn hàng");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Đang tải...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!order) return null;

  const canCancel = ["pending", "paid"].includes(order.status);

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-2">
        {order.status === "cancelled"
          ? "Đơn hàng đã bị hủy"
          : "Đặt hàng thành công!"}
      </h1>
      <p className="text-gray-600 mb-6">Mã đơn hàng: {order._id}</p>

      <div className="border rounded-lg p-4 mb-6">
        <p className="mb-2">
          Trạng thái:{" "}
          <span className="font-semibold">
            {statusLabel[order.status] || order.status}
          </span>
        </p>
        <p className="mb-2">
          Thanh toán:{" "}
          <span className="font-semibold">
            {order.paymentMethod === "cash"
              ? "Thanh toán khi nhận hàng (COD)"
              : "Chuyển khoản ngân hàng"}
          </span>
        </p>

        <div className="divide-y">
          {order.products.map((item, idx) => (
            <div key={idx} className="py-2 flex justify-between text-sm">
              <span>
                {item.product?.name}
                {item.variant &&
                  ` (${item.variant.size ?? ""}${
                    item.variant.color ? ", " + item.variant.color : ""
                  })`}
              </span>
              <span>x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-semibold mt-3 pt-3 border-t">
          <span>Tổng cộng</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>

        {order.shippingAddress && (
          <p className="text-sm text-gray-600 mt-3">
            Giao đến: {order.shippingAddress.fullName} -{" "}
            {order.shippingAddress.phone} - {order.shippingAddress.address},{" "}
            {order.shippingAddress.city}, {order.shippingAddress.country}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Link href="/orders" className="underline text-sm">
          Xem tất cả đơn hàng
        </Link>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="ml-auto bg-red-600 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
          >
            {cancelling ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        )}
      </div>
    </div>
  );
}
