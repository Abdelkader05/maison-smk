'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function parseProductFields(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const priceRaw = formData.get('price') as string
  const category = formData.get('category') as string
  const stockRaw = formData.get('stock') as string
  const is_active = formData.get('is_active') === 'on'

  return {
    name,
    description: description || null,
    price: priceRaw ? Number(priceRaw) : null,
    category: category || null,
    stock: stockRaw && Number(stockRaw) >= 0 ? Number(stockRaw) : 10,
    is_active,
  }
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const fields = parseProductFields(formData)

  const { data, error } = await supabase
    .from('products')
    .insert(fields)
    .select('id')
    .single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Erreur lors de la creation du produit')
  }

  revalidatePath('/admin/produits')
  revalidatePath('/produits')
  revalidatePath('/')
  redirect(`/admin/produits/${data.id}`)
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  const fields = parseProductFields(formData)

  const { error } = await supabase.from('products').update(fields).eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/produits')
  revalidatePath(`/admin/produits/${id}`)
  revalidatePath('/produits')
  revalidatePath(`/produits/${id}`)
  revalidatePath('/')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/admin/produits')
  revalidatePath('/produits')
  revalidatePath('/')
  redirect('/admin/produits')
}

export async function addProductImage(productId: string, formData: FormData) {
  const supabase = await createClient()
  const file = formData.get('file') as File

  if (!file || file.size === 0) {
    throw new Error('Aucun fichier selectionne')
  }

  const { data: existingImages } = await supabase
    .from('product_images')
    .select('display_order')
    .eq('product_id', productId)
    .order('display_order', { ascending: false })
    .limit(1)

  const nextOrder =
    existingImages && existingImages.length > 0 ? existingImages[0].display_order + 1 : 0

  const fileExt = file.name.split('.').pop()
  const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(uploadError.message)
  }

  const { data: publicUrlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath)

  const { error: insertError } = await supabase.from('product_images').insert({
    product_id: productId,
    image_url: publicUrlData.publicUrl,
    display_order: nextOrder,
  })

  if (insertError) {
    throw new Error(insertError.message)
  }

  revalidatePath(`/admin/produits/${productId}`)
  revalidatePath(`/produits/${productId}`)
  revalidatePath('/produits')
  revalidatePath('/')
}

export async function deleteProductImage(imageId: string, productId: string) {
  const supabase = await createClient()

  const { data: image } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (image) {
    const marker = '/product-images/'
    const idx = image.image_url.indexOf(marker)
    if (idx !== -1) {
      const storagePath = image.image_url.substring(idx + marker.length)
      await supabase.storage.from('product-images').remove([storagePath])
    }
  }

  const { error } = await supabase.from('product_images').delete().eq('id', imageId)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath(`/admin/produits/${productId}`)
  revalidatePath(`/produits/${productId}`)
  revalidatePath('/produits')
  revalidatePath('/')
}