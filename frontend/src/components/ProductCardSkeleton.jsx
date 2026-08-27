function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      <div className="w-full h-56 animate-shimmer" />
      <div className="h-0.5 w-full bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-3/4 rounded animate-shimmer" />
        <div className="h-2.5 w-1/2 rounded animate-shimmer" />
        <div className="h-4 w-1/3 rounded animate-shimmer mt-2" />
      </div>
    </div>
  );
}

export default ProductCardSkeleton;