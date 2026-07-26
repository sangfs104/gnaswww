// // }
// import ProductDetail from "../../components/ProductDetail";

// export default async function ProductPage({
//   params,
// }: {
//   params: Promise<{ id: string }>; // ← Quan trọng: dùng Promise
// }) {
//   // Await params trước khi dùng
//   const { id } = await params;

//   const res = await fetch(`https://gansbee.onrender.com/api/products/${id}`, {
//     cache: "no-store", // luôn lấy data mới
//   });

//   if (!res.ok) {
//     return (
//       <div className="p-8 text-center text-red-500">
//         Lỗi: Không thể tải sản phẩm
//       </div>
//     );
//   }

//   const product = await res.json();

//   return <ProductDetail initialProduct={product} />;
// }
import ProductDetail from "../../components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>; // ← Quan trọng: dùng Promise
}) {
  // Await params trước khi dùng
  const { id } = await params;

  const res = await fetch(`https://gansbee.onrender.com/api/products/${id}`, {
    cache: "no-store", // luôn lấy data mới
  });

  if (!res.ok) {
    return (
      <div className="p-8 text-center text-red-500">
        Lỗi: Không thể tải sản phẩm
      </div>
    );
  }

  const product = await res.json();

  // ✅ FIX: thêm key={product._id} (hoặc id nếu product không có _id)
  // để React unmount hoàn toàn instance cũ và mount lại instance mới
  // mỗi khi chuyển sang xem sản phẩm khác. Nếu không có key,
  // React có thể tái sử dụng lại cùng component instance (vì cùng
  // vị trí trong tree / cùng component type), khiến state cũ
  // (product, selectedVariant, combinedImages...) bị giữ lại
  // trong một khoảng thời gian ngắn trước khi cập nhật.
  return <ProductDetail key={product._id ?? id} initialProduct={product} />;
}
