import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/char-counter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/youtube-tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/utm-builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/hashtag-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]
}
