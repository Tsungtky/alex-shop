export function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-stone-200 animate-pulse rounded-lg ${className}`} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-stone-200 rounded-xl overflow-hidden">
      <SkeletonBox className="w-full h-36 rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <SkeletonBox className="h-4 w-3/4" />
        <SkeletonBox className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-8 py-12">
      <div className="grid grid-cols-2 gap-12">
        <SkeletonBox className="w-full h-96 rounded-2xl" />
        <div className="flex flex-col justify-center gap-4">
          <SkeletonBox className="h-3 w-20" />
          <SkeletonBox className="h-8 w-2/3" />
          <SkeletonBox className="h-px w-8" />
          <SkeletonBox className="h-6 w-24" />
          <SkeletonBox className="h-12 w-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border border-stone-200 rounded-xl px-6 py-5 flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <SkeletonBox className="h-3 w-24" />
        <SkeletonBox className="h-5 w-20" />
        <SkeletonBox className="h-3 w-16" />
      </div>
      <SkeletonBox className="h-6 w-20 rounded-full" />
    </div>
  );
}
