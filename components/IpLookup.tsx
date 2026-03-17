'use client'

import { useState, useEffect } from 'react'
import { useLang } from './LangContext'
import ToolFooter from './ToolFooter'
import { Copy, CheckCheck, RefreshCw, Search } from 'lucide-react'

const T = {
  ko: {
    title: 'IP 주소 조회',
    desc: '내 IP 주소, 위치, ISP를 즉시 확인. 특정 IP 정보도 조회 가능.',
    myIp: '내 IP 주소',
    lookup: 'IP 조회',
    lookupPlaceholder: '조회할 IP 주소 입력 (예: 8.8.8.8)',
    ip: 'IP 주소',
    country: '국가',
    city: '도시',
    region: '지역',
    isp: 'ISP / 통신사',
    timezone: '타임존',
    lat: '위도',
    lng: '경도',
    loading: '조회 중...',
    copy: '복사',
    copied: '복사됨',
    refresh: '새로고침',
    type: 'IP 유형',
    search: '조회',
  },
  en: {
    title: 'IP Address Lookup',
    desc: 'Check your IP address, location, and ISP instantly. Look up any IP address.',
    myIp: 'My IP Address',
    lookup: 'IP Lookup',
    lookupPlaceholder: 'Enter IP address (e.g. 8.8.8.8)',
    ip: 'IP Address',
    country: 'Country',
    city: 'City',
    region: 'Region',
    isp: 'ISP / Provider',
    timezone: 'Timezone',
    lat: 'Latitude',
    lng: 'Longitude',
    loading: 'Loading...',
    copy: 'Copy',
    copied: 'Copied!',
    refresh: 'Refresh',
    type: 'IP Type',
    search: 'Search',
  }
}

interface IPInfo {
  ip: string
  country_name?: string
  country?: string
  city?: string
  region?: string
  org?: string
  timezone?: string
  latitude?: number
  longitude?: number
}

