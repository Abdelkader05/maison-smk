import { getProducts } from '@/lib/products'
import CatalogGrid from '@/components/CatalogGrid'
export const revalidate = 300

export default async function ProduitsPage({
  searchParams,
}: {
  searchParams: Promise<{ categorie?: string }>
}) {
  const { categorie } = await searchParams
  const products = await getProducts()

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
      <header className="mb-10 max-w-xl">
        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl text-[var(--color-ink)]">
          Catalogue
        </h1>
        <p className="mt-3 text-[var(--color-ink)]/70">
          {products.length} modeles disponibles.
        </p>
      </header>
      <CatalogGrid products={products} initialCategory={categorie || 'Tous'} />
    </main>
  )
}