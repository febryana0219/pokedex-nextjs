export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden shadow-md animate-pulse">
      <div className="bg-gray-200 h-32"></div>
      <div className="bg-white p-3">
        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-2 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  )
}
