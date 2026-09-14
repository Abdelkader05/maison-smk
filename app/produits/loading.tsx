export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
      <div className="mb-10 h-10 w-48 animate-pulse bg-[var(--color-card)]" />
      <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-square w-full animate-pulse bg-[var(--color-card)]" />
            <div className="mt-4 h-4 w-3/4 animate-pulse bg-[var(--color-card)]" />
            <div className="mt-2 h-4 w-1/4 animate-pulse bg-[var(--color-card)]" />
          </div>
        ))}
      </div>
    </main>
  )
}