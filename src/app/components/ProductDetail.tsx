// "use client";
// import { useState, useEffect } from "react";
// import {
//   ChevronDown,
//   Minus,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import Image from "next/image";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "../../redux/store";
// import { addToCart, refresh } from "../../redux/cartSlice";

// // ==================== TYPES ====================

// interface ImageItem {
//   src: string;
//   type: "product" | "variant";
//   index: number;
//   variantId?: string;
// }

// interface Variant {
//   _id: string;
//   size: string;
//   color: string;
//   price: number;
//   discountPrice?: number;
//   stock: number;
//   image?: string;
// }

// // ✅ Product interface khớp với CartSlice (images là required string[])
// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   images: string[]; // ← required, không optional
//   variants?: Variant[];
//   category?: { name: string };
//   description?: string;
//   createdAt: string;
//   slug?: string;
// }

// interface ProductDetailProps {
//   initialProduct: Product;
// }

// const ProductDetail: React.FC<ProductDetailProps> = ({ initialProduct }) => {
//   // ✅ FIX: dùng setProduct để có thể đồng bộ lại khi prop initialProduct đổi
//   const [product, setProduct] = useState<Product>(initialProduct);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
//   const [quantity, setQuantity] = useState<number>(1);
//   const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
//   const [combinedImages, setCombinedImages] = useState<ImageItem[]>([]);

//   const dispatch = useDispatch();
//   const user = useSelector((state: RootState) => state.auth.user);

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(price);
//   };

//   // Backend giờ đã trả full URL sẵn cho cả product.images và variant.image,
//   // nên chỉ cần fallback khi thiếu, không cần tự chèn /api nữa
//   const getImageUrl = (imgPath?: string): string => {
//     if (!imgPath) return "/img/placeholder.jpg";
//     if (imgPath.startsWith("http")) {
//       return imgPath.replace(/^http:\/\//, "https://");
//     }
//     return `${process.env.NEXT_PUBLIC_API_URL}${
//       imgPath.startsWith("/") ? "" : "/"
//     }${imgPath}`;
//   };

//   const getUserId = () => {
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const userData = JSON.parse(storedUser);
//         if (userData?.id) return userData.id;
//       }
//       let guestId = localStorage.getItem("guestId");
//       if (!guestId) {
//         guestId = crypto.randomUUID();
//         localStorage.setItem("guestId", guestId);
//       }
//       return guestId;
//     }
//     return "";
//   };

//   // ✅ FIX QUAN TRỌNG NHẤT:
//   // Khi initialProduct (prop truyền từ trang cha) thay đổi — do người dùng
//   // chuyển sang xem sản phẩm khác — đồng bộ lại toàn bộ state nội bộ.
//   // Nếu không có effect này, "product" cũ (từ useState ban đầu) sẽ được
//   // giữ nguyên trong bộ nhớ component cho tới khi Next.js remount lại,
//   // gây ra hiện tượng hiển thị ảnh/thông tin sản phẩm cũ trong một khoảng
//   // thời gian ngắn trước khi cập nhật đúng sản phẩm mới.
//   useEffect(() => {
//     setProduct(initialProduct);
//     setSelectedVariant(null);
//     setQuantity(1);
//     setSelectedImageIndex(0);
//     setError(null);
//     setSuccess(null);
//   }, [initialProduct]);

//   // Hợp nhất giỏ hàng khi user đăng nhập
//   useEffect(() => {
//     const mergeCart = async () => {
//       if (!user?.id) return;
//       const guestId = localStorage.getItem("guestId");
//       if (guestId && guestId !== user.id) {
//         try {
//           const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`,
//             {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               credentials: "include",
//               body: JSON.stringify({ guestId, userId: user.id }),
//             },
//           );
//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "Lỗi khi hợp nhất giỏ hàng");
//           }
//           localStorage.removeItem("guestId");
//           dispatch(refresh());
//         } catch (err: unknown) {
//           const message =
//             err instanceof Error ? err.message : "Lỗi không xác định";
//           console.error("Lỗi hợp nhất giỏ hàng:", message);
//           setError(message);
//         }
//       }
//     };
//     mergeCart();
//   }, [user?.id, dispatch]);

