import { createProduct } from '@/lib/actions/products'

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)]">
        Nouveau produit
      </h1>

      <form action={createProduct} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Nom</label>
          <input name="name" required className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Description</label>
          <textarea name="description" rows={3} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Prix (FCFA)</label>
            <input type="number" name="price" className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
          </div>
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Stock</label>
            <input type="number" name="stock" min={0} defaultValue={10} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Categorie</label>
          <input name="category" placeholder="Mules, Sneakers, ..." className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]/80">
          <input type="checkbox" name="is_active" defaultChecked />
          Produit actif (visible sur le site)
        </label>
        <button type="submit" className="bg-[var(--color-bottle)] px-6 py-3 text-sm text-[var(--color-parchment)] hover:bg-[var(--color-ink)]">
          Creer le produit
        </button>
      </form>
    </div>
  )
}