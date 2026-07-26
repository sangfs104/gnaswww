export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-8 md:px-16 lg:px-60 py-4 sm:py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 mb-8 sm:mb-12 lg:mb-16">
          {/* Skeleton phần hình ảnh */}
          <div className="space-y-3 sm:space-y-4">
            <div className="relative aspect-square bg-gray-200 rounded-lg overflow-hidden animate-pulse" />

            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <div className="w-8 h-8 flex-shrink-0" />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 rounded-lg animate-pulse"
                />
              ))}
              <div className="w-8 h-8 flex-shrink-0" />
            </div>
          </div>

          {/* Skeleton phần thông tin sản phẩm */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-3">
              {/* Tên sản phẩm */}
              <div className="h-8 sm:h-10 bg-gray-200 rounded w-3/4 animate-pulse" />
              {/* Giá */}
              <div className="h-6 sm:h-7 bg-gray-200 rounded w-1/3 animate-pulse" />
              {/* Vận chuyển */}
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
              {/* Tồn kho */}
              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
            </div>

            {/* Biến thể */}
            <div className="space-y-2 sm:space-y-3">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-10 sm:h-12 bg-gray-200 rounded-md w-full animate-pulse" />
            </div>

            {/* Số lượng */}
            <div className="space-y-2 sm:space-y-3">
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
              <div className="h-10 sm:h-12 bg-gray-200 rounded-md w-28 sm:w-32 animate-pulse" />
            </div>

            {/* Nút hành động */}
            <div className="space-y-2 sm:space-y-3">
              <div className="h-11 sm:h-12 bg-gray-200 rounded-md w-full animate-pulse" />
              <div className="h-11 sm:h-12 bg-gray-200 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