//   // Xử lý hình ảnh và biến thể
//   useEffect(() => {
//     if (!product) return;

//     const productImages: ImageItem[] = (product.images || []).map(
//       (img, idx) => ({
//         src: getImageUrl(img),
//         type: "product",
//         index: idx,
//       }),
//     );

//     const variantImages: ImageItem[] = (product.variants || [])
//       .filter((v) => v.image)
//       .map((v, idx) => ({
//         src: getImageUrl(v.image),
//         type: "variant",
//         variantId: v._id,
//         index: idx,
//       }));

//     const allImages = [...productImages, ...variantImages];
//     setCombinedImages(allImages);

//     if ((product.variants?.length ?? 0) > 0) {
//       const firstVariant = product.variants![0];
//       setSelectedVariant(firstVariant);

//       const firstVariantImageIndex = allImages.findIndex(
//         (img) => img.type === "variant" && img.variantId === firstVariant._id,
//       );
//       setSelectedImageIndex(
//         firstVariantImageIndex >= 0 ? firstVariantImageIndex : 0,
//       );
//     } else {
//       setSelectedImageIndex(0);
//     }
//   }, [product]);

//   // Cập nhật ảnh khi chọn variant
//   useEffect(() => {
//     if (selectedVariant?.image) {
//       const index = combinedImages.findIndex(
//         (img) =>
//           img.type === "variant" && img.variantId === selectedVariant._id,
//       );
//       if (index >= 0) setSelectedImageIndex(index);
//     }
//   }, [selectedVariant, combinedImages]);

//   const increaseQuantity = () => {
//     const maxStock =
//       selectedVariant?.stock ?? product?.variants?.[0]?.stock ?? 0;
//     if (quantity < maxStock) {
//       setQuantity((prev) => prev + 1);
//       setError(null);
//     } else {
//       setError("Số lượng vượt quá tồn kho!");
//     }
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//       setError(null);
//     }
//   };

//   const nextImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === combinedImages.length - 1 ? 0 : prev + 1,
//     );
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === 0 ? combinedImages.length - 1 : prev - 1,
//     );
//   };

//   const handleAddToCart = async () => {
//     if (!product) {
//       setError("Không tìm thấy sản phẩm");
//       return;
//     }

//     const stock = selectedVariant?.stock ?? product.variants?.[0]?.stock ?? 0;
//     if (quantity > stock) {
//       setError("Số lượng vượt quá tồn kho!");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     try {
//       const userId = getUserId();
//       if (!userId) throw new Error("Không tìm thấy userId");

//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({
//             userId,
//             productId: product._id,
//             variantId: selectedVariant?._id,
//             quantity,
//           }),
//         },
//       );

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Không thể thêm vào giỏ hàng");
//       }

//       // ✅ Đảm bảo images luôn là string[] (không undefined)
//       dispatch(
//         addToCart({
//           product: {
//             ...product,
//             images: product.images ?? [],
//           },
//           variant: selectedVariant,
//           quantity,
//         }),
//       );

//       window.dispatchEvent(new Event("cart-updated"));
//       setSuccess("Đã thêm sản phẩm vào giỏ hàng!");
//       setTimeout(() => setSuccess(null), 3000);
//     } catch (err: unknown) {
//       const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
//       console.error("Lỗi thêm vào giỏ:", err);
//       setError(message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Lắng nghe sự kiện cart-updated
//   useEffect(() => {
//     const updateCart = async () => {
//       const userId = getUserId();
//       if (!userId) return;

//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
//           {
//             credentials: "include",
//           },
//         );
//         if (!res.ok) throw new Error("Không thể tải giỏ hàng");

//         const data = await res.json();
//         data.items?.forEach((item: any) => {
//           dispatch(
//             addToCart({
//               product: {
//                 ...item.product,
//                 images: item.product.images ?? [], // ✅ đảm bảo không undefined
//               },
//               variant: item.variant,
//               quantity: item.quantity,
//             }),
//           );
//         });
//       } catch (err: unknown) {
//         const message =
//           err instanceof Error ? err.message : "Lỗi cập nhật giỏ hàng";
//         console.error(message);
//         setError(message);
//       }
//     };

