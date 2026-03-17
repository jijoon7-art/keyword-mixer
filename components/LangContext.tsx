'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'ko' | 'en'

interface LangContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (ko: string, en: string) => string
}

const LangContext = createContext<LangContextType>({
  lang: 'ko',
  setLang: () => {},
  t: (ko) => ko,
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ko')

  useEffect(() => {
    // 저장된 언어 설정 불러오기
    const saved = localStorage.getItem('km_lang') as Lang | null
    if (saved) { setLangState(saved); return }

    // IP 기반 자동 감지 (브라우저 언어 기반 폴백)
    const browserLang = navigator.language.toLowerCase()
    if (!browserLang.startsWith('ko')) {
      setLangState('en')
      localStorage.setItem('km_lang', 'en')
    }
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('km_lang', l)
  }

  const t = (ko: string, en: string) => lang === 'en' ? en : ko

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
