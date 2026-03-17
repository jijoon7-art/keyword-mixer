'use client'

import ToolFooter from './ToolFooter'
import { useState, useMemo } from 'react'
import { Copy, CheckCheck } from 'lucide-react'

const EXAMPLES = [
  { name: '이메일', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g', test: 'user@example.com, invalid-email, test@test.co.kr' },
  { name: '전화번호', pattern: '0\\d{1,2}-\\d{3,4}-\\d{4}', flags: 'g', test: '010-1234-5678, 02-123-4567, 031-1234-5678' },
  { name: '한국어', pattern: '[가-힣]+', flags: 'g', test: 'Hello 안녕하세요 World 반갑습니다' },
  { name: 'URL', pattern: 'https?:\\/\\/[^\\s]+', flags: 'g', test: 'Visit https://example.com or http://test.org for more' },
  { name: '숫자만', pattern: '\\d+', flags: 'g', test: 'abc123def456ghi789' },
  { name: '공백 여러 개', pattern: '\\s{2,}', flags: 'g', test: 'Hello   World  This   is  a  test' },
  { name: '날짜 (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}', flags: 'g', test: '2024-01-15, 2024-13-45, 오늘은 2024-03-16 입니다' },
  { name: '우편번호', pattern: '\\d{5}', flags: 'g', test: '서울 12345, 부산 67890, invalid 1234' },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')
  const [flags, setFlags] = useState('g')
  const [testStr, setTestStr] = useState('user@example.com, invalid-email, test@test.co.kr')
  const [replacement, setReplacement] = useState('***')
  const [copied, setCopied] = useState<string | null>(null)

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: '', replaced: testStr, count: 0 }
    try {
      const regex = new RegExp(pattern, flags)
      const matches: { match: string; index: number; groups: string[] }[] = []
      let m
      const r = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
      while ((m = r.exec(testStr)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.slice(1) })
        if (!flags.includes('g')) break
      }
      const replaced = testStr.replace(new RegExp(pattern, flags), replacement)
      return { matches, error: '', replaced, count: matches.length }
    } catch (e) {
      return { matches: [], error: (e as Error).message, replaced: testStr, count: 0 }
    }
  }, [pattern, flags, testStr, replacement])

  const highlightedText = useMemo(() => {
    if (!pattern || result.error || result.matches.length === 0) return testStr
    try {
      return testStr.replace(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'), match =>
        `<mark style="background:#22c55e30;color:#22c55e;border-radius:2px;padding:0 2px">${match}</mark>`
      )
    } catch { return testStr }
  }, [testStr, pattern, flags, result])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const FLAG_OPTIONS = ['g', 'i', 'm', 's', 'u']

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Developer Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">정규식 테스터</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">
          정규식을 실시간으로 테스트. 매칭 하이라이트, 치환, 그룹 캡처, 예제 모음 제공.
        </p>
      </div>

      {/* Examples */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-5">
        <p className="text-xs text-slate-400 mb-2 font-medium">예제 패턴</p>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLES.map(e => (
            <button key={e.name} onClick={() => { setPattern(e.pattern); setFlags(e.flags); setTestStr(e.test) }}
              className="text-xs px-3 py-1.5 rounded-lg border border-surface-border text-slate-300 hover:border-brand-500/40 hover:text-brand-300 bg-[#0f1117] transition-all">
              {e.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern & Flags */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
        <div className="flex gap-3 items-center">
          <span className="text-slate-500 text-lg font-mono">/</span>
          <input value={pattern} onChange={e => setPattern(e.target.value)}
            placeholder="정규식 패턴 입력..."
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
          <span className="text-slate-500 text-lg font-mono">/</span>
          <div className="flex gap-1">
            {FLAG_OPTIONS.map(f => (
              <button key={f} onClick={() => setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f)}
                className={`w-8 h-8 rounded-lg border text-xs font-mono font-bold transition-all ${flags.includes(f) ? 'bg-brand-500 border-brand-500 text-white' : 'border-surface-border text-slate-400 hover:border-brand-500/40 bg-[#0f1117]'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={() => copy(`/${pattern}/${flags}`, 'pattern')}
            className={`px-3 py-2.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${copied === 'pattern' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied === 'pattern' ? <CheckCheck size={12} /> : <Copy size={12} />}
          </button>
        </div>

        {result.error && (
          <p className="text-red-400 text-xs mt-2 font-mono">⚠ {result.error}</p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-slate-500 font-medium">플래그:</span>
          {[['g','전체 매칭'],['i','대소문자 무시'],['m','다중 라인'],['s','. 줄바꿈 포함'],['u','유니코드']].map(([f, desc]) => (
            <span key={f} className={`text-xs px-2 py-0.5 rounded font-mono ${flags.includes(f) ? 'bg-brand-500/20 text-brand-400' : 'text-slate-600'}`}>
              {f}: {desc}
            </span>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Test string */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">테스트 문자열</span>
            <span className={`text-xs font-mono ${result.count > 0 ? 'text-brand-400' : 'text-slate-500'}`}>
              {result.error ? '오류' : `${result.count}개 매칭`}
            </span>
          </div>
          <textarea value={testStr} onChange={e => setTestStr(e.target.value)}
            rows={8} className="w-full bg-transparent px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none resize-none font-mono leading-relaxed" />
        </div>

        {/* Highlighted */}
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-surface-border">
            <span className="text-sm font-medium text-slate-200">매칭 하이라이트</span>
          </div>
          <div className="px-4 py-3 text-sm font-mono leading-relaxed min-h-[180px] text-slate-300 whitespace-pre-wrap break-all"
            dangerouslySetInnerHTML={{ __html: highlightedText }} />
        </div>
      </div>

      {/* Matches */}
      {result.matches.length > 0 && (
        <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4 mb-4">
          <p className="text-xs text-slate-400 mb-3 font-medium">매칭 결과 ({result.count}개)</p>
          <div className="flex flex-wrap gap-2">
            {result.matches.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <span className="text-xs text-slate-500 font-mono">[{m.index}]</span>
                <span className="text-xs text-brand-300 font-mono font-bold">{m.match}</span>
                {m.groups.length > 0 && m.groups.map((g, j) => g && (
                  <span key={j} className="text-xs text-blue-300 font-mono">({g})</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replace */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-4">
        <p className="text-xs text-slate-400 mb-3 font-medium">치환 (Replace)</p>
        <div className="flex gap-3 items-center mb-3">
          <input value={replacement} onChange={e => setReplacement(e.target.value)}
            placeholder="치환할 텍스트..."
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all" />
          <button onClick={() => copy(result.replaced, 'replaced')}
            className={`px-3 py-2 rounded-lg border text-xs transition-all flex items-center gap-1 ${copied === 'replaced' ? 'bg-brand-500/20 border-brand-500/40 text-brand-400' : 'border-surface-border text-slate-300 hover:border-brand-500/40'}`}>
            {copied === 'replaced' ? <CheckCheck size={12} /> : <Copy size={12} />}
            결과 복사
          </button>
        </div>
        <div className="bg-[#0f1117] rounded-lg px-4 py-3 text-sm font-mono text-slate-300 min-h-[60px] whitespace-pre-wrap break-all">
          {result.replaced || <span className="text-slate-600">치환 결과가 여기에 표시됩니다</span>}
        </div>
      </div>

      {/* 정규식 기초 문법 가이드 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden mt-6">
        <div className="px-5 py-3 border-b border-surface-border bg-[#0f1117]">
          <h2 className="text-sm font-bold text-slate-200">📚 정규식 기초 문법 가이드 — Regex Quick Reference</h2>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* 문자 클래스 */}
            <div>
              <p className="text-xs font-bold text-brand-400 mb-2 uppercase tracking-wider">문자 클래스 (Character Classes)</p>
              <div className="flex flex-col gap-1">
                {[
                  ['.', '임의의 문자 1개 (줄바꿈 제외)', 'Any character except newline'],
                  ['\\d', '숫자 [0-9]', 'Digit [0-9]'],
                  ['\\D', '숫자가 아닌 문자', 'Non-digit'],
                  ['\\w', '단어 문자 [a-zA-Z0-9_]', 'Word character'],
                  ['\\W', '단어 문자가 아닌 것', 'Non-word character'],
                  ['\\s', '공백 문자 (스페이스, 탭, 줄바꿈)', 'Whitespace'],
                  ['\\S', '공백이 아닌 문자', 'Non-whitespace'],
                  ['[abc]', 'a, b, c 중 하나', 'One of: a, b, c'],
                  ['[^abc]', 'a, b, c 제외한 문자', 'Not a, b, or c'],
                  ['[a-z]', 'a~z 소문자', 'Lowercase a-z'],
                  ['[가-힣]', '한글 문자', 'Korean characters'],
                ].map(([sym, ko, en]) => (
                  <div key={sym} className="flex items-start gap-2 py-1 border-b border-surface-border/50 last:border-0">
                    <code className="text-brand-400 font-mono font-bold text-xs w-20 flex-shrink-0">{sym}</code>
                    <span className="text-xs text-slate-300">{ko}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 수량자 */}
            <div>
              <p className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">수량자 (Quantifiers)</p>
              <div className="flex flex-col gap-1 mb-4">
                {[
                  ['*', '0번 이상 반복', '0 or more'],
                  ['+', '1번 이상 반복', '1 or more'],
                  ['?', '0번 또는 1번', '0 or 1 (optional)'],
                  ['{n}', '정확히 n번', 'Exactly n times'],
                  ['{n,}', 'n번 이상', 'n or more'],
                  ['{n,m}', 'n~m번', 'Between n and m'],
                  ['*?', '최소 매칭 (게으른)', 'Lazy/non-greedy'],
                ].map(([sym, ko, en]) => (
                  <div key={sym} className="flex items-start gap-2 py-1 border-b border-surface-border/50 last:border-0">
                    <code className="text-blue-400 font-mono font-bold text-xs w-20 flex-shrink-0">{sym}</code>
                    <span className="text-xs text-slate-300">{ko}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">앵커 & 그룹 (Anchors & Groups)</p>
              <div className="flex flex-col gap-1">
                {[
                  ['^', '문자열 시작', 'Start of string'],
                  ['$', '문자열 끝', 'End of string'],
                  ['\\b', '단어 경계', 'Word boundary'],
                  ['(abc)', '그룹 캡처', 'Capture group'],
                  ['(?:abc)', '비캡처 그룹', 'Non-capture group'],
                  ['a|b', 'a 또는 b', 'a or b'],
                  ['(?=abc)', '전방 탐색', 'Lookahead'],
                  ['(?!abc)', '부정 전방 탐색', 'Negative lookahead'],
                ].map(([sym, ko, en]) => (
                  <div key={sym} className="flex items-start gap-2 py-1 border-b border-surface-border/50 last:border-0">
                    <code className="text-purple-400 font-mono font-bold text-xs w-20 flex-shrink-0">{sym}</code>
                    <span className="text-xs text-slate-300">{ko}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 실용 패턴 예제 */}
          <div className="mt-4">
            <p className="text-xs font-bold text-orange-400 mb-2 uppercase tracking-wider">자주 쓰는 패턴 예제 (Common Patterns)</p>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                ['이메일', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'],
                ['전화번호', '0\\d{1,2}-\\d{3,4}-\\d{4}'],
                ['URL', 'https?:\\/\\/[^\\s]+'],
                ['한국어', '[가-힣]+'],
                ['숫자만', '^\\d+$'],
                ['영문자만', '^[a-zA-Z]+$'],
                ['날짜 YYYY-MM-DD', '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])'],
                ['IP 주소', '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b'],
                ['우편번호', '^\\d{5}$'],
                ['비밀번호 강도', '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,}$'],
              ].map(([name, pattern]) => (
                <div key={name} className="p-2.5 rounded-lg bg-[#0f1117] border border-surface-border">
                  <p className="text-xs font-bold text-slate-300 mb-1">{name}</p>
                  <code className="text-xs text-orange-300 font-mono break-all">{pattern}</code>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 정규식 기초 문법 가이드 */}
      <div className="mt-6 rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
        <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117]">
          <h2 className="text-sm font-bold text-slate-200">📚 정규식 기초 문법 (Regex Quick Reference)</h2>
        </div>
        <div className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">

            {/* 문자 클래스 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-brand-400 mb-2 uppercase tracking-wider">문자 클래스</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-surface-border">
                  {[
                    ['.',    '개행 제외 모든 문자'],
                    ['\\d', '숫자 [0-9]'],
                    ['\\D', '숫자가 아닌 문자'],
                    ['\\w', '단어 문자 [a-zA-Z0-9_]'],
                    ['\\W', '단어 문자가 아닌 것'],
                    ['\\s', '공백 문자 (스페이스, 탭, 줄바꿈)'],
                    ['\\S', '공백이 아닌 문자'],
                    ['[abc]', 'a, b, c 중 하나'],
                    ['[^abc]', 'a, b, c 제외'],
                    ['[a-z]', 'a~z 소문자'],
                    ['[가-힣]', '한글 전체'],
                  ].map(([sym, desc]) => (
                    <tr key={sym} className="hover:bg-surface-hover/20">
                      <td className="py-1 pr-2 font-mono text-orange-300 whitespace-nowrap">{sym}</td>
                      <td className="py-1 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 수량자 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">수량자 (Quantifiers)</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-surface-border">
                  {[
                    ['*',    '0회 이상'],
                    ['+',    '1회 이상'],
                    ['?',    '0회 또는 1회 (선택적)'],
                    ['{n}',  '정확히 n회'],
                    ['{n,}', 'n회 이상'],
                    ['{n,m}','n~m회'],
                    ['*?',   '0회 이상 (최소 매칭)'],
                    ['+?',   '1회 이상 (최소 매칭)'],
                  ].map(([sym, desc]) => (
                    <tr key={sym} className="hover:bg-surface-hover/20">
                      <td className="py-1 pr-2 font-mono text-blue-300 whitespace-nowrap">{sym}</td>
                      <td className="py-1 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 앵커 & 그룹 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">앵커 & 그룹</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-surface-border">
                  {[
                    ['^',       '문자열 시작'],
                    ['$',       '문자열 끝'],
                    ['\\b',   '단어 경계'],
                    ['\\B',   '단어 경계가 아닌 곳'],
                    ['(abc)',   '캡처 그룹'],
                    ['(?:abc)', '비캡처 그룹'],
                    ['a|b',     'a 또는 b'],
                    ['(?=abc)', '앞에 abc 있음 (전방탐색)'],
                    ['(?!abc)', '앞에 abc 없음 (부정 전방탐색)'],
                    ['$1, $2',  '그룹 참조 (치환 시)'],
                  ].map(([sym, desc]) => (
                    <tr key={sym} className="hover:bg-surface-hover/20">
                      <td className="py-1 pr-2 font-mono text-purple-300 whitespace-nowrap">{sym}</td>
                      <td className="py-1 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 플래그 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-yellow-400 mb-2 uppercase tracking-wider">플래그 (Flags)</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-surface-border">
                  {[
                    ['g', '전체 문자열에서 모두 찾기 (global)'],
                    ['i', '대소문자 구분 없음 (case insensitive)'],
                    ['m', '다중 라인 모드 (multiline)'],
                    ['s', ". 이 \\n 포함 (dotAll)"],
                    ['u', '유니코드 모드 (unicode)'],
                    ['y', '마지막 위치부터 탐색 (sticky)'],
                  ].map(([sym, desc]) => (
                    <tr key={sym} className="hover:bg-surface-hover/20">
                      <td className="py-1 pr-2 font-mono text-yellow-300 whitespace-nowrap">/{sym}</td>
                      <td className="py-1 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 이스케이프 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">이스케이프 문자</p>
              <table className="w-full text-xs">
                <tbody className="divide-y divide-surface-border">
                  {[
                    ['\\n', '줄바꿈 (Newline)'],
                    ['\\t', '탭 (Tab)'],
                    ['\\r', '캐리지 리턴'],
                    ['\\.', '. 문자 그대로'],
                    ['\\*', '* 문자 그대로'],
                    ['\\+', '+ 문자 그대로'],
                    ['\\?', '? 문자 그대로'],
                    ['\\(', '( 문자 그대로'],
                    ['\\[', '[ 문자 그대로'],
                    ['\\\\', '\\ 문자 그대로'],
                  ].map(([sym, desc]) => (
                    <tr key={sym} className="hover:bg-surface-hover/20">
                      <td className="py-1 pr-2 font-mono text-red-300 whitespace-nowrap">{sym}</td>
                      <td className="py-1 text-slate-400">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 실전 예제 */}
            <div className="rounded-lg border border-surface-border bg-[#0f1117] p-3">
              <p className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">실전 예제</p>
              <div className="flex flex-col gap-2">
                {[
                  ['이메일', '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'],
                  ['전화번호', '01[016789]-\\d{3,4}-\\d{4}'],
                  ['URL', 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=%]+'],
                  ['날짜 YYYY-MM-DD', '\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])'],
                  ['주민번호 앞자리', '\\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\\d|3[01])'],
                  ['한글만', '^[가-힣\\s]+$'],
                  ['영숫자만', '^[a-zA-Z0-9]+$'],
                  ['강한 비밀번호', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%]).{8,}$'],
                ].map(([name, pattern]) => (
                  <div key={name} className="flex flex-col gap-0.5">
                    <span className="text-xs text-green-300 font-medium">{name}</span>
                    <code className="text-xs text-slate-400 font-mono break-all">{pattern}</code>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

            <ToolFooter
        toolName="정규식 테스터"
        toolUrl="https://keyword-mixer.vercel.app/regex-tester"
        description="정규식을 실시간으로 테스트. 매칭 하이라이트, 치환 지원."
        howToUse={[
          { step: '도구 접속', desc: '정규식 테스터에 접속하세요.' },
          { step: '내용 입력', desc: '필요한 내용을 입력하거나 파일을 업로드하세요.' },
          { step: '결과 확인', desc: '변환/생성된 결과를 즉시 확인하세요.' },
          { step: '복사 또는 저장', desc: '결과를 복사하거나 파일로 저장하세요.' },
        ]}
        whyUse={[
          { title: '무료 사용', desc: '로그인 없이 완전 무료로 사용할 수 있습니다.' },
          { title: '빠른 처리', desc: '브라우저에서 즉시 처리되어 빠르게 결과를 얻을 수 있습니다.' },
          { title: '개인정보 보호', desc: '서버에 데이터가 저장되지 않아 안전합니다.' },
          { title: '다양한 기능', desc: '시중 유사 도구보다 더 많은 기능을 제공합니다.' },
        ]}
        faqs={[
          { q: '이 도구는 무료인가요?', a: '네, 완전 무료입니다. 로그인도 필요 없습니다.' },
          { q: '데이터는 서버에 저장되나요?', a: '아니요. 모든 처리는 브라우저에서 이루어지며 서버에 전송되지 않습니다.' },
          { q: '모바일에서도 사용할 수 있나요?', a: '네, 모바일 브라우저에서도 동일하게 사용할 수 있습니다.' },
          { q: '오류가 발생하면 어떻게 하나요?', a: '페이지를 새로고침하거나 하단 피드백 폼으로 알려주시면 빠르게 수정하겠습니다.' },
        ]}
        keywords="정규식 테스터 · 정규표현식 · regex tester · 정규식 문법 · 정규식 기초 · 정규표현식 문법 · regex syntax · regex cheatsheet · JavaScript regex · regular expression tester · regex quick reference · free regex tool"
      />
    </div>
  )
}