//     window.addEventListener("cart-updated", updateCart);
//     return () => window.removeEventListener("cart-updated", updateCart);
//   }, [dispatch]);

//   // Tính giá
//   const effectivePrice = selectedVariant
//     ? selectedVariant.discountPrice &&
//       selectedVariant.discountPrice < selectedVariant.price
//       ? selectedVariant.discountPrice
//       : selectedVariant.price
//     : product.variants?.[0]?.discountPrice &&
//         product.variants[0].discountPrice < product.variants[0].price
//       ? product.variants[0].discountPrice
//       : product.variants?.[0]?.price || product.price;

//   const originalPrice = selectedVariant
//     ? selectedVariant.price
//     : product.variants?.[0]?.price || product.price;

//   const isOnSale = selectedVariant
//     ? !!(
//         selectedVariant.discountPrice &&
//         selectedVariant.discountPrice < selectedVariant.price
//       )
//     : !!(
//         product.variants?.[0]?.discountPrice &&
//         product.variants[0].discountPrice < product.variants[0].price
//       );

//   const hasVariants = (product.variants?.length ?? 0) > 0;
//   const firstVariantStock = product.variants?.[0]?.stock ?? 0;

//   if (!product) {
//     return <div className="p-8 text-center">Không tìm thấy sản phẩm.</div>;
//   }

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
//         {/* Thông báo lỗi / thành công */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
//             {error}
//           </div>
//         )}
//         {success && (
//           <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
//             {success}
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
//           {/* Phần hình ảnh */}
//           <div className="space-y-3 sm:space-y-4">
//             <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
//               {isOnSale && (
//                 <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
//                   Giảm giá
//                 </span>
//               )}
//               <Image
//                 src={
//                   combinedImages[selectedImageIndex]?.src ||
//                   "/img/placeholder.jpg"
//                 }
//                 alt={product.name}
//                 width={500}
//                 height={500}
//                 unoptimized
//                 className="w-full h-full object-cover"
//                 priority
//               />
//             </div>

//             <div className="flex items-center space-x-2 overflow-x-auto pb-2">
//               <button
//                 onClick={prevImage}
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded flex-shrink-0"
//                 disabled={combinedImages.length <= 1}
//               >
//                 <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>

//               {combinedImages.map((image, index) => (
//                 <button
//                   key={`${image.type}-${image.variantId || image.index}`}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
//                     selectedImageIndex === index
//                       ? "border-black"
//                       : "border-transparent hover:border-gray-300"
//                   }`}
//                 >
//                   <Image
//                     src={image.src}
//                     alt={`Hình ${index + 1}`}
//                     width={80}
//                     height={80}
//                     unoptimized
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}

//               <button
//                 onClick={nextImage}
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded flex-shrink-0"
//                 disabled={combinedImages.length <= 1}
//               >
//                 <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Phần thông tin sản phẩm */}
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
//                 {product.name}
//               </h1>
//               <div className="flex items-center space-x-2 mb-1 sm:mb-2">
//                 {isOnSale ? (
//                   <>
//                     <span className="text-lg sm:text-xl md:text-2xl font-semibold text-red-500">
//                       {formatPrice(effectivePrice)}
//                     </span>
//                     <span className="text-sm sm:text-base text-gray-400 line-through">
//                       {formatPrice(originalPrice)}
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-lg sm:text-xl md:text-2xl font-semibold">
//                     {formatPrice(effectivePrice)}
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 <span className="underline">Vận chuyển</span> được tính khi
//                 thanh toán.
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600 mt-1">
//                 <span className="font-medium">Tồn kho:</span>{" "}
//                 {(selectedVariant?.stock ?? firstVariantStock) > 0 ? (
//                   <span className="text-green-600">Còn hàng</span>
//                 ) : (
//                   <span className="text-red-600">Hết hàng</span>
//                 )}
//               </p>
//             </div>

