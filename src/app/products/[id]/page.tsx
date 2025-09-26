// "use client";
// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import {
//   ChevronDown,
//   Minus,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Search,
// } from "lucide-react";
// import Image from "next/image";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../storre/cartSlice";
// const ProductDetail = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedImageIndex, setSelectedImageIndex] = useState(0);
//   const [combinedImages, setCombinedImages] = useState([]);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (!id) return;
//     const fetchProduct = async () => {
//       try {
//         const res = await fetch(`http://localhost:3000/api/products/${id}`);
//         if (!res.ok) throw new Error("Failed to fetch product");
//         const data = await res.json();
//         setProduct(data);

//         const productImages = (data.images || []).map((img, idx) => ({
//           src: img,
//           type: "product",
//           index: idx,
//         }));
//         const variantImages = (data.variants || [])
//           .filter((v) => v.image)
//           .map((v, idx) => ({
//             src: v.image,
//             type: "variant",
//             variantId: v._id,
//             index: idx,
//           }));
//         const allImages = [...productImages, ...variantImages];
//         setCombinedImages(allImages);

//         if (data.variants?.length > 0) {
//           setSelectedVariant(data.variants[0]);
//           const firstVariantImageIndex = allImages.findIndex(
//             (img) =>
//               img.type === "variant" && img.variantId === data.variants[0]._id
//           );
//           setSelectedImageIndex(
//             firstVariantImageIndex >= 0 ? firstVariantImageIndex : 0
//           );
//         }

//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [id]);

//   useEffect(() => {
//     if (selectedVariant && selectedVariant.image) {
//       const variantImageIndex = combinedImages.findIndex(
//         (img) => img.type === "variant" && img.variantId === selectedVariant._id
//       );
//       if (variantImageIndex >= 0) {
//         setSelectedImageIndex(variantImageIndex);
//       }
//     }
//   }, [selectedVariant, combinedImages]);

//   const increaseQuantity = () => {
//     const maxStock = selectedVariant
//       ? selectedVariant.stock
//       : product?.stock || 0;
//     if (quantity < maxStock) {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   const decreaseQuantity = () => {
//     if (quantity > 1) {
//       setQuantity((prev) => prev - 1);
//     }
//   };

//   const nextImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === combinedImages.length - 1 ? 0 : prev + 1
//     );
//   };

//   const prevImage = () => {
//     setSelectedImageIndex((prev) =>
//       prev === 0 ? combinedImages.length - 1 : prev - 1
//     );
//   };

//   const handleAddToCart = () => {
//     dispatch(
//       addToCart({
//         product,
//         variant: selectedVariant,
//         quantity,
//       })
//     );
//   };

//   if (loading) return <div className="p-8 text-center">Loading...</div>;
//   if (error)
//     return <div className="p-8 text-center text-red-500">Error: {error}</div>;
//   if (!product)
//     return <div className="p-8 text-center">Product not found.</div>;

//   const effectivePrice = selectedVariant
//     ? selectedVariant.discountPrice &&
//       selectedVariant.discountPrice < selectedVariant.price
//       ? selectedVariant.discountPrice
//       : selectedVariant.price
//     : product.discountPrice &&
//       product.discountPrice < product.price &&
//       product.discountPrice < 1e6
//     ? product.discountPrice
//     : product.price;
//   const originalPrice = selectedVariant ? selectedVariant.price : product.price;
//   const isOnSale = selectedVariant
//     ? selectedVariant.discountPrice &&
//       selectedVariant.discountPrice < selectedVariant.price
//     : product.discountPrice &&
//       product.discountPrice < product.price &&
//       product.discountPrice < 1e6;

