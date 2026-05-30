import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://bloom.stoop.games', lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: 'https://bloom.stoop.games/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://bloom.stoop.games/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://bloom.stoop.games/privacy', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
