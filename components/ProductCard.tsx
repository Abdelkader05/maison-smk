import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'

type Props = {
  id: string
  name: string
  price: number | null
  imageUrl: string | null
}

export default function ProductCard({ id, name, price, imageUrl }: Props) {
  return (
    <Link href={`/produits/${id}`} className="group block">
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-card)]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-[var(--color-bottle)]">
            Photo a venir
          </div>
        )}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)]">
          {name}
        </h3>
        <p className="text-[var(--color-brass)]">{formatPrice(price)}</p>
      </div>
    </Link>
  )
}