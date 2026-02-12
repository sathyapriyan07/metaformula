export function SkeletonCard() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
      <div className="h-8 bg-white/10 rounded w-2/3 mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded"></div>
        <div className="h-4 bg-white/10 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonDriverCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[3/4] bg-white/10"></div>
      <div className="p-6 space-y-2">
        <div className="h-3 bg-white/10 rounded w-1/2"></div>
        <div className="h-6 bg-white/10 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-[70vh] overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-white/5"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 h-full flex flex-col justify-end pb-16">
        <div className="h-6 bg-white/10 rounded w-32 mb-4"></div>
        <div className="h-16 bg-white/10 rounded w-2/3 mb-6"></div>
        <div className="h-4 bg-white/10 rounded w-1/2 mb-8"></div>
        <div className="flex gap-4">
          <div className="h-12 bg-white/10 rounded-full w-40"></div>
          <div className="h-12 bg-white/10 rounded-full w-40"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonDriverCard key={i} />
      ))}
    </div>
  );
}
