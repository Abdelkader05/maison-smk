import { MetadataRoute } from 'next'
import { getProducts } from '@/lib/products'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts()
  const base = 'https://www.maisonsmk.ml'

  const productUrls = products.map((p) => ({
    url: `${base}/produits/${p.id}`,
    lastModified: new Date(),
  }))

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/produits`, lastModified: new Date() },
    { url: `${base}/a-propos`, lastModified: new Date() },
    ...productUrls,
  ]
}