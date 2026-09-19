import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { updateProduct } from '@/lib/actions/products'
import ImageManager from '@/components/admin/ImageManager'
import ImageUploader from '@/components/admin/ImageUploader'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()

  if (!product) notFound()

  const { data: images } = await supabase
    .from('product_images')
    .select('*')
    .eq('product_id', id)
    .order('display_order', { ascending: true })

  const updateProductWithId = updateProduct.bind(null, id)

  return (
    <div>
      <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)]">
        {product.name}
      </h1>

      <form action={updateProductWithId} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Nom</label>
          <input name="name" defaultValue={product.name} required className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Description</label>
          <textarea name="description" rows={3} defaultValue={product.description ?? ''} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Prix (FCFA)</label>
            <input type="number" name="price" defaultValue={product.price ?? ''} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
          </div>
          <div>
            <label className="text-sm text-[var(--color-ink)]/80">Stock</label>
            <input type="number" name="stock" min={0} defaultValue={product.stock} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
          </div>
        </div>
        <div>
          <label className="text-sm text-[var(--color-ink)]/80">Categorie</label>
          <input name="category" defaultValue={product.category ?? ''} className="mt-1 w-full border border-[var(--color-ink)]/15 bg-white px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brass)]" />
        </div>
        <label className="flex items-center gap-2 text-sm text-[var(--color-ink)]/80">
          <input type="checkbox" name="is_active" defaultChecked={product.is_active} />
          Produit actif (visible sur le site)
        </label>
        <button type="submit" className="bg-[var(--color-bottle)] px-6 py-3 text-sm text-[var(--color-parchment)] hover:bg-[var(--color-ink)]">
          Enregistrer
        </button>
      </form>

      <div className="mt-12 border-t border-[var(--color-ink)]/10 pt-8">
        <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[var(--color-ink)]">Images</h2>
        <ImageManager images={images || []} productId={product.id} />
        <ImageUploader productId={product.id} />
      </div>
    </div>
  )
}