import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  const tools = [
    'char-counter','youtube-tags','hashtag-generator','utm-builder',
    'calculators','age-calculator','dday-calculator','date-calculator',
    'exchange-rate','pyeongsu-calculator','interest-calculator',
    'time-calculator','tax-calculator','salary-calculator',
    'compound-interest','loan-repayment-table','statistics-calculator',
    'lotto','id-generator','number-to-korean',
    'body-fat-calculator','blood-pressure-tracker',
    'calorie-food-search','exercise-calorie',
    'text-tools','text-diff','typing-speed','emoji-search','ascii-art',
    'hanja-converter','spell-checker','line-break-remover','nickname-generator',
    'image-compressor','image-editor','pdf-tools','color-extractor','image-base64',
    'json-formatter','json-csv','base64','url-encoder',
    'markdown-editor','css-gradient','regex-tester','ip-lookup',
    'meta-tag-generator','jwt-decoder','cron-generator',
    'number-converter','hash-generator','json-to-typescript',
    'unit-converter','timezone-converter','timer',
    'password-generator','qr-generator','color-palette','color-converter','color-contrast',
  ]
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...tools.map(t => ({ url: `${base}/${t}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }))
  ]
}
