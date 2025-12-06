'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const brandGradient = 'linear-gradient(120deg, #1d5c4d 0%, #2fa374 100%)'
  const brandPrimary = '#1d5c4d'
  const brandMask = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 2000'><path d='m961 580h78l2 2 25 2 6 3 13 1 5 2 14 3 4 2 12 2 12 6 8 2 12 4 19 10 8 2 9 6 7 2 9 6 12 7 15 10 13 9 6 5 8 6 6 5v2l4 2 16 16 8 6 4 6 12 12 8 10 7 9 8 9 6 10 3 3 3 6 3 2 36-18h16l5 4 5 11v7l-3 3-1 23-3 10-1 5v10l-3 5-1 25-4 16v10l-3 5-1 30-4 13v14l-3 3-1 12-4 5-7 3-4 2-3-3-10-2-2-2-7-3-16-8-1-1-9-2-48-24-21-10-9-3-24-12-1-1-9-2-7-6-9-2-8-7-1-2v-12l5-9 17-9 16-8 8-5 10-6 3-3-4-7-8-10-7-10-8-8-7-8-10-10-8-7-6-5-5-3-9-6-10-7-5-3-7-5-40-20-12-2-10-5-18-3-5-2-13-3-9-1h-72l-12 3-10 2-1 1-15 2-21 7-13 5-7 3-6 2-17 9-7 5-7 4-5 4-7 4-5 4-9 6-10 10-6 3-18 18-3 6-8 9-5 5-3 6-6 8-9 15-11 21-4 9-4 11-4 8-2 9-3 5-1 7-2 6-1 18-2 5-1 8v53l7 3v2l5 2 12 5 11 5 7 2 7 5 10 3 15 8 4 4 2 6v8l-1 7-11 7-9 6-13 8-10 6-5 6 8 15 3 6 8 13 5 8 8 10 4 6 8 8 6 7 6 5 6 7 6 5 4 4v2l4 2 7 6 9 6v2l4 2 11 7 15 10 15 8 11 5 9 3 11 3 4 2 8 2 3 2 9 2 10 2 13 1 5 3h63l8-1 2-2 18-2 2-2 11-1 5-3 13-2 12-6 10-3 16-8 12-7 15-10 13-10 11-8 11-11h2l2-4h2l2-4h2l2-4 13-13 7-10 6-9 7-10 6-12 5-7 4-11 5-9 4-10 4-8 2-12 6-10 7-6h11l19 9 28 14 11 4 21 10 18 10 3 7-1 12-3 5-2 9-5 13-10 21-10 19-8 15-5 7-3 5-5 7-3 5-9 11-3 5-6 7-33 33-8 7-5 5-5 2-14 13-6 3-8 6-9 6-19 10-46 23-10 3-10 5-14 3-10 5-9 1-5 1-10 3-7 2-1 1-20 2-7 2-21 2-3 2-16 1h-44l-12-1-1-1-23-3-1-1-25-3-20-6-11-3-24-8-12-5-6-2-12-6-8-2-16-8-6-5-16-8-9-5-4-4-5-2-8-6-5-3-13-12-6-3-36-36-6-9-10-11-6-9-7-9-9-14-7-12-8-12-5-6-3-1-11 9-8 5-6 5-3 1h-13l-5-3-6-7v-204l2-3 2-28 3-7 1-17 3-10 2-8 2-5 2-12 6-17 5-13 6-15 5-12 4-10 7-13 8-13 7-14 6-8 3-5 9-12 11-14 4-6 11-12 8-9h2l2-6 6-4 12-11 10-10 14-10 11-10 7-4 10-7 17-10 6-4 4-3 10-2v-2l6-4 10-3 9-5 7-3 10-5 12-2 11-6 14-2 2-2 13-2 4-2 17-2 2-2 26-2z'/></svg>\")"

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-[#c7e6d6]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity flex items-center gap-0">
            <span
              className="inline-flex items-center gap-0"
              style={{
                backgroundImage: brandGradient,
                WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            <span
              className="inline-block h-[1.5em] w-[1.5em] -mr-2"
              style={{
                transform: 'translateY(1px) scale(1.1)',
                transformOrigin: 'center',
                backgroundImage: brandGradient,
                filter: 'brightness(0.9)',
                WebkitMaskImage: brandMask,
                maskImage: brandMask,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
              }}
              aria-hidden="true"
            />
            <span className="leading-none">lairity</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/scan" 
            className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors relative group"
          >
            Scan
            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#2fa374] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/explorer" 
            className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors relative group"
          >
            Explorer
            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#2fa374] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/local" 
            className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors relative group"
          >
            Local Rules
            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#2fa374] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/about-design" 
            className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-px bg-[#2fa374] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#e6f2ea] transition-colors border border-[#c7e6d6] bg-white"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#c7e6d6] bg-white/95 backdrop-blur-sm animate-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/scan" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors py-2"
            >
              Scan
            </Link>
            <Link 
              href="/explorer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors py-2"
            >
              Explorer
            </Link>
            <Link 
              href="/local"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors py-2"
            >
              Local Rules
            </Link>
            <Link 
              href="/about-design"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-[#1d5c4d] transition-colors py-2"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
