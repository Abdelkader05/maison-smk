'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'

type Product = {
  id: string
  name: string
  price: number | null
  imageUrl: string | null
  category: string | null
}

export default function CatalogGrid({
  products,
  initialCategory = 'Tous',
}: {
  products: Product[]
  initialCategory?: string
}) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(initialCategory)

  const categories = [
    'Tous',
    ...Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])),
  ]

  const filtered = products.filter((p) => {
    const matchCategory = category === 'Tous' || p.category === category
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div>
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 text-sm transition-colors ${
                category === cat
                  ? 'bg-[var(--color-bottle)] text-[var(--color-parchment)]'
                  : 'bg-[var(--color-card)] text-[var(--color-ink)] hover:bg-[var(--color-bottle)]/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Rechercher un modele..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-[var(--color-ink)]/15 bg-[var(--color-card)] px-4 py-2 text-sm sm:w-64 focus:outline-none focus:border-[var(--color-brass)]"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-[var(--color-ink)]/70">Aucun produit ne correspond a votre recherche.</p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))}
        </div>
      )}
    </div>
  )
}