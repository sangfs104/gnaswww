// // "use client";
// // import { useState, useEffect } from "react";
// // import { ChevronDown, X, Filter, ArrowLeft } from "lucide-react";
// // import Image from "next/image";
// // import Link from "next/link";
// // const ProductCollection = () => {
// //   const [selectedFilter, setSelectedFilter] = useState("Trạng thái sản sàng");
// //   const [showStockFilter, setShowStockFilter] = useState(false);
// //   const [showPriceFilter, setShowPriceFilter] = useState(false);
// //   const [showSortOptions, setShowSortOptions] = useState(false);
// //   const [showMobileFilter, setShowMobileFilter] = useState(false);
// //   const [mobileFilterView, setMobileFilterView] = useState("main"); // 'main', 'status', 'price', 'sort'
// //   const [sortBy, setSortBy] = useState("Featured");
// //   const [stockFilter, setStockFilter] = useState([]);
// //   const [priceRange, setPriceRange] = useState({ from: "", to: "" });
// //   const [products, setProducts] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   const sortOptions = [
// //     "Featured",
// //     "Best selling",
// //     "Alphabetically, A-Z",
// //     "Alphabetically, Z-A",
// //     "Price, low to high",
// //     "Price, high to low",
// //     "Date, old to new",
// //     "Date, new to old",
// //   ];

// //   // Fetch products from API
// //   useEffect(() => {
// //     const fetchProducts = async () => {
// //       try {
// //         const response = await fetch("http://localhost:3000/api/products");
// //         if (!response.ok) {
// //           throw new Error("Failed to fetch products");
// //         }
// //         const data = await response.json();
// //         setProducts(
// //           data.map((product) => {
// //             // Validate discountPrice: must be reasonable and less than price
// //             const hasValidDiscount =
// //               product.discountPrice &&
// //               product.discountPrice < product.price &&
// //               product.discountPrice < 1e6; // Arbitrary cap to filter out invalid values like 3e+19
// //             return {
// //               id: product._id,
// //               name: product.name,
// //               originalPrice: product.price,
// //               discountPrice: hasValidDiscount ? product.discountPrice : null,
// //               displayPrice: hasValidDiscount
// //                 ? `$${product.discountPrice.toFixed(2)} USD`
// //                 : `$${product.price.toFixed(2)} USD`,
// //               image: product.images[0] || "/img/placeholder.jpg", // Use first image or fallback
// //               inStock: product.stock > 0,
// //               createdAt: product.createdAt,
// //             };
// //           })
// //         );
// //         setLoading(false);
// //       } catch (err) {
// //         setError(err.message);
// //         setLoading(false);
// //       }
// //     };
// //     fetchProducts();
// //   }, []);

// //   // Filter and sort products
// //   const getFilteredProducts = () => {
// //     let filteredProducts = [...products];

// //     // Apply stock filter
// //     if (stockFilter.includes("In stock")) {
// //       filteredProducts = filteredProducts.filter((product) => product.inStock);
// //     }
// //     if (stockFilter.includes("Out of stock")) {
// //       filteredProducts = filteredProducts.filter((product) => !product.inStock);
// //     }

// //     // Apply price filter (use discountPrice if available, else originalPrice)
// //     if (priceRange.from || priceRange.to) {
// //       filteredProducts = filteredProducts.filter((product) => {
// //         const price = product.discountPrice || product.originalPrice;
// //         const from = priceRange.from ? parseFloat(priceRange.from) : 0;
// //         const to = priceRange.to ? parseFloat(priceRange.to) : Infinity;
// //         return price >= from && price <= to;
// //       });
// //     }

// //     // Apply sorting (use discountPrice if available, else originalPrice)
// //     switch (sortBy) {
// //       case "Alphabetically, A-Z":
// //         filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
// //         break;
// //       case "Alphabetically, Z-A":
// //         filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
// //         break;
// //       case "Price, low to high":
// //         filteredProducts.sort((a, b) => {
// //           const priceA = a.discountPrice || a.originalPrice;
// //           const priceB = b.discountPrice || b.originalPrice;
// //           return priceA - priceB;
// //         });
// //         break;
// //       case "Price, high to low":
// //         filteredProducts.sort((a, b) => {
// //           const priceA = a.discountPrice || a.originalPrice;
// //           const priceB = b.discountPrice || b.originalPrice;
// //           return priceB - priceA;
// //         });
// //         break;
// //       case "Date, old to new":
// //         filteredProducts.sort(
// //           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
// //         );
// //         break;
// //       case "Date, new to old":
// //         filteredProducts.sort(
// //           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
// //         );
// //         break;
// //       default:
// //         break;
// //     }

// //     return filteredProducts;
// //   };

// //   const handleStockFilterChange = (option, checked) => {
// //     if (checked) {
// //       setStockFilter([...stockFilter, option]);
// //     } else {
// //       setStockFilter(stockFilter.filter((item) => item !== option));
// //     }
// //   };

// //   const resetFilters = () => {
// //     setStockFilter([]);
// //     setPriceRange({ from: "", to: "" });
// //     setShowStockFilter(false);
// //     setShowPriceFilter(false);
// //   };

// //   const clearFilters = () => {
// //     setStockFilter([]);
// //     setPriceRange({ from: "", to: "" });
// //   };

// //   const applyFilters = () => {
// //     setShowMobileFilter(false);
// //     setMobileFilterView("main");
// //   };

// //   const getFilteredProductCount = () => {
// //     return getFilteredProducts().length;
// //   };

// //   const hasActiveFilters = () => {
// //     return stockFilter.length > 0 || priceRange.from || priceRange.to;
// //   };

// //   if (loading) {
// //     return <div className="text-center py-8">Loading...</div>;
// //   }

// //   if (error) {
// //     return <div className="text-center py-8 text-red-500">Error: {error}</div>;
// //   }

// //   return (
// //     <div className="min-h-screen">
// //       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-8">
// //         <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
// //           All collection
// //         </h1>