//   return (
//     <div className="min-h-screen bg-white">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
//         {/* Product Section */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
//           {/* Left - Image Gallery */}
//           <div className="space-y-3 sm:space-y-4">
//             {/* Main Image */}
//             <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
//               {isOnSale && (
//                 <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold z-10">
//                   Sale
//                 </div>
//               )}
//               <button className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-white bg-opacity-80 p-1.5 sm:p-2 rounded-full hover:bg-opacity-100">
//                 <Search className="w-3 h-3 sm:w-4 sm:h-4" />
//               </button>
//               <Image
//                 src={
//                   combinedImages[selectedImageIndex]?.src ||
//                   "/img/placeholder.jpg"
//                 }
//                 alt={product.name}
//                 width={500}
//                 height={500}
//                 className="w-full h-full object-cover"
//               />
//             </div>

//             {/* Thumbnail Gallery */}
//             <div className="flex items-center space-x-2 overflow-x-auto">
//               <button
//                 onClick={prevImage}
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded"
//                 disabled={combinedImages.length <= 1}
//               >
//                 <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>

//               {combinedImages.map((image, index) => (
//                 <button
//                   key={`${image.type}-${image.variantId || image.index}`}
//                   onClick={() => setSelectedImageIndex(index)}
//                   className={`flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
//                     selectedImageIndex === index
//                       ? "border-black"
//                       : "border-transparent"
//                   }`}
//                 >
//                   <Image
//                     src={image.src}
//                     alt={`${
//                       image.type === "variant" ? "Variant" : "Product"
//                     } Image ${index + 1}`}
//                     width={80}
//                     height={80}
//                     className="w-full h-full object-cover"
//                   />
//                 </button>
//               ))}

//               <button
//                 onClick={nextImage}
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded"
//                 disabled={combinedImages.length <= 1}
//               >
//                 <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Right - Product Info */}
//           <div className="space-y-4 sm:space-y-6">
//             <div>
//               <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
//                 {product.name}
//               </h1>
//               <div className="flex items-center space-x-2 mb-1 sm:mb-2">
//                 {isOnSale ? (
//                   <>
//                     <span className="text-lg sm:text-xl md:text-2xl font-semibold text-red-500">
//                       $
//                       {effectivePrice.toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                       })}{" "}
//                       USD
//                     </span>
//                     <span className="text-sm sm:text-base text-gray-400 line-through">
//                       $
//                       {originalPrice.toLocaleString(undefined, {
//                         minimumFractionDigits: 2,
//                       })}{" "}
//                       USD
//                     </span>
//                   </>
//                 ) : (
//                   <span className="text-lg sm:text-xl md:text-2xl font-semibold">
//                     $
//                     {effectivePrice.toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                     })}{" "}
//                     USD
//                   </span>
//                 )}
//               </div>
//               <p className="text-xs sm:text-sm text-gray-600">
//                 <span className="underline">Shipping</span> calculated at
//                 checkout.
//               </p>
//               <p className="text-xs sm:text-sm text-gray-600 mt-1">
//                 <span className="font-medium">Stock:</span>{" "}
//                 {(selectedVariant ? selectedVariant.stock : product.stock) >
//                 0 ? (
//                   <span className="text-green-600">In stock</span>
//                 ) : (
//                   <span className="text-red-600">Out of stock</span>
//                 )}
//               </p>
//             </div>

//             {/* Shop Pay */}
//             <div className="text-xs sm:text-sm text-gray-600">
//               <p>
//                 Pay in 4 interest-free installments of{" "}
//                 <strong>${(effectivePrice / 4).toFixed(2)}</strong> with
//               </p>
//               <div className="flex items-center mt-1">
//                 <span className="bg-purple-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-semibold">
//                   Shop
//                 </span>
//                 <span className="text-purple-600 font-semibold ml-1">Pay</span>
//                 <button className="ml-1 sm:ml-2 text-purple-600 underline text-xs">
//                   Learn more
//                 </button>
//               </div>
//             </div>