export default function IpLookup() {
  const { lang } = useLang()
  const tx = T[lang]

  const [myInfo, setMyInfo] = useState<IPInfo | null>(null)
  const [lookupIp, setLookupIp] = useState('')
  const [lookupInfo, setLookupInfo] = useState<IPInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState('')

  const fetchMyIp = async () => {
    setLoading(true)
    try {
      const res = await fetch('https://ipapi.co/json/')
      const data = await res.json()
      setMyInfo(data)
    } catch {
      setMyInfo({ ip: lang === 'ko' ? '조회 실패' : 'Failed to fetch' })
    }
    setLoading(false)
  }

  const lookupIpInfo = async () => {
    if (!lookupIp.trim()) return
    setLookupLoading(true); setError('')
    try {
      const res = await fetch(`https://ipapi.co/${lookupIp.trim()}/json/`)
      const data = await res.json()
      if (data.error) { setError(data.reason || 'Invalid IP'); setLookupInfo(null) }
      else setLookupInfo(data)
    } catch {
      setError(lang === 'ko' ? '조회 실패. IP 주소를 확인하세요.' : 'Lookup failed. Check the IP address.')
    }
    setLookupLoading(false)
  }

  useEffect(() => { fetchMyIp() }, [])

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const InfoRow = ({ label, value, copyKey }: { label: string; value?: string | number; copyKey: string }) => (
    <div className="flex items-center justify-between py-2.5 border-b border-surface-border last:border-0">
      <span className="text-xs text-slate-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-sm text-slate-200 font-medium flex-1 text-right">{value || '-'}</span>
      {value && (
        <button onClick={() => copy(String(value), copyKey)} className={`ml-2 p-1 rounded transition-all ${copied === copyKey ? 'text-brand-400' : 'text-slate-600 hover:text-brand-400'}`}>
          {copied === copyKey ? <CheckCheck size={12} /> : <Copy size={12} />}
        </button>
      )}
    </div>
  )

  const IPCard = ({ info, title }: { info: IPInfo; title: string }) => (
    <div className="rounded-xl border border-surface-border bg-[#1a1d27] overflow-hidden">
      <div className="px-4 py-3 border-b border-surface-border bg-[#0f1117] flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
        <div className="text-lg font-mono font-bold text-brand-400">{info.ip}</div>
      </div>
      <div className="px-4 py-1">
        <InfoRow label={tx.country} value={info.country_name} copyKey="country" />
        <InfoRow label={tx.region} value={info.region} copyKey="region" />
        <InfoRow label={tx.city} value={info.city} copyKey="city" />
        <InfoRow label={tx.isp} value={info.org} copyKey="org" />
        <InfoRow label={tx.timezone} value={info.timezone} copyKey="tz" />
        <InfoRow label={tx.lat} value={info.latitude} copyKey="lat" />
        <InfoRow label={tx.lng} value={info.longitude} copyKey="lng" />
      </div>
      {info.latitude && info.longitude && (
        <div className="px-4 py-3 border-t border-surface-border">
          <a href={`https://www.google.com/maps?q=${info.latitude},${info.longitude}`} target="_blank" rel="noopener noreferrer"
            className="text-xs text-brand-400 hover:underline">
            📍 {lang === 'ko' ? '지도에서 보기' : 'View on Maps'} →
          </a>
        </div>
      )}
    </div>
  )

  // 알려진 IP들
  const KNOWN_IPS = [
    { ip: '8.8.8.8', label: 'Google DNS' },
    { ip: '1.1.1.1', label: 'Cloudflare' },
    { ip: '208.67.222.222', label: 'OpenDNS' },
    { ip: '168.126.63.1', label: 'KT DNS' },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
          Free Tool
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{tx.title}</h1>
        <p className="text-slate-300 text-base max-w-lg mx-auto">{tx.desc}</p>
      </div>

      {/* 내 IP */}
      <div className="mb-5">
        {loading ? (
          <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-8 text-center">
            <RefreshCw size={20} className="mx-auto text-brand-400 animate-spin mb-2" />
            <p className="text-slate-400 text-sm">{tx.loading}</p>
          </div>
        ) : myInfo ? (
          <IPCard info={myInfo} title={tx.myIp} />
        ) : null}
        <button onClick={fetchMyIp} className="mt-2 w-full py-2 text-xs text-slate-500 hover:text-brand-400 flex items-center justify-center gap-1 transition-all">
          <RefreshCw size={11} /> {tx.refresh}
        </button>
      </div>

      {/* IP 조회 */}
      <div className="rounded-xl border border-surface-border bg-[#1a1d27] p-5 mb-5">
        <h2 className="text-sm font-semibold text-slate-200 mb-3">{tx.lookup}</h2>
        <div className="flex gap-2 mb-3">
          <input value={lookupIp} onChange={e => setLookupIp(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && lookupIpInfo()}
            placeholder={tx.lookupPlaceholder}
            className="flex-1 bg-[#0f1117] border border-surface-border rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500/50 transition-all font-mono" />
          <button onClick={lookupIpInfo} disabled={lookupLoading || !lookupIp.trim()}
            className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:opacity-40 text-white font-bold text-sm transition-all flex items-center gap-1.5">
            <Search size={14} /> {tx.search}
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {KNOWN_IPS.map(k => (
            <button key={k.ip} onClick={() => { setLookupIp(k.ip); setTimeout(lookupIpInfo, 100) }}
              className="text-xs px-2.5 py-1 rounded border border-surface-border text-slate-400 hover:text-brand-400 hover:border-brand-500/40 transition-all">
              {k.label} ({k.ip})
            </button>
          ))}
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>

      {lookupInfo && <IPCard info={lookupInfo} title={`${lookupInfo.ip} ${lang === 'ko' ? '조회 결과' : 'Lookup Result'}`} />}

      <ToolFooter
        toolName={lang === 'ko' ? 'IP 주소 조회' : 'IP Address Lookup'}
        toolUrl="https://keyword-mixer.vercel.app/ip-lookup"
        description={tx.desc}
        howToUse={lang === 'ko' ? [
          { step: '내 IP 자동 조회', desc: '페이지 접속 시 현재 IP 주소와 위치 정보가 자동으로 표시됩니다.' },
          { step: '위치 정보 확인', desc: '국가, 도시, ISP, 타임존, 좌표 등 상세 정보를 확인하세요.' },
          { step: '다른 IP 조회', desc: '특정 IP를 입력하고 조회 버튼을 누르면 해당 IP 정보를 확인할 수 있습니다.' },
          { step: '지도에서 확인', desc: '지도에서 보기 링크로 IP 위치를 Google Maps에서 확인하세요.' },
        ] : [
          { step: 'Auto-detect my IP', desc: 'Your IP address and location info are shown automatically on page load.' },
          { step: 'View location details', desc: 'See country, city, ISP, timezone, and coordinates.' },
          { step: 'Look up any IP', desc: 'Enter any IP address and click Search to get its information.' },
          { step: 'View on map', desc: 'Click "View on Maps" to see the IP location on Google Maps.' },
        ]}
        whyUse={lang === 'ko' ? [
          { title: '즉시 내 IP 확인', desc: '현재 사용 중인 공인 IP 주소를 클릭 없이 바로 확인할 수 있습니다.' },
          { title: 'IP 보안 확인', desc: 'VPN 사용 시 IP가 올바르게 변경되었는지 확인할 수 있습니다.' },
          { title: '지역 제한 우회 확인', desc: '현재 IP의 국가 정보를 확인해 콘텐츠 접근 가능 여부를 파악하세요.' },
          { title: '다른 IP 정보 조회', desc: 'DNS 서버, 웹사이트 서버 IP 등 특정 IP의 소유자와 위치를 확인하세요.' },
        ] : [
          { title: 'Instant IP check', desc: 'See your current public IP address without clicking anything.' },
          { title: 'VPN verification', desc: 'Verify your VPN is working correctly by checking the displayed IP.' },
          { title: 'Geo-restriction check', desc: 'Know your IP country to understand content access restrictions.' },
          { title: 'Any IP lookup', desc: 'Look up DNS servers, website IPs, and identify their location and ISP.' },
        ]}
        faqs={lang === 'ko' ? [
          { q: '공인 IP와 사설 IP 차이는?', a: '공인 IP(Public IP)는 인터넷에서 사용되는 고유 주소입니다. 사설 IP(Private IP)는 가정/기업 내부 네트워크에서만 사용됩니다. 이 도구에서 표시되는 IP는 공인 IP입니다.' },
          { q: 'VPN을 사용하면 어떻게 되나요?', a: 'VPN 연결 시 실제 IP 대신 VPN 서버의 IP가 표시됩니다. 국가와 위치 정보도 VPN 서버 위치로 변경됩니다.' },
          { q: 'IP 주소는 왜 바뀌나요?', a: '대부분의 가정용 인터넷은 유동 IP를 사용해 주기적으로 변경됩니다. 고정 IP는 별도 신청이 필요합니다.' },
          { q: 'IPv4와 IPv6 차이는?', a: 'IPv4는 192.168.0.1 형태의 32비트 주소, IPv6는 2001:0db8:: 형태의 128비트 주소입니다. IPv4 고갈로 IPv6로 전환 중입니다.' },
        ] : [
          { q: 'What is the difference between public and private IP?', a: 'Public IP is your internet-facing address. Private IP (like 192.168.x.x) is used only within your local network. This tool shows your public IP.' },
          { q: 'What happens when I use a VPN?', a: 'With VPN, your VPN server IP is shown instead of your real IP. Country and location will reflect the VPN server location.' },
          { q: 'Why does my IP change?', a: 'Most home connections use dynamic IPs that change periodically. Static IPs require a separate request from your ISP.' },
          { q: 'IPv4 vs IPv6?', a: 'IPv4 uses 32-bit addresses (like 192.168.0.1). IPv6 uses 128-bit addresses (like 2001:0db8::). IPv6 is the solution to IPv4 exhaustion.' },
        ]}
        keywords="IP 주소 조회 · 내 IP 확인 · IP 위치 조회 · 공인 IP · IP 검색 · IP lookup · what is my IP · my IP address · IP address checker · IP geolocation · IP location · check IP address · IP tracker"
      />
    </div>
  )
}
