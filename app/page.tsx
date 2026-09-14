export const revalidate = 300
import Link from 'next/link'
import { getProducts, getFeaturedProducts } from '@/lib/products'
import ProductCard from '@/components/ProductCard'
import Image from 'next/image'

export default async function Home() {
  const [products, featured] = await Promise.all([getProducts(), getFeaturedProducts(4)])

  const categoryMap = new Map<string, { name: string; image: string | null; count: number }>()
  for (const p of products) {
    if (!p.category) continue
    if (!categoryMap.has(p.category)) {
      categoryMap.set(p.category, { name: p.category, image: p.imageUrl, count: 1 })
    } else {
      categoryMap.get(p.category)!.count++
    }
  }
  const categories = Array.from(categoryMap.values())

  return (
    <>
      <section className="border-b border-[var(--color-ink)]/10 bg-[var(--color-card)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-[family-name:var(--font-fraunces)] text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
              Des chaussures qui se remarquent, livrees a Bamako
            </h1>
            <p className="mt-5 max-w-md text-[var(--color-ink)]/70">
              Parcourez notre selection et commandez en un message, directement sur WhatsApp.
            </p>
            <Link
              href="/produits"
              className="mt-8 inline-block bg-[var(--color-bottle)] px-8 py-3 text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-ink)]"
            >
              Voir le catalogue
            </Link>
          </div>
          <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-parchment)]">
            {featured[0]?.imageUrl && (
              <Image src={featured[0].imageUrl} alt="" fill sizes="50vw" className="object-cover" />
            )}
          </div>
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
          <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-[var(--color-ink)]">
            Par categorie
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/produits?categorie=${encodeURIComponent(cat.name)}`}
                className="group relative aspect-[4/3] overflow-hidden bg-[var(--color-card)]"
              >
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="font-[family-name:var(--font-fraunces)] text-2xl text-[var(--color-parchment)]">
                    {cat.name}
                  </span>
                  <span className="ml-3 text-sm text-[var(--color-parchment)]/80">
                    {cat.count} modeles
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="bg-[var(--color-card)] py-16">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <h2 className="font-[family-name:var(--font-fraunces)] text-2xl text-[var(--color-ink)]">
            Nouveautes
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="grid grid-cols-1 gap-8 border-t border-[var(--color-ink)]/10 pt-12 sm:grid-cols-3">
          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)]">Livraison a Bamako</h3>
            <p className="mt-2 text-sm text-[var(--color-ink)]/70">Remise en main propre dans les principaux quartiers.</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)]">Commande simple</h3>
            <p className="mt-2 text-sm text-[var(--color-ink)]/70">Choisissez un modele, commandez directement via WhatsApp.</p>
          </div>
          <div>
            <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)]">Reponse rapide</h3>
            <p className="mt-2 text-sm text-[var(--color-ink)]/70">Nous confirmons votre commande le jour meme.</p>
          </div>
        </div>
      </section>
    </>
  )
}