// //         {/* Desktop Filter and Sort Bar */}
// //         <div className="hidden md:flex justify-between items-center mb-8">
// //           <div className="flex items-center space-x-4">
// //             <span className="text-sm text-gray-600">Filter:</span>

// //             {/* Status Filter */}
// //             <div className="relative">
// //               <button
// //                 onClick={() => {
// //                   setShowStockFilter(!showStockFilter);
// //                   setShowPriceFilter(false);
// //                 }}
// //                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
// //               >
// //                 <span className="text-sm">{selectedFilter}</span>
// //                 <ChevronDown className="w-4 h-4" />
// //               </button>

// //               {showStockFilter && (
// //                 <div className="absolute top-full mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
// //                   <div className="p-4">
// //                     <div className="flex justify-between items-center mb-4">
// //                       <span className="text-sm text-gray-500">
// //                         {stockFilter.length} selected
// //                       </span>
// //                       <button
// //                         onClick={resetFilters}
// //                         className="text-sm text-gray-500 hover:text-gray-700 underline"
// //                       >
// //                         Reset
// //                       </button>
// //                     </div>

// //                     <div className="space-y-3">
// //                       <label className="flex items-center">
// //                         <input
// //                           type="checkbox"
// //                           checked={stockFilter.includes("In stock")}
// //                           onChange={(e) =>
// //                             handleStockFilterChange(
// //                               "In stock",
// //                               e.target.checked
// //                             )
// //                           }
// //                           className="mr-2"
// //                         />
// //                         <span className="text-sm">In stock</span>
// //                       </label>
// //                       <label className="flex items-center">
// //                         <input
// //                           type="checkbox"
// //                           checked={stockFilter.includes("Out of stock")}
// //                           onChange={(e) =>
// //                             handleStockFilterChange(
// //                               "Out of stock",
// //                               e.target.checked
// //                             )
// //                           }
// //                           className="mr-2"
// //                         />
// //                         <span className="text-sm">Out of stock</span>
// //                       </label>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>

// //             {/* Price Filter */}
// //             <div className="relative">
// //               <button
// //                 onClick={() => {
// //                   setShowPriceFilter(!showPriceFilter);
// //                   setShowStockFilter(false);
// //                 }}
// //                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
// //               >
// //                 <span className="text-sm">Giá</span>
// //                 <ChevronDown className="w-4 h-4" />
// //               </button>

// //               {showPriceFilter && (
// //                 <div className="absolute top-full mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10">
// //                   <div className="p-4">
// //                     <div className="mb-4">
// //                       <span className="text-sm text-gray-500">
// //                         The highest price is $
// //                         {Math.max(
// //                           ...products.map(
// //                             (p) => p.discountPrice || p.originalPrice
// //                           )
// //                         ).toFixed(2)}
// //                       </span>
// //                       <button
// //                         onClick={resetFilters}
// //                         className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
// //                       >
// //                         Reset
// //                       </button>
// //                     </div>

// //                     <div className="flex space-x-2">
// //                       <div className="flex-1">
// //                         <span className="text-sm mr-2">$</span>
// //                         <input
// //                           type="text"
// //                           placeholder="From"
// //                           value={priceRange.from}
// //                           onChange={(e) =>
// //                             setPriceRange({
// //                               ...priceRange,
// //                               from: e.target.value,
// //                             })
// //                           }
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //                         />
// //                       </div>
// //                       <div className="flex-1">
// //                         <span className="text-sm mr-2">$</span>
// //                         <input
// //                           type="text"
// //                           placeholder="To"
// //                           value={priceRange.to}
// //                           onChange={(e) =>
// //                             setPriceRange({ ...priceRange, to: e.target.value })
// //                           }
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-md"
// //                         />
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           <div className="flex items-center space-x-4">
// //             <span className="text-sm text-gray-600">Sort by:</span>
// //             <div className="relative">
// //               <button
// //                 onClick={() => setShowSortOptions(!showSortOptions)}
// //                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
// //               >
// //                 <span className="text-sm">{sortBy}</span>
// //                 <ChevronDown className="w-4 h-4" />
// //               </button>

// //               {showSortOptions && (
// //                 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
// //                   <div className="py-2">
// //                     {sortOptions.map((option) => (
// //                       <button
// //                         key={option}
// //                         onClick={() => {
// //                           setSortBy(option);
// //                           setShowSortOptions(false);
// //                         }}
// //                         className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
// //                           sortBy === option ? "bg-gray-100 font-medium" : ""
// //                         }`}
// //                       >
// //                         {option}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //             <span className="text-sm text-gray-600">
// //               {getFilteredProductCount()} products
// //             </span>
// //           </div>
// //         </div>

// //         {/* Mobile Filter Bar */}
// //         <div className="md:hidden flex justify-between items-center mb-6">
// //           <button
// //             onClick={() => setShowMobileFilter(true)}
// //             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white"
// //           >
// //             <Filter className="w-4 h-4" />
// //             <span className="text-sm">Filter and sort</span>
// //           </button>
// //           <span className="text-sm text-gray-600">
// //             {getFilteredProductCount()} of {products.length} products
// //           </span>
// //         </div>

// //         {/* Active Filters Display (Mobile) */}
// //         {hasActiveFilters() && (
// //           <div className="md:hidden mb-4 flex items-center space-x-2">
// //             {priceRange.from && priceRange.to && (
// //               <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
// //                 <span>
// //                   ${priceRange.from}.00 - ${priceRange.to}.00
// //                 </span>
// //                 <button
// //                   onClick={() => setPriceRange({ from: "", to: "" })}
// //                   className="ml-2"
// //                 >
// //                   <X className="w-3 h-3" />
// //                 </button>
// //               </div>
// //             )}
// //             <button
// //               onClick={clearFilters}
// //               className="text-sm text-gray-600 underline"
// //             >
// //               Remove all
// //             </button>
// //           </div>
// //         )}

