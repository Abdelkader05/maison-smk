'use client'

import { useState } from 'react'
import Image from 'next/image'

type GalleryImage = {
  id: string
  image_url: string
}

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[]
  productName: string
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex]

  if (images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center bg-[var(--color-card)] text-sm text-[var(--color-bottle)]">
        Photo a venir
      </div>
    )
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-card)]">
        <Image
          src={active.image_url}
          alt={productName}
          fill
          sizes="50vw"
          priority
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${
                index === activeIndex
                  ? 'border-[var(--color-brass)]'
                  : 'border-transparent'
              }`}
            >
              <Image
                src={img.image_url}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}