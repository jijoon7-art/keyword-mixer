# Keyword Mixer — 키워드 조합기

> 무료 SEO 키워드 조합기 · Free keyword combiner & mixer tool  
> 🌐 [keywordmixer.app](https://keywordmixer.app)

## ✨ 경쟁사 대비 업그레이드 기능

| 기능 | keywordsound.com | **Keyword Mixer** |
|------|----------------|-----------------|
| 그룹 수 | 4개 고정 | **2~6개 동적 추가/삭제** |
| 엑셀 다운로드 | ❌ | **✅ .xlsx (헤더 스타일 포함)** |
| CSV 다운로드 | ✅ | ✅ (BOM 포함, Excel 호환) |
| TXT 다운로드 | ❌ | **✅** |
| 행별 복사 | ❌ | **✅ (클릭으로 각 키워드 복사)** |
| 구분자 선택 | 공백 고정 | **공백/없음/쉼표/언더스코어/하이픈** |
| 소문자 변환 | ❌ | **✅** |
| 한국어+영어 | 한국어만 | **✅ 토글** |
| SEO 메타태그 | 기본 | **Open Graph, Schema.org, sitemap** |
| 결과 미리보기 | 스크롤 | **5,000줄 테이블 + 초과 시 안내** |
| 다크 테마 | ❌ | **✅ (기본)** |

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

## 📦 Vercel 배포

```bash
# GitHub에 push 후 vercel.com에서 import
# 환경변수 없음 — 그대로 배포 가능
```

## 🔑 배포 후 할 일

1. `app/layout.tsx` — `YOUR_NAVER_CODE`, `YOUR_GOOGLE_CODE` 교체
2. Google AdSense 승인 후 layout.tsx의 주석 해제
3. Vercel 도메인 설정: `keywordmixer.app` 연결

## 🗂 프로젝트 구조

```
keyword-mixer/
├── app/
│   ├── layout.tsx       # SEO 메타태그, JSON-LD
│   ├── page.tsx
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   └── KeywordMixer.tsx  # 메인 UI 컴포넌트
└── lib/
    ├── combiner.ts       # 조합 로직
    ├── exportExcel.ts    # Excel/CSV/TXT 내보내기
    └── i18n.ts           # 한국어/영어 번역
```

## 💰 수익화 계획

- **Google AdSense**: 무료 도구 + 고트래픽 = 광고 수익 최적
- **Naver SEO 타깃**: 키워드 조합기, 키워드 믹서, SEO 도구
- **Google SEO 타깃**: keyword combiner, keyword mixer, free keyword tool
