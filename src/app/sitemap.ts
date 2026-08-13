import { MetadataRoute } from 'next'
import { DISTRICTS } from '@/city/districts'
import { getCases } from '@/city/cases'

/**
 * Sitemap sobre la nueva IA (D-13): la home es la ciudad; los distritos y
 * casos son el contenido indexable de verdad. El Ayuntamiento es la
 * conversión. Se conservan las páginas legacy que siguen vivas.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || 'https://lqs.studio'
  const now = new Date()

  const districtUrls = DISTRICTS.flatMap((d) => [
    { url: `${base}/ciudad/${d.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...getCases(d.slug).map((c) => ({
      url: `${base}/ciudad/${d.slug}/${c.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ])

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/ayuntamiento`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    ...districtUrls,
    { url: `${base}/nosotros`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacto`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
