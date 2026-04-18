'use client'

import { useState, useEffect, useRef } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (window.innerWidth >= 1024) return
      const touch = e.touches[0]
      if (touch.clientX < 20) {
        setMenuOpen(true)
      }
    }
    document.addEventListener('touchstart', handleTouchStart)
    return () => {
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
          <Footer />
        </main>
      </div>
    </>
  )
}
