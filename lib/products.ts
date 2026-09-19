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

type BestSellerProduct = {
  id: string
  name: string
  description: string | null
  price: number
  brand: string | null
  category: string | null
  sizes: string[] | null
  stock: number | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getBestSellers(daysBack = 30, limitCount = 4) {
  const supabase = await createClient();

  const { data: products, error } = await supabase.rpc("get_best_sellers", {
    days_back: daysBack,
    limit_count: limitCount,
  });

  if (error) {
    console.error("getBestSellers failed:", error.message);
    return [];
  }
  if (!products || products.length === 0) return [];

  const typedProducts = products as BestSellerProduct[];
  const productIds = typedProducts.map((p) => p.id);

  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("id, product_id, image_url, display_order")
    .in("product_id", productIds)
    .order("display_order", { ascending: true });

  if (imagesError) {
    console.error("getBestSellers images fetch failed:", imagesError.message);
  }

  return typedProducts.map((product) => ({
    ...product,
    product_images: (images ?? []).filter((img) => img.product_id === product.id),
  }));
}