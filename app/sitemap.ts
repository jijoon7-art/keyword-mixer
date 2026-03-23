import { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  const tools = [
    'char-counter','youtube-tags','hashtag-generator','utm-builder',
    'calculators','age-calculator','dday-calculator','date-calculator',
    'exchange-rate','pyeongsu-calculator','interest-calculator',
    'time-calculator','tax-calculator','salary-calculator',
    'compound-interest','loan-repayment-table','statistics-calculator',
    'savings-calculator','stock-calculator','jeonse-calculator',
    'subscription-calculator','currency-premium',
    'lotto','id-generator','number-to-korean',
    'payslip-generator','invoice-generator',
    'body-fat-calculator','blood-pressure-tracker',
    'calorie-food-search','exercise-calorie',
    'nutrition-calculator','sleep-calculator',
    'steps-calorie','blood-sugar-tracker','menstrual-calculator',
    'baby-development','height-predictor',
    'car-cost-calculator','electricity-calculator','gas-calculator',
    'text-tools','text-diff','typing-speed','emoji-search','ascii-art',
    'hanja-converter','spell-checker','line-break-remover','nickname-generator',
    'image-compressor','image-editor','pdf-tools','color-extractor','image-base64',
    'json-formatter','json-csv','base64','url-encoder',
    'markdown-editor','css-gradient','regex-tester','ip-lookup',
    'meta-tag-generator','jwt-decoder','cron-generator',
    'number-converter','hash-generator','json-to-typescript',
    'unit-converter','timezone-converter','timer',
    'password-generator','qr-generator','color-palette','color-converter','color-contrast',
    'color-temperature','internet-speed-converter',
    'loan-comparison','retirement-calculator',
    'zodiac-calculator','love-calculator','lucky-number','biorhythm','mbti-compatibility',
    'ideal-weight','waist-hip-ratio','calories-burned-swim','protein-calculator','name-meaning','text-cleaner','real-estate-tax','freelancer-tax',
    'meeting-cost','fuel-cost','split-calculator','water-intake',
    'tip-calculator','percentage-calculator','roman-numeral','morse-code','world-clock',
    'countdown-creator','binary-text','aspect-ratio','css-unit-converter','character-counter-pro',
  ]
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...tools.map(t => ({ url: `${base}/${t}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 }))
  ]
}
