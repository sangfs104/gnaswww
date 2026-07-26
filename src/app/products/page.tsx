"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronDown, X, Filter, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ==================== TYPES ====================
interface Variant {
  price: number;
  discountPrice?: number | null;
  stock: number;
}

interface ApiProduct {
  _id: string;
  name: string;
  images?: string[];
  variants?: Variant[];
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountPrice: number | null;
  image: string;
  inStock: boolean;
  createdAt: string;
}

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

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price,
  );

const getImageUrl = (imgPath?: string): string => {
  if (!imgPath) return "/img/placeholder.jpg";
  if (imgPath.startsWith("http")) {
    let url = imgPath.replace(/^http:\/\//, "https://");
    url = url.replace(/(https:\/\/[^/]+)(\/products\/images\/)/, "$1/api$2");
    return url;
  }
  return `${process.env.NEXT_PUBLIC_API_URL}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
};

const ProductCollection = () => {
  const [showStockFilter, setShowStockFilter] = useState(false);
  const [showPriceFilter, setShowPriceFilter] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [mobileFilterView, setMobileFilterView] = useState<
    "main" | "status" | "price"
  >("main");
  const [sortBy, setSortBy] = useState("Featured");
  const [stockFilter, setStockFilter] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ from: "", to: "" });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Fetch products (with abort + cache headers) ----
  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products`,
          {
            signal: controller.signal,
            // Let the browser/CDN cache this response instead of always refetching.
            // Adjust revalidate window to match how often products actually change.
            next: { revalidate: 60 },
          },
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const data: ApiProduct[] = await response.json();

        const transformedProducts: Product[] = data.map((product) => {
          const variant = product.variants?.[0] || { price: 0, stock: 0 };
          const price = variant.price || 0;
          const discountPrice = variant.discountPrice || null;
          const hasValidDiscount =
            discountPrice && discountPrice < price && discountPrice > 0;

          return {
            id: product._id,
            name: product.name,
            originalPrice: price,
            discountPrice: hasValidDiscount ? discountPrice : null,
            image: getImageUrl(product.images?.[0]),
            inStock: variant.stock > 0,
            createdAt: product.createdAt,
          };
        });

        setProducts(transformedProducts);
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return; // ignore aborted fetch
        const message =
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tải sản phẩm";
        setError(message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => controller.abort();
  }, []);

  // ---- Highest price, computed once per products change ----
  const highestPrice = useMemo(() => {
    if (products.length === 0) return 0;
    let max = 0;
    for (const p of products) {
      const price = p.discountPrice || p.originalPrice;
      if (price > max) max = price;
    }
    return max;
  }, [products]);

  // ---- Filtered + sorted products, memoized so it doesn't recompute on every render ----
  const filteredProducts = useMemo(() => {
    let result = products;

    const wantIn = stockFilter.includes("In stock");
    const wantOut = stockFilter.includes("Out of stock");
    if (wantIn || wantOut) {
      result = result.filter(
        (p) => (wantIn && p.inStock) || (wantOut && !p.inStock),
      );
    }

    const from = priceRange.from ? parseFloat(priceRange.from) : 0;
    const to = priceRange.to ? parseFloat(priceRange.to) : Infinity;
    if (priceRange.from || priceRange.to) {
      result = result.filter((p) => {
        const price = p.discountPrice || p.originalPrice;
        return price >= from && price <= to;
      });
    }

    // Avoid mutating the filtered array from the previous step in place issues:
    // slice() only when we actually need to sort.
    if (sortBy !== "Featured" && sortBy !== "Best selling") {
      result = [...result];
      switch (sortBy) {
        case "Alphabetically, A-Z":
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "Alphabetically, Z-A":
          result.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "Price, low to high":
          result.sort(
            (a, b) =>
              (a.discountPrice || a.originalPrice) -
              (b.discountPrice || b.originalPrice),
          );
          break;
        case "Price, high to low":
          result.sort(
            (a, b) =>
              (b.discountPrice || b.originalPrice) -
              (a.discountPrice || a.originalPrice),
          );
          break;
        case "Date, old to new":
          result.sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          );
          break;
        case "Date, new to old":
          result.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
      }
    }

    return result;
  }, [products, stockFilter, priceRange, sortBy]);

  const hasActiveFilters =
    stockFilter.length > 0 || !!priceRange.from || !!priceRange.to;

  const handleStockFilterChange = useCallback(
    (option: string, checked: boolean) => {
      setStockFilter((prev) =>
        checked ? [...prev, option] : prev.filter((item) => item !== option),
      );
    },
    [],
  );

  const resetFilters = useCallback(() => {
    setStockFilter([]);
    setPriceRange({ from: "", to: "" });
  }, []);

  const clearFilters = resetFilters;

  const applyFilters = useCallback(() => {
    setShowMobileFilter(false);
    setMobileFilterView("main");
  }, []);

  if (loading) return <div className="text-center py-8">Đang tải...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">Lỗi: {error}</div>;

  return (
    <div className="min-h-screen">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-8">
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
          All collection
        </h1>

        {/* Desktop Filter Bar */}
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
                <span className="text-sm">Product status</span>
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
                              e.target.checked,
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
                              e.target.checked,
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
                        The highest price is {formatPrice(highestPrice)}
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
                            setPriceRange((p) => ({
                              ...p,
                              from: e.target.value,
                            }))
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
                            setPriceRange((p) => ({ ...p, to: e.target.value }))
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

          {/* Sort */}
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
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg z-10">
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
              {filteredProducts.length} products
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
            {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Active Filters (Mobile) */}
        {hasActiveFilters && (
          <div className="md:hidden mb-4 flex items-center space-x-2 flex-wrap">
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
                    {filteredProducts.length} products
                  </div>
                  <div className="flex-1 overflow-auto">
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
                      <div className="mb-2">Sort by:</div>
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
                        className="flex-1 py-3 border border-gray-300 rounded-md"
                      >
                        Remove all
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 bg-black text-white rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  <div className="flex-1 p-4">
                    <div className="space-y-4">
                      <label className="flex items-center p-3 rounded-md hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={stockFilter.includes("In stock")}
                          onChange={(e) =>
                            handleStockFilterChange(
                              "In stock",
                              e.target.checked,
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
                              e.target.checked,
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
                        className="flex-1 py-3 border border-gray-300 rounded-md"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 bg-black text-white rounded-md"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}

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
                  <div className="flex-1 p-4">
                    <div className="mb-4 text-sm text-gray-500">
                      The highest price is {formatPrice(highestPrice)}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          From
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <span className="px-3">₫</span>
                          <input
                            type="text"
                            value={priceRange.from}
                            onChange={(e) =>
                              setPriceRange((p) => ({
                                ...p,
                                from: e.target.value,
                              }))
                            }
                            className="flex-1 py-3 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          To
                        </label>
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <span className="px-3">₫</span>
                          <input
                            type="text"
                            value={priceRange.to}
                            onChange={(e) =>
                              setPriceRange((p) => ({
                                ...p,
                                to: e.target.value,
                              }))
                            }
                            className="flex-1 py-3 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t bg-white">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setPriceRange({ from: "", to: "" })}
                        className="flex-1 py-3 border border-gray-300 rounded-md"
                      >
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 py-3 bg-black text-white rounded-md"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <Link href={`/products/${product.id}`}>
                <div className="aspect-square bg-gray-100 relative">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    // Let Next.js optimize/resize/serve webp instead of raw originals.
                    // Remove `unoptimized` — make sure the image host is added to
                    // images.remotePatterns in next.config.js.
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    // Prioritize the first visible row so LCP isn't lazy-loaded.
                    priority={index < 4}
                    loading={index < 4 ? "eager" : "lazy"}
                  />
                </div>
              </Link>
              <div className="p-3 md:p-4">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="text-sm text-gray-600">
                  {product.discountPrice ? (
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 font-medium">
                        {formatPrice(product.discountPrice)}
                      </span>
                      <span className="line-through text-gray-400 text-xs">
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