//             {/* Chọn biến thể */}
//             {hasVariants && (
//               <div className="space-y-2 sm:space-y-3">
//                 <label className="block text-xs sm:text-sm font-medium">
//                   Biến thể
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedVariant?._id || ""}
//                     onChange={(e) => {
//                       const variant = product.variants?.find(
//                         (v) => v._id === e.target.value,
//                       );
//                       setSelectedVariant(variant || null);
//                       setQuantity(1);
//                       setError(null);
//                     }}
//                     className="w-full p-2 sm:p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm"
//                   >
//                     {product.variants!.map((variant) => (
//                       <option key={variant._id} value={variant._id}>
//                         {variant.size} / {variant.color}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
//                 </div>
//               </div>
//             )}

//             {/* Số lượng */}
//             <div className="space-y-2 sm:space-y-3">
//               <label className="block text-xs sm:text-sm font-medium">
//                 Số lượng
//               </label>
//               <div className="flex items-center border border-gray-300 rounded-md w-28 sm:w-32">
//                 <button
//                   onClick={decreaseQuantity}
//                   className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-40"
//                   disabled={quantity === 1}
//                 >
//                   <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>
//                 <span className="flex-1 text-center py-2 sm:py-3 border-x border-gray-300 text-xs sm:text-sm">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={increaseQuantity}
//                   className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-40"
//                   disabled={
//                     quantity >= (selectedVariant?.stock ?? firstVariantStock)
//                   }
//                 >
//                   <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Nút hành động */}
//             <div className="space-y-2 sm:space-y-3">
//               <button
//                 className="w-full py-3 sm:py-4 border-2 border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={
//                   loading || (selectedVariant?.stock ?? firstVariantStock) === 0
//                 }
//                 onClick={handleAddToCart}
//               >
//                 {loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
//               </button>
//               <button
//                 className="w-full py-3 sm:py-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={
//                   loading || (selectedVariant?.stock ?? firstVariantStock) === 0
//                 }
//               >
//                 Mua ngay với ShopPay
//               </button>
//               <button className="w-full text-center text-xs sm:text-sm text-gray-600 underline hover:text-black">
//                 Các tùy chọn thanh toán khác
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
"use client";
import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { addToCart, refresh } from "../../redux/cartSlice";

// ==================== TYPES ====================

interface ImageItem {
  src: string;
  type: "product" | "variant";
  index: number;
  variantId?: string;
}

interface Variant {
  _id: string;
  size: string;
  color: string;
  price: number;
  discountPrice?: number;
  stock: number;
  image?: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  variants?: Variant[];
  category?: { name: string };
  description?: string;
  createdAt: string;
  slug?: string;
}

interface ProductDetailProps {
  initialProduct: Product;
}

