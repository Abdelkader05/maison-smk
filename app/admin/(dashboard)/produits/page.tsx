import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/format'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, category, stock, is_active')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)]">
          Produits
        </h1>
        <Link
          href="/admin/produits/nouveau"
          className="bg-[var(--color-bottle)] px-5 py-2 text-sm text-[var(--color-parchment)] hover:bg-[var(--color-ink)]"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-ink)]/10 text-[var(--color-ink)]/60">
              <th className="py-2 pr-4">Nom</th>
              <th className="py-2 pr-4">Categorie</th>
              <th className="py-2 pr-4">Prix</th>
              <th className="py-2 pr-4">Stock</th>
              <th className="py-2 pr-4">Actif</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody>
            {(products || []).map((product) => (
              <tr key={product.id} className="border-b border-[var(--color-ink)]/5">
                <td className="py-3 pr-4 text-[var(--color-ink)]">{product.name}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{product.category}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{formatPrice(product.price)}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{product.stock}</td>
                <td className="py-3 pr-4 text-[var(--color-ink)]/70">{product.is_active ? 'Oui' : 'Non'}</td>
                <td className="py-3 pr-4">
                  <div className="flex gap-3">
                    <Link href={`/admin/produits/${product.id}`} className="text-[var(--color-brass)] hover:underline">
                      Modifier
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}