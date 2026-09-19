'use client'

import { useRef, useState, useTransition } from 'react'
import { addProductImage } from '@/lib/actions/products'

export default function ImageUploader({ productId }: { productId: string }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await addProductImage(productId, formData)
        formRef.current?.reset()
      } catch (e) {
        setError(e instanceof Error ? e.message : "Erreur lors de l'envoi")
      }
    })
  }

  return (
    <form ref={formRef} action={handleSubmit} className="mt-6 flex items-center gap-3">
      <input type="file" name="file" accept="image/*" required className="text-sm text-[var(--color-ink)]" />
      <button type="submit" disabled={isPending} className="bg-[var(--color-brass)] px-4 py-2 text-sm text-white hover:bg-[var(--color-ink)] disabled:opacity-50">
        {isPending ? 'Envoi...' : 'Ajouter'}
      </button>
      {error && <span className="text-sm text-red-700">{error}</span>}
    </form>
  )
}