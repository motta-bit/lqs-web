import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://lqs.studio'
  const now  = new Date()
  return [
    { url: base,                    lastModified: now, changeFrequency: 'weekly', priority: 1   },
    { url: `${base}/servicios`,     lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/portafolio`,    lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/nosotros`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/contacto`,      lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
  ]
}
