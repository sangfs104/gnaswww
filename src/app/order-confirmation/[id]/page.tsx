"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  products: {
    _id: string;
    product?: { name: string; images?: string[]; description?: string };
    variant?: { size: string; image?: string };
    quantity: number;
  }[];
  shippingAddress?: {
    fullName?: string;
    address?: string;
    city?: string;
    country?: string;
    phone?: string;
  };
}

const OrderDetail = () => {
  const router = useRouter();
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại.");
        router.push("/login");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Không thể tải đơn hàng");
        }

        const data = await res.json();
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, router]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        Không tìm thấy đơn hàng.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">
        Chi tiết đơn hàng #{order._id}
      </h1>
      <div className="border rounded-lg p-4 shadow-sm">
        {/* Thông tin chung */}
        <div className="mb-4">
          <p>
            <strong>Ngày tạo:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString("vi-VN")}
          </p>
          <p>
            <strong>Tổng giá:</strong> ${order.totalPrice.toFixed(2)} USD
          </p>
          <p>
            <strong>Trạng thái:</strong> {order.status}
          </p>
        </div>

        {/* Danh sách sản phẩm */}
        <div className="mb-4">
          <h3 className="font-medium">Sản phẩm:</h3>
          {order.products.length > 0 ? (
            <ul className="list-disc pl-5">
              {order.products.map((item) => (
                <li key={item._id} className="flex items-center mb-2">
                  <img
                    src={item.variant?.image || item.product?.images?.[0] || ""}
                    alt={item.product?.name || "Sản phẩm"}
                    className="w-16 h-16 mr-4 object-cover rounded"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }} // Placeholder nếu lỗi
                  />
                  <div>
                    {item.product?.name || "Sản phẩm không xác định"} (Biến thể:{" "}
                    {item.variant?.size || "N/A"}, Số lượng: {item.quantity})
                    <br />
                    <small>Mô tả: {item.product?.description || "N/A"}</small>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có sản phẩm trong đơn hàng</p>
          )}
        </div>

        {/* Địa chỉ giao hàng */}
        <div>
          <h3 className="font-medium">Địa chỉ giao hàng:</h3>
          {order.shippingAddress ? (
            <>
              <p>{order.shippingAddress.fullName || "N/A"}</p>
              <p>
                {order.shippingAddress.address || "N/A"},{" "}
                {order.shippingAddress.city || "N/A"},{" "}
                {order.shippingAddress.country || "N/A"}
              </p>
              <p>SĐT: {order.shippingAddress.phone || "N/A"}</p>
            </>
          ) : (
            <p className="text-gray-500">Chưa có thông tin giao hàng</p>
          )}
        </div>

        {/* Nút quay lại */}
        <button
          onClick={() => router.back()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
