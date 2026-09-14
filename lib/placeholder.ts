export function getPlaceholderImage(category: string | null) {
  const seed = category
    ? category.trim().toLowerCase().replace(/\s+/g, '-')
    : 'smk-default'
  return `https://picsum.photos/seed/smk-${seed}/1000/1000`
}