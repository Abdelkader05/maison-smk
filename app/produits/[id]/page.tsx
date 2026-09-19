export const revalidate = 300
import { notFound } from 'next/navigation'
import { getProductById } from '@/lib/products'
import { formatPrice } from '@/lib/format'
import ProductGallery from '@/components/ProductGallery'

import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(id)
  if (!product) return {}

  return {
    title: `${product.name} - Maison SMK`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images[0]?.image_url ? [product.images[0].image_url] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) notFound()

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = encodeURIComponent(
    'Bonjour, je suis interesse(e) par : ' + product.name + ' (' + formatPrice(product.price) + ')'
  )
  const whatsappUrl = 'https://wa.me/' + whatsappNumber + '?text=' + message

  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
      <div className="grid gap-12 sm:grid-cols-2">
        <ProductGallery images={product.images} productName={product.name} />

        <div>
          <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)]">
            {product.name}
          </h1>
          <p className="mt-3 text-xl text-[var(--color-brass)]">
            {formatPrice(product.price)}
          </p>
          <p className="mt-6 text-[var(--color-ink)]/80">
            {product.description}
          </p>

          
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block bg-[var(--color-bottle)] px-8 py-3 text-[var(--color-parchment)] transition-colors hover:bg-[var(--color-ink)]">
              Commander via WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}