// Đưa getImageUrl ra ngoài component vì nó không phụ thuộc state/props gì cả
const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    return imgPath.replace(/^http:\/\//, "https://");
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${
    imgPath.startsWith("/") ? "" : "/"
  }${imgPath}`;
};

const ProductDetail: React.FC<ProductDetailProps> = ({ initialProduct }) => {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    initialProduct.variants?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getUserId = () => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.id) return userData.id;
      }
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("guestId", guestId);
      }
      return guestId;
    }
    return "";
  };

  // ✅ Đồng bộ lại state khi initialProduct (prop) đổi — khi chuyển sản phẩm
  useEffect(() => {
    setProduct(initialProduct);
    setSelectedVariant(initialProduct.variants?.[0] ?? null);
    setQuantity(1);
    setSelectedImageIndex(0);
    setError(null);
    setSuccess(null);
  }, [initialProduct]);

  // Hợp nhất giỏ hàng khi user đăng nhập
  useEffect(() => {
    const mergeCart = async () => {
      if (!user?.id) return;
      const guestId = localStorage.getItem("guestId");
      if (guestId && guestId !== user.id) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/cart/merge`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ guestId, userId: user.id }),
            },
          );
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Lỗi khi hợp nhất giỏ hàng");
          }
          localStorage.removeItem("guestId");
          dispatch(refresh());
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Lỗi không xác định";
          console.error("Lỗi hợp nhất giỏ hàng:", message);
          setError(message);
        }
      }
    };
    mergeCart();
  }, [user?.id, dispatch]);

  // ✅ FIX QUAN TRỌNG: tính combinedImages bằng useMemo NGAY TRONG LÚC RENDER,
  // không dùng useState + useEffect nữa.
  // Trước đây combinedImages khởi tạo là [] rồi mới được set qua useEffect
  // (chạy SAU khi component đã render/commit lần đầu) → tạo ra một khoảng
  // "trống" mà src ảnh fallback về /img/placeholder.jpg trước khi ảnh thật
  // được gán vào. Với useMemo, giá trị được tính ngay trong render đầu tiên,
  // dựa trực tiếp trên `product` hiện tại — không còn khoảng trống này nữa.
  const combinedImages: ImageItem[] = useMemo(() => {
    if (!product) return [];

    const productImages: ImageItem[] = (product.images || []).map(
      (img, idx) => ({
        src: getImageUrl(img),
        type: "product",
        index: idx,
      }),
    );

    const variantImages: ImageItem[] = (product.variants || [])
      .filter((v) => v.image)
      .map((v, idx) => ({
        src: getImageUrl(v.image),
        type: "variant",
        variantId: v._id,
        index: idx,
      }));

    return [...productImages, ...variantImages];
  }, [product]);

  // Khi product đổi, đặt lại selectedImageIndex theo variant đầu tiên (nếu có)
  useEffect(() => {
    if (!product) return;

    if ((product.variants?.length ?? 0) > 0) {
      const firstVariant = product.variants![0];
      const firstVariantImageIndex = combinedImages.findIndex(
        (img) => img.type === "variant" && img.variantId === firstVariant._id,
      );
      setSelectedImageIndex(
        firstVariantImageIndex >= 0 ? firstVariantImageIndex : 0,
      );
    } else {
      setSelectedImageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Cập nhật ảnh khi chọn variant
  useEffect(() => {
    if (selectedVariant?.image) {
      const index = combinedImages.findIndex(
        (img) =>
          img.type === "variant" && img.variantId === selectedVariant._id,
      );
      if (index >= 0) setSelectedImageIndex(index);
    }
  }, [selectedVariant, combinedImages]);

  const increaseQuantity = () => {
    const maxStock =
      selectedVariant?.stock ?? product?.variants?.[0]?.stock ?? 0;
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1);
      setError(null);
    } else {
      setError("Số lượng vượt quá tồn kho!");
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
      setError(null);
    }
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === combinedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? combinedImages.length - 1 : prev - 1,
    );
  };

  const handleAddToCart = async () => {
    if (!product) {
      setError("Không tìm thấy sản phẩm");
      return;
    }

    const stock = selectedVariant?.stock ?? product.variants?.[0]?.stock ?? 0;
    if (quantity > stock) {
      setError("Số lượng vượt quá tồn kho!");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const userId = getUserId();
      if (!userId) throw new Error("Không tìm thấy userId");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cart/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            userId,
            productId: product._id,
            variantId: selectedVariant?._id,
            quantity,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Không thể thêm vào giỏ hàng");
      }

      dispatch(
        addToCart({
          product: {
            ...product,
            images: product.images ?? [],
          },
          variant: selectedVariant,
          quantity,
        }),
      );

      window.dispatchEvent(new Event("cart-updated"));
      setSuccess("Đã thêm sản phẩm vào giỏ hàng!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Có lỗi xảy ra";
      console.error("Lỗi thêm vào giỏ:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe sự kiện cart-updated
  useEffect(() => {
    const updateCart = async () => {
      const userId = getUserId();
      if (!userId) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cart/${userId}`,
          {
            credentials: "include",
          },
        );
        if (!res.ok) throw new Error("Không thể tải giỏ hàng");

        const data = await res.json();
        data.items?.forEach((item: any) => {
          dispatch(
            addToCart({
              product: {
                ...item.product,
                images: item.product.images ?? [],
              },
              variant: item.variant,
              quantity: item.quantity,
            }),
          );
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Lỗi cập nhật giỏ hàng";
        console.error(message);
        setError(message);
      }
    };

    window.addEventListener("cart-updated", updateCart);
    return () => window.removeEventListener("cart-updated", updateCart);
  }, [dispatch]);

  const effectivePrice = selectedVariant
    ? selectedVariant.discountPrice &&
      selectedVariant.discountPrice < selectedVariant.price
      ? selectedVariant.discountPrice
      : selectedVariant.price
    : product.variants?.[0]?.discountPrice &&
        product.variants[0].discountPrice < product.variants[0].price
      ? product.variants[0].discountPrice
      : product.variants?.[0]?.price || product.price;

  const originalPrice = selectedVariant
    ? selectedVariant.price
    : product.variants?.[0]?.price || product.price;

  const isOnSale = selectedVariant
    ? !!(
        selectedVariant.discountPrice &&
        selectedVariant.discountPrice < selectedVariant.price
      )
    : !!(
        product.variants?.[0]?.discountPrice &&
        product.variants[0].discountPrice < product.variants[0].price
      );

  const hasVariants = (product.variants?.length ?? 0) > 0;
  const firstVariantStock = product.variants?.[0]?.stock ?? 0;

  if (!product) {
    return <div className="p-8 text-center">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {isOnSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded z-10">
                  Giảm giá
                </span>
              )}
              <Image
                src={
                  combinedImages[selectedImageIndex]?.src ||
                  "/img/placeholder.jpg"
                }
                alt={product.name}
                width={500}
                height={500}
                unoptimized
                className="w-full h-full object-cover"
                priority
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={prevImage}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded flex-shrink-0"
                disabled={combinedImages.length <= 1}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {combinedImages.map((image, index) => (
                <button
                  key={`${image.type}-${image.variantId || image.index}`}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index
                      ? "border-black"
                      : "border-transparent hover:border-gray-300"
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={`Hình ${index + 1}`}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

              <button
                onClick={nextImage}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded flex-shrink-0"
                disabled={combinedImages.length <= 1}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                {isOnSale ? (
                  <>
                    <span className="text-lg sm:text-xl md:text-2xl font-semibold text-red-500">
                      {formatPrice(effectivePrice)}
                    </span>
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      {formatPrice(originalPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-lg sm:text-xl md:text-2xl font-semibold">
                    {formatPrice(effectivePrice)}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="underline">Vận chuyển</span> được tính khi
                thanh toán.
              </p>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                <span className="font-medium">Tồn kho:</span>{" "}
                {(selectedVariant?.stock ?? firstVariantStock) > 0 ? (
                  <span className="text-green-600">Còn hàng</span>
                ) : (
                  <span className="text-red-600">Hết hàng</span>
                )}
              </p>
            </div>

            {hasVariants && (
              <div className="space-y-2 sm:space-y-3">
                <label className="block text-xs sm:text-sm font-medium">
                  Biến thể
                </label>
                <div className="relative">
                  <select
                    value={selectedVariant?._id || ""}
                    onChange={(e) => {
                      const variant = product.variants?.find(
                        (v) => v._id === e.target.value,
                      );
                      setSelectedVariant(variant || null);
                      setQuantity(1);
                      setError(null);
                    }}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black text-xs sm:text-sm"
                  >
                    {product.variants!.map((variant) => (
                      <option key={variant._id} value={variant._id}>
                        {variant.size} / {variant.color}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            )}

            <div className="space-y-2 sm:space-y-3">
              <label className="block text-xs sm:text-sm font-medium">
                Số lượng
              </label>
              <div className="flex items-center border border-gray-300 rounded-md w-28 sm:w-32">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  disabled={quantity === 1}
                >
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <span className="flex-1 text-center py-2 sm:py-3 border-x border-gray-300 text-xs sm:text-sm">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 sm:p-3 hover:bg-gray-100 transition-colors disabled:opacity-40"
                  disabled={
                    quantity >= (selectedVariant?.stock ?? firstVariantStock)
                  }
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <button
                className="w-full py-3 sm:py-4 border-2 border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading || (selectedVariant?.stock ?? firstVariantStock) === 0
                }
                onClick={handleAddToCart}
              >
                {loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>
              <button
                className="w-full py-3 sm:py-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  loading || (selectedVariant?.stock ?? firstVariantStock) === 0
                }
              >
                Mua ngay với ShopPay
              </button>
              <button className="w-full text-center text-xs sm:text-sm text-gray-600 underline hover:text-black">
                Các tùy chọn thanh toán khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
