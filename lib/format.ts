
export function formatPrice(price: number | null | undefined) {
  if (price == null) return 'Prix sur demande'
  return `${price.toLocaleString('fr-FR')} FCFA`
}