'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center sm:px-10">
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)]">
        Un probleme est survenu
      </h1>
      <p className="mt-4 text-[var(--color-ink)]/70">
        Impossible de charger cette page pour le moment. Reessayez dans un instant.
      </p>
      <button
        onClick={reset}
        className="mt-8 bg-[var(--color-bottle)] px-8 py-3 text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-ink)]"
      >
        Reessayer
      </button>
    </main>
  )
}