// //         {/* Mobile Filter Overlay */}
// //         {showMobileFilter && (
// //           <div className="fixed inset-0 z-50 md:hidden">
// //             <div className="absolute inset-0 bg-black bg-opacity-50" />
// //             <div className="absolute right-0 top-0 h-full w-full bg-white">
// //               {/* Main Filter Menu */}
// //               {mobileFilterView === "main" && (
// //                 <div className="flex flex-col h-full">
// //                   <div className="flex items-center justify-between p-4 border-b">
// //                     <button onClick={() => setShowMobileFilter(false)}>
// //                       <ArrowLeft className="w-5 h-5" />
// //                     </button>
// //                     <h2 className="text-lg font-medium">Filter and sort</h2>
// //                     <button onClick={() => setShowMobileFilter(false)}>
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>

// //                   <div className="text-center py-2 text-sm text-gray-600 border-b">
// //                     {getFilteredProductCount()} products
// //                   </div>

// //                   <div className="flex-1">
// //                     <button
// //                       onClick={() => setMobileFilterView("status")}
// //                       className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
// //                     >
// //                       <span>Trạng thái sản sàng</span>
// //                       <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
// //                     </button>
// //                     <button
// //                       onClick={() => setMobileFilterView("price")}
// //                       className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
// //                     >
// //                       <span>Giá</span>
// //                       <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
// //                     </button>
// //                     <div className="p-4 border-b">
// //                       <div className="flex items-center justify-between mb-2">
// //                         <span>Sort by:</span>
// //                       </div>
// //                       <select
// //                         value={sortBy}
// //                         onChange={(e) => setSortBy(e.target.value)}
// //                         className="w-full p-3 border border-gray-300 rounded-md"
// //                       >
// //                         {sortOptions.map((option) => (
// //                           <option key={option} value={option}>
// //                             {option}
// //                           </option>
// //                         ))}
// //                       </select>
// //                     </div>
// //                   </div>

// //                   <div className="p-4 border-t bg-white">
// //                     <div className="flex space-x-3">
// //                       <button
// //                         onClick={clearFilters}
// //                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
// //                       >
// //                         Remove all
// //                       </button>
// //                       <button
// //                         onClick={applyFilters}
// //                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
// //                       >
// //                         Apply
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Status Filter View */}
// //               {mobileFilterView === "status" && (
// //                 <div className="flex flex-col h-full">
// //                   <div className="flex items-center justify-between p-4 border-b">
// //                     <button onClick={() => setMobileFilterView("main")}>
// //                       <ArrowLeft className="w-5 h-5" />
// //                     </button>
// //                     <h2 className="text-lg font-medium">Trạng thái sản sàng</h2>
// //                     <button onClick={() => setShowMobileFilter(false)}>
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>

// //                   <div className="text-center py-2 text-sm text-gray-600 border-b">
// //                     {getFilteredProductCount()} of {products.length} products
// //                   </div>

// //                   <div className="flex-1 p-4">
// //                     <div className="space-y-4">
// //                       <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
// //                         <input
// //                           type="checkbox"
// //                           checked={stockFilter.includes("In stock")}
// //                           onChange={(e) =>
// //                             handleStockFilterChange(
// //                               "In stock",
// //                               e.target.checked
// //                             )
// //                           }
// //                           className="mr-3 w-4 h-4"
// //                         />
// //                         <span>In stock</span>
// //                       </label>
// //                       <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
// //                         <input
// //                           type="checkbox"
// //                           checked={stockFilter.includes("Out of stock")}
// //                           onChange={(e) =>
// //                             handleStockFilterChange(
// //                               "Out of stock",
// //                               e.target.checked
// //                             )
// //                           }
// //                           className="mr-3 w-4 h-4"
// //                         />
// //                         <span>Out of stock</span>
// //                       </label>
// //                     </div>
// //                   </div>

// //                   <div className="p-4 border-t bg-white">
// //                     <div className="flex space-x-3">
// //                       <button
// //                         onClick={clearFilters}
// //                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
// //                       >
// //                         Clear
// //                       </button>
// //                       <button
// //                         onClick={applyFilters}
// //                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
// //                       >
// //                         Apply
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Price Filter View */}
// //               {mobileFilterView === "price" && (
// //                 <div className="flex flex-col h-full">
// //                   <div className="flex items-center justify-between p-4 border-b">
// //                     <button onClick={() => setMobileFilterView("main")}>
// //                       <ArrowLeft className="w-5 h-5" />
// //                     </button>
// //                     <h2 className="text-lg font-medium">Giá</h2>
// //                     <button onClick={() => setShowMobileFilter(false)}>
// //                       <X className="w-5 h-5" />
// //                     </button>
// //                   </div>

// //                   <div className="text-center py-2 text-sm text-gray-600 border-b">
// //                     {getFilteredProductCount()} products
// //                   </div>

// //                   <div className="flex-1 p-4">
// //                     <div className="mb-4">
// //                       <span className="text-sm text-gray-500">
// //                         The highest price is $
// //                         {Math.max(
// //                           ...products.map(
// //                             (p) => p.discountPrice || p.originalPrice
// //                           )
// //                         ).toFixed(2)}
// //                       </span>
// //                     </div>

// //                     <div className="space-y-4">
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">
// //                           From
// //                         </label>
// //                         <div className="flex items-center border border-gray-300 rounded-md">
// //                           <span className="px-3 text-sm">$</span>
// //                           <input
// //                             type="text"
// //                             placeholder="0.00"
// //                             value={priceRange.from}
// //                             onChange={(e) =>
// //                               setPriceRange({
// //                                 ...priceRange,
// //                                 from: e.target.value,
// //                               })
// //                             }
// //                             className="flex-1 py-3 px-2 border-0 focus:ring-0"
// //                           />
// //                         </div>
// //                       </div>
// //                       <div>
// //                         <label className="block text-sm font-medium mb-1">
// //                           To
// //                         </label>
// //                         <div className="flex items-center border border-gray-300 rounded-md">
// //                           <span className="px-3 text-sm">$</span>
// //                           <input
// //                             type="text"
// //                             placeholder={Math.max(
// //                               ...products.map(
// //                                 (p) => p.discountPrice || p.originalPrice
// //                               )
// //                             ).toFixed(2)}
// //                             value={priceRange.to}
// //                             onChange={(e) =>
// //                               setPriceRange({
// //                                 ...priceRange,
// //                                 to: e.target.value,
// //                               })
// //                             }
// //                             className="flex-1 py-3 px-2 border-0 focus:ring-0"
// //                           />
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="p-4 border-t bg-white">
// //                     <div className="flex space-x-3">
// //                       <button
// //                         onClick={() => setPriceRange({ from: "", to: "" })}
// //                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
// //                       >
// //                         Clear
// //                       </button>
// //                       <button
// //                         onClick={applyFilters}
// //                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
// //                       >
// //                         Apply
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         )}

