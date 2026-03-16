import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  const tools = [
    'char-counter','youtube-tags','hashtag-generator','utm-builder',
    'text-tools','calculators','age-calculator','dday-calculator','exchange-rate','lotto','timer','emoji-search',
    'image-compressor','image-editor','pdf-tools',
    'json-formatter','json-csv','base64','markdown-editor','text-diff','css-gradient','regex-tester',
    'unit-converter','timezone-converter','password-generator','qr-generator','color-converter',
  ]
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...tools.map(t => ({ url: `${base}/${t}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }))
  ]
}
