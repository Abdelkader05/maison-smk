'use client'

import Image from 'next/image'
import { useTransition } from 'react'
import { deleteProductImage } from '@/lib/actions/products'

type ProductImage = {
  id: string
  image_url: string
  display_order: number
}

export default function ImageManager({
  images,
  productId,
}: {
  images: ProductImage[]
  productId: string
}) {
  const [isPending, startTransition] = useTransition()

  if (images.length === 0) {
    return <p className="mt-4 text-sm text-[var(--color-ink)]/60">Aucune image pour ce produit.</p>
  }

  return (
    <div className="mt-4 flex flex-wrap gap-4">
      {images.map((img) => (
        <div key={img.id} className="relative">
          <div className="relative h-28 w-28 overflow-hidden bg-[var(--color-card)]">
            <Image src={img.image_url} alt="" fill sizes="112px" className="object-cover" />
          </div>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => deleteProductImage(img.id, productId))}
            className="mt-1 w-full text-xs text-red-700 hover:underline disabled:opacity-50"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  )
}