// //         {/* Products Grid */}
// //         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
// //           {getFilteredProducts().map((product) => (
// //             <div
// //               key={product.id}
// //               className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
// //             >
// //               <div className="aspect-square bg-gray-100">
// //                 {/* <Image
// //                   src={product.image}
// //                   alt={product.name}
// //                   width={280}
// //                   height={280}
// //                   className="w-full h-full object-cover"
// //                 /> */}
// //                 <Link href={`/products/${product.id}`}>
// //                   <div className="aspect-square bg-gray-100 cursor-pointer">
// //                     <Image
// //                       src={product.image}
// //                       alt={product.name}
// //                       width={280}
// //                       height={280}
// //                       className="w-full h-full object-cover"
// //                     />
// //                   </div>
// //                 </Link>
// //               </div>
// //               <div className="p-3 md:p-4">
// //                 <h3 className="font-bold text-xs md:text-sm mb-2 uppercase">
// //                   {product.name}
// //                 </h3>
// //                 <div className="text-xs md:text-sm text-gray-600">
// //                   {product.discountPrice ? (
// //                     <div className="flex items-center space-x-2">
// //                       <span className="text-red-500">
// //                         ${product.discountPrice.toFixed(2)} USD
// //                       </span>
// //                       <span className="line-through text-gray-400">
// //                         ${product.originalPrice.toFixed(2)} USD
// //                       </span>
// //                     </div>
// //                   ) : (
// //                     <span>${product.originalPrice.toFixed(2)} USD</span>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductCollection;

