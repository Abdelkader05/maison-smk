import { createClient } from '@/lib/supabase/server'
import { getPlaceholderImage } from '@/lib/placeholder'

export type Product = {
  id: string
  name: string
  description: string | null
  price: number | null
  category: string | null
  stock: number
  is_active: boolean
}

export async function getProducts() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, stock, is_active, product_images(image_url, display_order)')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .order('display_order', { referencedTable: 'product_images', ascending: true })

  if (error || !data) return []

  return data.map((product) => ({
    ...product,
    imageUrl: product.product_images?.[0]?.image_url ?? getPlaceholderImage(product.category),
  }))
}

export async function getFeaturedProducts(limit = 4) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select('id, name, description, price, category, stock, is_active, product_images(image_url, display_order)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .order('display_order', { referencedTable: 'product_images', ascending: true })
    .limit(limit)

  if (error || !data) return []

  return data.map((product) => ({
    ...product,
    imageUrl: product.product_images?.[0]?.image_url ?? getPlaceholderImage(product.category),
  }))
}

export async function getProductById(id: string) {
  const supabase = await createClient()
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_images(id, image_url, display_order)')
    .eq('id', id)
    .order('display_order', { referencedTable: 'product_images', ascending: true })
    .single()

  if (error || !product) return null

  const images =
    product.product_images && product.product_images.length > 0
      ? product.product_images
      : [{ id: 'placeholder', image_url: getPlaceholderImage(product.category), display_order: 0 }]

  return { ...product, images }
}