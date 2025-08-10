export default function Loading() {
  return (
    <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-gray-300 animate-pulse h-48"
        ></div>
      ))}
    </main>
  );
}