// "use client";
// import { useState, useEffect } from "react";
// import { ChevronDown, X, Filter, ArrowLeft } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// const ProductCollection = () => {
//   const [selectedFilter, setSelectedFilter] = useState("Trạng thái sản phẩm");
//   const [showStockFilter, setShowStockFilter] = useState(false);
//   const [showPriceFilter, setShowPriceFilter] = useState(false);
//   const [showSortOptions, setShowSortOptions] = useState(false);
//   const [showMobileFilter, setShowMobileFilter] = useState(false);
//   const [mobileFilterView, setMobileFilterView] = useState("main"); // 'main', 'status', 'price', 'sort'
//   const [sortBy, setSortBy] = useState("Featured");
//   const [stockFilter, setStockFilter] = useState([]);
//   const [priceRange, setPriceRange] = useState({ from: "", to: "" });
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const sortOptions = [
//     "Featured",
//     "Best selling",
//     "Alphabetically, A-Z",
//     "Alphabetically, Z-A",
//     "Price, low to high",
//     "Price, high to low",
//     "Date, old to new",
//     "Date, new to old",
//   ];

//   // Fetch products from API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("http://localhost:3000/api/products");
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data = await response.json();
//         setProducts(
//           data.map((product) => {
//             // Extract price and discountPrice from the first variant
//             const variant =
//               product.variants && product.variants.length > 0
//                 ? product.variants[0]
//                 : {};
//             const price = variant.price || 0; // Default to 0 if no price
//             const discountPrice = variant.discountPrice || null;
//             const hasValidDiscount =
//               discountPrice && discountPrice < price && discountPrice < 1e6;

//             return {
//               id: product._id,
//               name: product.name,
//               originalPrice: price,
//               discountPrice: hasValidDiscount ? discountPrice : null,
//               displayPrice: hasValidDiscount
//                 ? `$${(discountPrice / 1000).toFixed(2)} USD` // Convert to USD (assuming price is in VND)
//                 : `$${(price / 1000).toFixed(2)} USD`,
//               image:
//                 product.images && product.images.length > 0
//                   ? product.images[0]
//                   : "/img/placeholder.jpg",
//               inStock: variant.stock > 0,
//               createdAt: product.createdAt,
//             };
//           })
//         );
//         setLoading(false);
//       } catch (err) {
//         setError(err.message);
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Filter and sort products
//   const getFilteredProducts = () => {
//     let filteredProducts = [...products];

//     // Apply stock filter
//     if (stockFilter.includes("In stock")) {
//       filteredProducts = filteredProducts.filter((product) => product.inStock);
//     }
//     if (stockFilter.includes("Out of stock")) {
//       filteredProducts = filteredProducts.filter((product) => !product.inStock);
//     }

//     // Apply price filter (use discountPrice if available, else originalPrice)
//     if (priceRange.from || priceRange.to) {
//       filteredProducts = filteredProducts.filter((product) => {
//         const price = (product.discountPrice || product.originalPrice) / 1000; // Convert to USD
//         const from = priceRange.from ? parseFloat(priceRange.from) : 0;
//         const to = priceRange.to ? parseFloat(priceRange.to) : Infinity;
//         return price >= from && price <= to;
//       });
//     }

//     // Apply sorting
//     switch (sortBy) {
//       case "Alphabetically, A-Z":
//         filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
//         break;
//       case "Alphabetically, Z-A":
//         filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
//         break;
//       case "Price, low to high":
//         filteredProducts.sort((a, b) => {
//           const priceA = (a.discountPrice || a.originalPrice) / 1000;
//           const priceB = (b.discountPrice || b.originalPrice) / 1000;
//           return priceA - priceB;
//         });
//         break;
//       case "Price, high to low":
//         filteredProducts.sort((a, b) => {
//           const priceA = (a.discountPrice || a.originalPrice) / 1000;
//           const priceB = (b.discountPrice || b.originalPrice) / 1000;
//           return priceB - priceA;
//         });
//         break;
//       case "Date, old to new":
//         filteredProducts.sort(
//           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//         );
//         break;
//       case "Date, new to old":
//         filteredProducts.sort(
//           (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//         );
//         break;
//       default:
//         break;
//     }

//     return filteredProducts;
//   };

//   const handleStockFilterChange = (option, checked) => {
//     if (checked) {
//       setStockFilter([...stockFilter, option]);
//     } else {
//       setStockFilter(stockFilter.filter((item) => item !== option));
//     }
//   };

//   const resetFilters = () => {
//     setStockFilter([]);
//     setPriceRange({ from: "", to: "" });
//     setShowStockFilter(false);
//     setShowPriceFilter(false);
//   };

//   const clearFilters = () => {
//     setStockFilter([]);
//     setPriceRange({ from: "", to: "" });
//   };

//   const applyFilters = () => {
//     setShowMobileFilter(false);
//     setMobileFilterView("main");
//   };

//   const getFilteredProductCount = () => {
//     return getFilteredProducts().length;
//   };

//   const hasActiveFilters = () => {
//     return stockFilter.length > 0 || priceRange.from || priceRange.to;
//   };

//   if (loading) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   if (error) {
//     return <div className="text-center py-8 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="min-h-screen">
//       <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-8">
//         <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
//           All collection
//         </h1>

//         {/* Desktop Filter and Sort Bar */}
//         <div className="hidden md:flex justify-between items-center mb-8">
//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-gray-600">Filter:</span>

//             {/* Status Filter */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setShowStockFilter(!showStockFilter);
//                   setShowPriceFilter(false);
//                 }}
//                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
//               >
//                 <span className="text-sm">{selectedFilter}</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {showStockFilter && (
//                 <div className="absolute top-full mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                   <div className="p-4">
//                     <div className="flex justify-between items-center mb-4">
//                       <span className="text-sm text-gray-500">
//                         {stockFilter.length} selected
//                       </span>
//                       <button
//                         onClick={resetFilters}
//                         className="text-sm text-gray-500 hover:text-gray-700 underline"
//                       >
//                         Reset
//                       </button>
//                     </div>

//                     <div className="space-y-3">
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={stockFilter.includes("In stock")}
//                           onChange={(e) =>
//                             handleStockFilterChange(
//                               "In stock",
//                               e.target.checked
//                             )
//                           }
//                           className="mr-2"
//                         />
//                         <span className="text-sm">In stock</span>
//                       </label>
//                       <label className="flex items-center">
//                         <input
//                           type="checkbox"
//                           checked={stockFilter.includes("Out of stock")}
//                           onChange={(e) =>
//                             handleStockFilterChange(
//                               "Out of stock",
//                               e.target.checked
//                             )
//                           }
//                           className="mr-2"
//                         />
//                         <span className="text-sm">Out of stock</span>
//                       </label>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Price Filter */}
//             <div className="relative">
//               <button
//                 onClick={() => {
//                   setShowPriceFilter(!showPriceFilter);
//                   setShowStockFilter(false);
//                 }}
//                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
//               >
//                 <span className="text-sm">Giá</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {showPriceFilter && (
//                 <div className="absolute top-full mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                   <div className="p-4">
//                     <div className="mb-4">
//                       <span className="text-sm text-gray-500">
//                         The highest price is $
//                         {Math.max(
//                           ...products.map(
//                             (p) => (p.discountPrice || p.originalPrice) / 1000
//                           )
//                         ).toFixed(2)}
//                       </span>
//                       <button
//                         onClick={resetFilters}
//                         className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
//                       >
//                         Reset
//                       </button>
//                     </div>

//                     <div className="flex space-x-2">
//                       <div className="flex-1">
//                         <span className="text-sm mr-2">$</span>
//                         <input
//                           type="text"
//                           placeholder="From"
//                           value={priceRange.from}
//                           onChange={(e) =>
//                             setPriceRange({
//                               ...priceRange,
//                               from: e.target.value,
//                             })
//                           }
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                       <div className="flex-1">
//                         <span className="text-sm mr-2">$</span>
//                         <input
//                           type="text"
//                           placeholder="To"
//                           value={priceRange.to}
//                           onChange={(e) =>
//                             setPriceRange({ ...priceRange, to: e.target.value })
//                           }
//                           className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="flex items-center space-x-4">
//             <span className="text-sm text-gray-600">Sort by:</span>
//             <div className="relative">
//               <button
//                 onClick={() => setShowSortOptions(!showSortOptions)}
//                 className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
//               >
//                 <span className="text-sm">{sortBy}</span>
//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {showSortOptions && (
//                 <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
//                   <div className="py-2">
//                     {sortOptions.map((option) => (
//                       <button
//                         key={option}
//                         onClick={() => {
//                           setSortBy(option);
//                           setShowSortOptions(false);
//                         }}
//                         className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
//                           sortBy === option ? "bg-gray-100 font-medium" : ""
//                         }`}
//                       >
//                         {option}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//             <span className="text-sm text-gray-600">
//               {getFilteredProductCount()} products
//             </span>
//           </div>
//         </div>

//         {/* Mobile Filter Bar */}
//         <div className="md:hidden flex justify-between items-center mb-6">
//           <button
//             onClick={() => setShowMobileFilter(true)}
//             className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white"
//           >
//             <Filter className="w-4 h-4" />
//             <span className="text-sm">Filter and sort</span>
//           </button>
//           <span className="text-sm text-gray-600">
//             {getFilteredProductCount()} of {products.length} products
//           </span>
//         </div>

//         {/* Active Filters Display (Mobile) */}
//         {hasActiveFilters() && (
//           <div className="md:hidden mb-4 flex items-center space-x-2">
//             {priceRange.from && priceRange.to && (
//               <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
//                 <span>
//                   ${priceRange.from}.00 - ${priceRange.to}.00
//                 </span>
//                 <button
//                   onClick={() => setPriceRange({ from: "", to: "" })}
//                   className="ml-2"
//                 >
//                   <X className="w-3 h-3" />
//                 </button>
//               </div>
//             )}
//             <button
//               onClick={clearFilters}
//               className="text-sm text-gray-600 underline"
//             >
//               Remove all
//             </button>
//           </div>
//         )}

//         {/* Mobile Filter Overlay */}
//         {showMobileFilter && (
//           <div className="fixed inset-0 z-50 md:hidden">
//             <div className="absolute inset-0 bg-black bg-opacity-50" />
//             <div className="absolute right-0 top-0 h-full w-full bg-white">
//               {/* Main Filter Menu */}
//               {mobileFilterView === "main" && (
//                 <div className="flex flex-col h-full">
//                   <div className="flex items-center justify-between p-4 border-b">
//                     <button onClick={() => setShowMobileFilter(false)}>
//                       <ArrowLeft className="w-5 h-5" />
//                     </button>
//                     <h2 className="text-lg font-medium">Filter and sort</h2>
//                     <button onClick={() => setShowMobileFilter(false)}>
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>

//                   <div className="text-center py-2 text-sm text-gray-600 border-b">
//                     {getFilteredProductCount()} products
//                   </div>

//                   <div className="flex-1">
//                     <button
//                       onClick={() => setMobileFilterView("status")}
//                       className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
//                     >
//                       <span>Trạng thái sản phẩm</span>
//                       <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
//                     </button>
//                     <button
//                       onClick={() => setMobileFilterView("price")}
//                       className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
//                     >
//                       <span>Giá</span>
//                       <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
//                     </button>
//                     <div className="p-4 border-b">
//                       <div className="flex items-center justify-between mb-2">
//                         <span>Sort by:</span>
//                       </div>
//                       <select
//                         value={sortBy}
//                         onChange={(e) => setSortBy(e.target.value)}
//                         className="w-full p-3 border border-gray-300 rounded-md"
//                       >
//                         {sortOptions.map((option) => (
//                           <option key={option} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t bg-white">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={clearFilters}
//                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
//                       >
//                         Remove all
//                       </button>
//                       <button
//                         onClick={applyFilters}
//                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Status Filter View */}
//               {mobileFilterView === "status" && (
//                 <div className="flex flex-col h-full">
//                   <div className="flex items-center justify-between p-4 border-b">
//                     <button onClick={() => setMobileFilterView("main")}>
//                       <ArrowLeft className="w-5 h-5" />
//                     </button>
//                     <h2 className="text-lg font-medium">Trạng thái sản phẩm</h2>
//                     <button onClick={() => setShowMobileFilter(false)}>
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>

//                   <div className="text-center py-2 text-sm text-gray-600 border-b">
//                     {getFilteredProductCount()} of {products.length} products
//                   </div>

//                   <div className="flex-1 p-4">
//                     <div className="space-y-4">
//                       <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
//                         <input
//                           type="checkbox"
//                           checked={stockFilter.includes("In stock")}
//                           onChange={(e) =>
//                             handleStockFilterChange(
//                               "In stock",
//                               e.target.checked
//                             )
//                           }
//                           className="mr-3 w-4 h-4"
//                         />
//                         <span>In stock</span>
//                       </label>
//                       <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
//                         <input
//                           type="checkbox"
//                           checked={stockFilter.includes("Out of stock")}
//                           onChange={(e) =>
//                             handleStockFilterChange(
//                               "Out of stock",
//                               e.target.checked
//                             )
//                           }
//                           className="mr-3 w-4 h-4"
//                         />
//                         <span>Out of stock</span>
//                       </label>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t bg-white">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={clearFilters}
//                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
//                       >
//                         Clear
//                       </button>
//                       <button
//                         onClick={applyFilters}
//                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Price Filter View */}
//               {mobileFilterView === "price" && (
//                 <div className="flex flex-col h-full">
//                   <div className="flex items-center justify-between p-4 border-b">
//                     <button onClick={() => setMobileFilterView("main")}>
//                       <ArrowLeft className="w-5 h-5" />
//                     </button>
//                     <h2 className="text-lg font-medium">Giá</h2>
//                     <button onClick={() => setShowMobileFilter(false)}>
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>

//                   <div className="text-center py-2 text-sm text-gray-600 border-b">
//                     {getFilteredProductCount()} products
//                   </div>

//                   <div className="flex-1 p-4">
//                     <div className="mb-4">
//                       <span className="text-sm text-gray-500">
//                         The highest price is $
//                         {Math.max(
//                           ...products.map(
//                             (p) => (p.discountPrice || p.originalPrice) / 1000
//                           )
//                         ).toFixed(2)}
//                       </span>
//                     </div>

//                     <div className="space-y-4">
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           From
//                         </label>
//                         <div className="flex items-center border border-gray-300 rounded-md">
//                           <span className="px-3 text-sm">$</span>
//                           <input
//                             type="text"
//                             placeholder="0.00"
//                             value={priceRange.from}
//                             onChange={(e) =>
//                               setPriceRange({
//                                 ...priceRange,
//                                 from: e.target.value,
//                               })
//                             }
//                             className="flex-1 py-3 px-2 border-0 focus:ring-0"
//                           />
//                         </div>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium mb-1">
//                           To
//                         </label>
//                         <div className="flex items-center border border-gray-300 rounded-md">
//                           <span className="px-3 text-sm">$</span>
//                           <input
//                             type="text"
//                             placeholder={Math.max(
//                               ...products.map(
//                                 (p) =>
//                                   (p.discountPrice || p.originalPrice) / 1000
//                               )
//                             ).toFixed(2)}
//                             value={priceRange.to}
//                             onChange={(e) =>
//                               setPriceRange({
//                                 ...priceRange,
//                                 to: e.target.value,
//                               })
//                             }
//                             className="flex-1 py-3 px-2 border-0 focus:ring-0"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="p-4 border-t bg-white">
//                     <div className="flex space-x-3">
//                       <button
//                         onClick={() => setPriceRange({ from: "", to: "" })}
//                         className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
//                       >
//                         Clear
//                       </button>
//                       <button
//                         onClick={applyFilters}
//                         className="flex-1 py-3 px-4 bg-black text-white rounded-md"
//                       >
//                         Apply
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Products Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//           {getFilteredProducts().map((product) => (
//             <div
//               key={product.id}
//               className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="aspect-square bg-gray-100">
//                 <Link href={`/products/${product.id}`}>
//                   <div className="aspect-square bg-gray-100 cursor-pointer">
//                     <Image
//                       src={product.image}
//                       alt={product.name}
//                       width={280}
//                       height={280}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 </Link>
//               </div>
//               <div className="p-3 md:p-4">
//                 <h3 className="font-bold text-xs md:text-sm mb-2 uppercase">
//                   {product.name}
//                 </h3>
//                 <div className="text-xs md:text-sm text-gray-600">
//                   {product.discountPrice ? (
//                     <div className="flex items-center space-x-2">
//                       <span className="text-red-500">
//                         ${(product.discountPrice / 1000).toFixed(2)} USD
//                       </span>
//                       <span className="line-through text-gray-400">
//                         ${(product.originalPrice / 1000).toFixed(2)} USD
//                       </span>
//                     </div>
//                   ) : (
//                     <span>
//                       ${(product.originalPrice / 1000).toFixed(2)} USD
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductCollection;
"use client";
import { useState, useEffect } from "react";
import { ChevronDown, X, Filter, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ProductCollection = () => {
  const [selectedFilter, setSelectedFilter] = useState("Product status");
  const [showStockFilter, setShowStockFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [mobileFilterView, setMobileFilterView] = useState("main"); // 'main', 'status', 'price', 'sort'
  const [sortBy, setSortBy] = useState("Featured");
  const [stockFilter, setStockFilter] = useState([]);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortOptions = [
    "Featured",
    "Best selling",
    "Alphabetically, A-Z",
    "Alphabetically, Z-A",
    "Price, low to high",
    "Price, high to low",
    "Date, old to new",
    "Date, new to old",
  ];

  // Function to format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(
          data.map((product) => {
            const variant =
              product.variants && product.variants.length > 0
                ? product.variants[0]
                : {};
            const price = variant.price || 0;
            const discountPrice = variant.discountPrice || null;
            const hasValidDiscount =
              discountPrice && discountPrice < price && discountPrice > 0;

            return {
              id: product._id,
              name: product.name,
              originalPrice: price,
              discountPrice: hasValidDiscount ? discountPrice : null,
              displayPrice: hasValidDiscount
                ? formatPrice(discountPrice)
                : formatPrice(price),
              image:
                product.images && product.images.length > 0
                  ? product.images[0]
                  : "/img/placeholder.jpg",
              inStock: variant.stock > 0,
              createdAt: product.createdAt,
            };
          })
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const getFilteredProducts = () => {
    let filteredProducts = [...products];

    // Apply stock filter
    if (stockFilter.includes("In stock")) {
      filteredProducts = filteredProducts.filter((product) => product.inStock);
    }
    if (stockFilter.includes("Out of stock")) {
      filteredProducts = filteredProducts.filter((product) => !product.inStock);
    }

    // Apply price filter
    if (priceRange.from || priceRange.to) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.discountPrice || product.originalPrice;
        const from = priceRange.from ? parseFloat(priceRange.from) : 0;
        const to = priceRange.to ? parseFloat(priceRange.to) : Infinity;
        return price >= from && price <= to;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "Alphabetically, A-Z":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "Alphabetically, Z-A":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "Price, low to high":
        filteredProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.originalPrice;
          const priceB = b.discountPrice || b.originalPrice;
          return priceA - priceB;
        });
        break;
      case "Price, high to low":
        filteredProducts.sort((a, b) => {
          const priceA = a.discountPrice || a.originalPrice;
          const priceB = b.discountPrice || b.originalPrice;
          return priceB - priceA;
        });
        break;
      case "Date, old to new":
        filteredProducts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "Date, new to old":
        filteredProducts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      default:
        break;
    }

    return filteredProducts;
  };

  const handleStockFilterChange = (option, checked) => {
    if (checked) {
      setStockFilter([...stockFilter, option]);
    } else {
      setStockFilter(stockFilter.filter((item) => item !== option));
    }
  };

  const resetFilters = () => {
    setStockFilter([]);
    setPriceRange({ from: "", to: "" });
    setShowStockFilter(false);
    setShowPriceFilter(false);
  };

  const clearFilters = () => {
    setStockFilter([]);
    setPriceRange({ from: "", to: "" });
  };

  const applyFilters = () => {
    setShowMobileFilter(false);
    setMobileFilterView("main");
  };

  const getFilteredProductCount = () => {
    return getFilteredProducts().length;
  };

  const hasActiveFilters = () => {
    return stockFilter.length > 0 || priceRange.from || priceRange.to;
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
          All collection
        </h1>

        {/* Desktop Filter and Sort Bar */}
        <div className="hidden md:flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Filter:</span>

            {/* Status Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowStockFilter(!showStockFilter);
                  setShowPriceFilter(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <span className="text-sm">{selectedFilter}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showStockFilter && (
                <div className="absolute top-full mt-2 w-64 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        {stockFilter.length} selected
                      </span>
                      <button
                        onClick={resetFilters}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={stockFilter.includes("In stock")}
                          onChange={(e) =>
                            handleStockFilterChange(
                              "In stock",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">In stock</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={stockFilter.includes("Out of stock")}
                          onChange={(e) =>
                            handleStockFilterChange(
                              "Out of stock",
                              e.target.checked
                            )
                          }
                          className="mr-2"
                        />
                        <span className="text-sm">Out of stock</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowPriceFilter(!showPriceFilter);
                  setShowStockFilter(false);
                }}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <span className="text-sm">Price</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showPriceFilter && (
                <div className="absolute top-full mt-2 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="p-4">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        The highest price is{" "}
                        {formatPrice(
                          Math.max(
                            ...products.map(
                              (p) => p.discountPrice || p.originalPrice
                            )
                          )
                        )}
                      </span>
                      <button
                        onClick={resetFilters}
                        className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Reset
                      </button>
                    </div>

                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <span className="text-sm mr-2">₫</span>
                        <input
                          type="text"
                          placeholder="From"
                          value={priceRange.from}
                          onChange={(e) =>
                            setPriceRange({
                              ...priceRange,
                              from: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-sm mr-2">₫</span>
                        <input
                          type="text"
                          placeholder="To"
                          value={priceRange.to}
                          onChange={(e) =>
                            setPriceRange({ ...priceRange, to: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="relative">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50"
              >
                <span className="text-sm">{sortBy}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSortOptions && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setShowSortOptions(false);
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 text-sm ${
                          sortBy === option ? "bg-gray-100 font-medium" : ""
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {getFilteredProductCount()} products
            </span>
          </div>
        </div>

        {/* Mobile Filter Bar */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <button
            onClick={() => setShowMobileFilter(true)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md bg-white"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filter and sort</span>
          </button>
          <span className="text-sm text-gray-600">
            {getFilteredProductCount()} of {products.length} products
          </span>
        </div>

        {/* Active Filters Display (Mobile) */}
        {hasActiveFilters() && (
          <div className="md:hidden mb-4 flex items-center space-x-2">
            {priceRange.from && priceRange.to && (
              <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1 text-sm">
                <span>
                  {formatPrice(parseFloat(priceRange.from))} -{" "}
                  {formatPrice(parseFloat(priceRange.to))}
                </span>
                <button
                  onClick={() => setPriceRange({ from: "", to: "" })}
                  className="ml-2"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 underline"
            >
              Remove all
            </button>
          </div>
        )}

        {/* Mobile Filter Overlay */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute right-0 top-0 h-full w-full bg-white">
              {/* Main Filter Menu */}
              {mobileFilterView === "main" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={() => setShowMobileFilter(false)}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-medium">Filter and sort</h2>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center py-2 text-sm text-gray-600 border-b">
                    {getFilteredProductCount()} products
                  </div>

                  <div className="flex-1">
                    <button
                      onClick={() => setMobileFilterView("status")}
                      className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
                    >
                      <span>Product status</span>
                      <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                    </button>
                    <button
                      onClick={() => setMobileFilterView("price")}
                      className="w-full flex items-center justify-between p-4 border-b hover:bg-gray-50"
                    >
                      <span>Price</span>
                      <ChevronDown className="w-5 h-5 rotate-[-90deg]" />
                    </button>
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between mb-2">
                        <span>Sort by:</span>
                      </div>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md"
                      >
                        {sortOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <button
                        onClick={clearFilters}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
                      >
                        Remove all
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 px-4 bg-black text-white rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Filter View */}
              {mobileFilterView === "status" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={() => setMobileFilterView("main")}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-medium">Product status</h2>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center py-2 text-sm text-gray-600 border-b">
                    {getFilteredProductCount()} of {products.length} products
                  </div>

                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={stockFilter.includes("In stock")}
                          onChange={(e) =>
                            handleStockFilterChange(
                              "In stock",
                              e.target.checked
                            )
                          }
                          className="mr-3 w-4 h-4"
                        />
                        <span>In stock</span>
                      </label>
                      <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={stockFilter.includes("Out of stock")}
                          onChange={(e) =>
                            handleStockFilterChange(
                              "Out of stock",
                              e.target.checked
                            )
                          }
                          className="mr-3 w-4 h-4"
                        />
                        <span>Out of stock</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <button
                        onClick={clearFilters}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 px-4 bg-black text-white rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Price Filter View */}
              {mobileFilterView === "price" && (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <button onClick={() => setMobileFilterView("main")}>
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-medium">Price</h2>
                    <button onClick={() => setShowMobileFilter(false)}>
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-center py-2 text-sm text-gray-600 border-b">
                    {getFilteredProductCount()} products
                  </div>

                  <div className="flex-1 p-4">
                    <div className="mb-4">
                      <span className="text-sm text-gray-500">
                        The highest price is{" "}
                        {formatPrice(
                          Math.max(
                            ...products.map(
                              (p) => p.discountPrice || p.originalPrice
                            )
                          )
                        )}
                      </span>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          From
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <span className="px-3 text-sm">₫</span>
                          <input
                            type="text"
                            placeholder="0"
                            value={priceRange.from}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                from: e.target.value,
                              })
                            }
                            className="flex-1 py-3 px-2 border-0 focus:ring-0"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          To
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <span className="px-3 text-sm">₫</span>
                          <input
                            type="text"
                            placeholder={formatPrice(
                              Math.max(
                                ...products.map(
                                  (p) => p.discountPrice || p.originalPrice
                                )
                              )
                            )}
                            value={priceRange.to}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                to: e.target.value,
                              })
                            }
                            className="flex-1 py-3 px-2 border-0 focus:ring-0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setPriceRange({ from: "", to: "" })}
                        className="flex-1 py-3 px-4 border border-gray-300 rounded-md text-center"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 px-4 bg-black text-white rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {getFilteredProducts().map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100">
                <Link href={`/products/${product.id}`}>
                  <div className="aspect-square bg-gray-100 cursor-pointer">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={280}
                      height={280}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-bold text-xs md:text-sm mb-2 uppercase">
                  {product.name}
                </h3>
                <div className="text-xs md:text-sm text-gray-600">
                  {product.discountPrice ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-red-500">
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className="line-through text-gray-400">
                        {formatPrice(product.originalPrice)}
                      </span>
                    </div>
                  ) : (
                    <span>{formatPrice(product.originalPrice)}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCollection;
