"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface OrderProductItem {
  product: { name: string; images?: string[] };
  variant?: { size?: string; color?: string; image?: string };
  quantity: number;
}

// Chuẩn hoá đường dẫn ảnh: nối domain backend + tự chèn /api nếu thiếu
// Ví dụ đúng: https://gansbee.onrender.com/api/products/images/xxx.jpg
const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";

  // Trường hợp đã là URL đầy đủ (http/https)
  if (imgPath.startsWith("http")) {
    let url = imgPath.replace(/^http:\/\//, "https://");
    // Nếu URL tuyệt đối nhưng thiếu /api trước /products/images/, chèn vào
    url = url.replace(/(https:\/\/[^/]+)(\/products\/images\/)/, "$1/api$2");
    return url;
  }

  // Trường hợp là path tương đối (VD: "/products/images/xxx.jpg" hoặc "products/images/xxx.jpg")
  const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
  const withApi = cleanPath.startsWith("/api/products/images/")
    ? cleanPath
    : `/api/products/images${cleanPath}`;

  return `${process.env.NEXT_PUBLIC_API_URL}${withApi}`;
};

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

function OrderConfirmationContent() {
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
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-black" />
          Đang tải đơn hàng...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="mb-4 text-sm text-gray-600">{error}</p>
          <Link
            href="/products"
            className="inline-block border border-black px-5 py-2 text-xs tracking-wide hover:bg-black hover:text-white transition-colors"
          >
            QUAY LẠI CỬA HÀNG
          </Link>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const canCancel = ["pending", "paid"].includes(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-8 md:px-16 lg:px-20 py-10 sm:py-14">
      {/* Top status line — mirrors the header's left/right split */}
      <div className="flex items-start justify-between border-b border-gray-200 pb-6 mb-8">
        <div>
          <p className="text-xs tracking-widest text-gray-400 mb-2">
            {isCancelled ? "TRẠNG THÁI ĐƠN HÀNG" : "ĐẶT HÀNG THÀNH CÔNG"}
          </p>
          <h1 className="text-xl sm:text-2xl font-semibold text-black">
            {isCancelled ? "Đơn hàng đã bị hủy" : "Cảm ơn bạn đã đặt hàng"}
          </h1>
        </div>
        <span className="shrink-0 border border-black px-3 py-1 text-[11px] tracking-wide uppercase">
          {statusLabel[order.status] || order.status}
        </span>
      </div>

      <p className="text-xs text-gray-500 mb-10">
        Mã đơn hàng&nbsp;
        <span className="font-mono text-black">#{order._id}</span>
      </p>

      {/* Two-column layout: products (left) / summary + shipping + actions (right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14">
        {/* LEFT — product list */}
        <div className="md:col-span-2">
          <h2 className="text-xs tracking-widest text-gray-400 mb-4">
            SẢN PHẨM ({order.products.length})
          </h2>
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {order.products.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-16 w-16 shrink-0 overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={getImageUrl(
                        item.variant?.image || item.product?.images?.[0],
                      )}
                      alt={item.product?.name || "Sản phẩm"}
                      width={64}
                      height={64}
                      unoptimized
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-black truncate">
                      {item.product?.name}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">
                        {[item.variant.size, item.variant.color]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-sm text-gray-600">
                  x{item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5">
            <span className="text-sm text-gray-500">Tổng cộng</span>
            <span className="text-lg font-semibold text-black">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>

        {/* RIGHT — payment, shipping, actions */}
        <div className="md:col-span-1 flex flex-col gap-8">
          <div>
            <h2 className="text-xs tracking-widest text-gray-400 mb-3">
              THANH TOÁN
            </h2>
            <p className="text-sm text-black">
              {order.paymentMethod === "cash"
                ? "Thanh toán khi nhận hàng (COD)"
                : "Chuyển khoản ngân hàng"}
            </p>
          </div>

          {order.shippingAddress && (
            <div>
              <h2 className="text-xs tracking-widest text-gray-400 mb-3">
                GIAO ĐẾN
              </h2>
              <p className="text-sm text-black leading-relaxed">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.phone}
                <br />
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.country}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <Link
              href="/orders"
              className="w-full text-center border border-black bg-white text-black text-xs tracking-wide py-3 hover:bg-black hover:text-white transition-colors"
            >
              XEM TẤT CẢ ĐƠN HÀNG
            </Link>
            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="w-full text-center bg-black text-white text-xs tracking-wide py-3 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {cancelling ? "ĐANG HỦY..." : "HỦY ĐƠN HÀNG"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-gray-500">
          Đang tải...
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
