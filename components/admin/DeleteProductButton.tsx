'use client'

import { useTransition } from 'react'
import { deleteProduct } from '@/lib/actions/products'

export default function DeleteProductButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Supprimer ce produit et toutes ses images ?')) return
    startTransition(() => {
      deleteProduct(productId)
    })
  }

  return (
    <button onClick={handleDelete} disabled={isPending} className="text-red-700 hover:underline disabled:opacity-50">
      {isPending ? 'Suppression...' : 'Supprimer'}
    </button>
  )
}