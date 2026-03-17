import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  const tools = [
    'char-counter','youtube-tags','hashtag-generator','utm-builder',
    'calculators','age-calculator','dday-calculator','exchange-rate',
    'pyeongsu-calculator','interest-calculator','lotto',
    'text-tools','text-diff','typing-speed','emoji-search','ascii-art',
    'image-compressor','image-editor','pdf-tools',
    'json-formatter','json-csv','base64','url-encoder',
    'markdown-editor','css-gradient','regex-tester','ip-lookup',
    'unit-converter','timezone-converter','timer',
    'password-generator','qr-generator','color-palette','color-converter',
  ]
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...tools.map(t => ({ url: `${base}/${t}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }))
  ]
}
