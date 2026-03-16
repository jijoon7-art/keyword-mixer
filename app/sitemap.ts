import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/char-counter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/youtube-tags`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/hashtag-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/utm-builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/json-csv`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/base64`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/password-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/color-converter`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ]
}
