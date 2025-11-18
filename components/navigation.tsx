'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity">
          <span className="gradient-text">Clairity</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/scan" 
            className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors relative group"
          >
            Scan
            <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/explorer" 
            className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors relative group"
          >
            Explorer
            <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/local" 
            className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors relative group"
          >
            Local Rules
            <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link 
            href="/about-design" 
            className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors relative group"
          >
            About
            <span className="absolute bottom-0 left-0 w-0 h-px bg-emerald-400 transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5 text-foreground" />
          ) : (
            <Menu className="h-5 w-5 text-foreground" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-sm animate-in slide-in-from-top-2">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link 
              href="/scan" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors py-2"
            >
              Scan
            </Link>
            <Link 
              href="/explorer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors py-2"
            >
              Explorer
            </Link>
            <Link 
              href="/local"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors py-2"
            >
              Local Rules
            </Link>
            <Link 
              href="/about-design"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-sm font-medium text-foreground/70 hover:text-emerald-400 transition-colors py-2"
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
