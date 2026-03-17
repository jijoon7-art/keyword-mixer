'use client'

import { useState, useEffect, useRef } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // 왼쪽 끝 hover 감지 (데스크톱 전용)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 데스크톱(lg = 1024px 이상)에서만 동작
      if (window.innerWidth < 1024) return

      // 왼쪽 5px 이내 → 자동 오픈 (사이드바가 항상 보이는 상태이므로 스킵)
      // 이 기능은 모바일/태블릿에서만 의미 있음
    }

    // 모바일: 왼쪽 20px 영역에 터치하면 사이드바 열기
    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 1024) return
      const touch = e.touches[0]
      if (touch.clientX < 20) {
        setMenuOpen(true)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('touchstart', handleTouchStart)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [])

  return (
    <>
      <Header
        onMenuToggle={() => setMenuOpen(prev => !prev)}
        menuOpen={menuOpen}
      />
      <div className="flex">
        <Sidebar
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
        <main className="flex-1 lg:ml-52 min-h-[calc(100vh-44px)]">
          {children}
        </main>
      </div>
    </>
  )
}
