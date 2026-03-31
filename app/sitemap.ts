import { MetadataRoute } from 'next'

// 검색량 기반 우선순위 분류
const HIGH_PRIORITY = [
  'bmi-calculator-pro', 'severance-pay', 'vat-calculator', 'tax-refund',
  'mortgage-calculator', 'minimum-wage', 'lease-calculator', 'childbirth-subsidy',
  'investment-return', 'gpa-calculator', 'stamp-maker', 'pomodoro-pro',
  'stopwatch', 'password-strength', 'alcohol-calculator', 'zodiac-calculator',
  'love-calculator', 'mbti-compatibility', 'biorhythm', 'lucky-number',
]

const MEDIUM_PRIORITY = [
  'ideal-weight', 'water-intake', 'calories-burned-swim', 'protein-calculator',
  'waist-hip-ratio', 'health-insurance', 'loan-comparison', 'date-diff-calculator',
  'unit-price-calculator', 'reading-speed', 'paint-calculator', 'concrete-calculator',
  'retirement-calculator', 'real-estate-tax', 'freelancer-tax', 'split-calculator',
  'fuel-cost', 'meeting-cost', 'number-base-converter', 'file-size-converter',
  'scientific-calculator', 'timezone-meeting', 'nutrition-score', 'invoice-calculator',
  'number-base-converter', 'salary-calculator', 'compound-interest', 'loan-repayment-table',
  'statistics-calculator', 'savings-calculator', 'jeonse-calculator',
]

const ALL_TOOLS = [
  // 키워드/SNS
  '', 'char-counter', 'youtube-tags', 'hashtag-generator', 'utm-builder',
  'text-diff', 'typing-speed', 'emoji-search', 'ascii-art', 'hanja-converter',
  'spell-checker', 'line-break-remover', 'nickname-generator', 'text-cleaner',
  'character-counter-pro',
  // 개발자
  'json-formatter', 'json-csv', 'base64', 'url-encoder', 'markdown-editor',
  'css-gradient', 'regex-tester', 'ip-lookup', 'meta-tag-generator', 'jwt-decoder',
  'cron-generator', 'number-converter', 'hash-generator', 'json-to-typescript',
  'css-unit-converter', 'aspect-ratio', 'password-generator', 'qr-generator',
  // 계산
  'calculators', 'age-calculator', 'dday-calculator', 'date-calculator',
  'exchange-rate', 'pyeongsu-calculator', 'interest-calculator', 'time-calculator',
  'lotto', 'id-generator', 'number-to-korean', 'tip-calculator', 'percentage-calculator',
  'unit-converter', 'timezone-converter', 'timer', 'world-clock',
  'countdown-creator', 'roman-numeral', 'morse-code', 'binary-text',
  // 건강
  'body-fat-calculator', 'blood-pressure-tracker', 'calorie-food-search',
  'exercise-calorie', 'nutrition-calculator', 'sleep-calculator', 'steps-calorie',
  'blood-sugar-tracker', 'menstrual-calculator', 'baby-development', 'height-predictor',
  'name-meaning', 'lunch-picker',
  // 금융
  'tax-calculator', 'currency-premium', 'subscription-calculator', 'stock-calculator',
  'vat-calculator',
  // 생활
  'car-cost-calculator', 'electricity-calculator', 'gas-calculator',
  'color-palette', 'color-converter', 'color-contrast', 'color-temperature',
  'internet-speed-converter',
  // 이미지
  'image-compressor', 'image-editor', 'pdf-tools', 'color-extractor', 'image-base64',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://keyword-mixer.vercel.app'
  const now = new Date()

  return [
    // 홈페이지 - 최고 우선순위
    {
      url: base,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 검색량 높은 핵심 도구 - 높은 우선순위
    ...HIGH_PRIORITY.map(tool => ({
      url: `${base}/${tool}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    // 중간 검색량 도구
    ...MEDIUM_PRIORITY.map(tool => ({
      url: `${base}/${tool}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // 기타 도구
    ...ALL_TOOLS.filter(t => t !== '').map(tool => ({
      url: `${base}/${tool}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
