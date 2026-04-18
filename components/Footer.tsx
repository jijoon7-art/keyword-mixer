'use client'
import Link from 'next/link'
import { useLang } from './LangContext'

export default function Footer() {
  const { lang } = useLang()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-surface-border bg-[#0f1117]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* 서비스 소개 */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">K</span>
              </div>
              <span className="text-sm font-bold text-slate-200">Keyword Mixer</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              {lang === 'ko'
                ? '130개+ 무료 온라인 계산기·도구. 회원가입 없이 즉시 사용.'
                : '130+ free online calculators and tools. No sign-up required.'}
            </p>
            <p className="text-xs text-slate-600">© {year} Keyword Mixer</p>
          </div>

          {/* 인기 도구 */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-3">
              {lang === 'ko' ? '인기 도구' : 'Popular Tools'}
            </p>
            <ul className="space-y-1.5">
              {[
                [lang === 'ko' ? '퇴직금 계산기' : 'Severance Pay', '/severance-pay'],
                [lang === 'ko' ? 'BMI 계산기' : 'BMI Calculator', '/bmi-calculator-pro'],
                [lang === 'ko' ? '부가세 계산기' : 'VAT Calculator', '/vat-calculator'],
                [lang === 'ko' ? '연말정산' : 'Tax Settlement', '/tax-refund'],
                [lang === 'ko' ? '환율 계산기' : 'Exchange Rate', '/exchange-rate'],
              ].map(([label, href]) => (
                <li key={href as string}>
                  <Link href={href as string} className="text-xs text-slate-500 hover:text-brand-400 transition-all">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 카테고리 */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-3">
              {lang === 'ko' ? '카테고리' : 'Categories'}
            </p>
            <ul className="space-y-1.5">
              {[
                [lang === 'ko' ? '금융·세금' : 'Finance & Tax', '/vat-calculator'],
                [lang === 'ko' ? '건강·다이어트' : 'Health', '/bmi-calculator-pro'],
                [lang === 'ko' ? '텍스트·마케팅' : 'Text & Marketing', '/char-counter'],
                [lang === 'ko' ? '개발자 도구' : 'Dev Tools', '/json-formatter'],
                [lang === 'ko' ? '생활·유틸리티' : 'Life Tools', '/exchange-rate'],
              ].map(([label, href]) => (
                <li key={href as string}>
                  <Link href={href as string} className="text-xs text-slate-500 hover:text-brand-400 transition-all">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <p className="text-xs font-semibold text-slate-300 mb-3">
              {lang === 'ko' ? '서비스 정보' : 'Service Info'}
            </p>
            <ul className="space-y-1.5">
              {[
                [lang === 'ko' ? '서비스 소개' : 'About', '/about'],
                [lang === 'ko' ? '개인정보처리방침' : 'Privacy Policy', '/privacy'],
                [lang === 'ko' ? '이용약관' : 'Terms of Service', '/terms'],
                [lang === 'ko' ? '문의하기' : 'Contact', '/contact'],
              ].map(([label, href]) => (
                <li key={href as string}>
                  <Link href={href as string} className="text-xs text-slate-500 hover:text-brand-400 transition-all">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 */}
        <div className="border-t border-surface-border pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs text-slate-600">
            {lang === 'ko'
              ? '본 서비스의 계산 결과는 참고용이며 법적·의료적·금융적 조언이 아닙니다.'
              : 'Results are for reference only and do not constitute legal, medical, or financial advice.'}
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-slate-600 hover:text-slate-400 transition-all">
              {lang === 'ko' ? '개인정보처리방침' : 'Privacy'}
            </Link>
            <Link href="/terms" className="text-xs text-slate-600 hover:text-slate-400 transition-all">
              {lang === 'ko' ? '이용약관' : 'Terms'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
