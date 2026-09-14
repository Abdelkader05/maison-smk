export default function Loading() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <div className="grid gap-12 sm:grid-cols-2">
        <div className="aspect-square w-full animate-pulse bg-[var(--color-card)]" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 animate-pulse bg-[var(--color-card)]" />
          <div className="h-6 w-1/3 animate-pulse bg-[var(--color-card)]" />
          <div className="h-20 w-full animate-pulse bg-[var(--color-card)]" />
        </div>
      </div>
    </main>
  )
}