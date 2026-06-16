// import ProductDetail from "../../components/ProductDetail";

// export default async function ProductPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
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

  const res = await fetch(`http://localhost:3000/api/products/${id}`, {
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

  return <ProductDetail initialProduct={product} />;
}