//             {/* Variant Selection */}
//             {product.variants?.length > 0 && (
//               <div className="space-y-2 sm:space-y-3">
//                 <label className="block text-xs sm:text-sm font-medium">
//                   Variant
//                 </label>
//                 <div className="relative">
//                   <select
//                     value={selectedVariant?._id || ""}
//                     onChange={(e) => {
//                       const variant = product.variants.find(
//                         (v) => v._id === e.target.value
//                       );
//                       setSelectedVariant(variant);
//                       setQuantity(1);
//                     }}
//                     className="w-full p-2 sm:p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-xs sm:text-sm"
//                   >
//                     {product.variants.map((variant) => (
//                       <option key={variant._id} value={variant._id}>
//                         {variant.size} / {variant.color}
//                       </option>
//                     ))}
//                   </select>
//                   <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
//                 </div>
//               </div>
//             )}

//             {/* Quantity */}
//             <div className="space-y-2 sm:space-y-3">
//               <label className="block text-xs sm:text-sm font-medium">
//                 Quantity
//               </label>
//               <div className="flex items-center border border-gray-300 rounded-md w-24 sm:w-32">
//                 <button
//                   onClick={decreaseQuantity}
//                   className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
//                   disabled={quantity === 1}
//                 >
//                   <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>
//                 <span className="flex-1 text-center py-2 sm:py-3 border-x border-gray-300 text-xs sm:text-sm">
//                   {quantity}
//                 </span>
//                 <button
//                   onClick={increaseQuantity}
//                   className="p-2 sm:p-3 hover:bg-gray-100 transition-colors"
//                   disabled={
//                     quantity >=
//                     (selectedVariant ? selectedVariant.stock : product.stock)
//                   }
//                 >
//                   <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart Buttons */}
//             <div className="space-y-2 sm:space-y-3">
//               <button
//                 className="w-full py-3 sm:py-4 border-2 border-black text-black font-semibold rounded-md hover:bg-black hover:text-white transition-colors text-xs sm:text-sm"
//                 disabled={
//                   (selectedVariant ? selectedVariant.stock : product.stock) ===
//                   0
//                 }
//                 onClick={handleAddToCart}
//               >
//                 Add to cart
//               </button>
//               <button
//                 className="w-full py-3 sm:py-4 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition-colors text-xs sm:text-sm"
//                 disabled={
//                   (selectedVariant ? selectedVariant.stock : product.stock) ===
//                   0
//                 }
//               >
//                 Buy with ShopPay
//               </button>
//               <button className="w-full text-center text-xs sm:text-sm text-gray-600 underline hover:text-black">
//                 More payment options
//               </button>
//             </div>

//             {/* Product Details */}
//             <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-gray-200">
//               <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
//                 <p>
//                   <span className="font-medium">Category:</span>{" "}
//                   {product.category?.name || "N/A"}
//                 </p>
//                 <p>
//                   <span className="font-medium">Description:</span>{" "}
//                   {product.description || "No description available"}
//                 </p>
//                 <p>
//                   <span className="font-medium">Created At:</span>{" "}
//                   {new Date(product.createdAt).toLocaleString()}
//                 </p>
//                 {product.variants?.length > 0 && (
//                   <p>
//                     <span className="font-medium">Available Variants:</span>{" "}
//                     {product.variants
//                       .map((v) => `${v.size}/${v.color}`)
//                       .join(", ")}
//                   </p>
//                 )}
//               </div>

//               {/* Size Chart (Mock, replace with API data if available) */}
//               <div className="space-y-2 sm:space-y-3">
//                 <h3 className="font-medium text-xs sm:text-sm">Size Chart</h3>
//                 <div className="text-xs sm:text-sm text-gray-600 space-y-1">
//                   <p>S: 1M4 - 1M65 (40 - 55KG) (26 - 29)</p>
//                   <p>M: 1M65 - 1M8 (55 - 70KG) (30 - 32)</p>
//                   <p>L: 1M75 - 1M9 (70 - 90KG) (32 - 35)</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;

import ProductDetail from "../../components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
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
