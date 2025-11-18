import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Navigation } from '@/components/navigation'
import { ArrowRight, Eye, Recycle, Search, MapPin } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
      </div>
      
      <Navigation />
      
      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 sm:mb-8 text-balance leading-[0.95] tracking-tight px-4">
            <span className="gradient-text block">Recycling,</span>
            <span className="gradient-text block">finally clear.</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/70 mb-8 sm:mb-12 text-balance max-w-3xl mx-auto leading-relaxed font-light px-4">
            Clairity uses AI vision to identify plastics and reveal what really happens to the materials you throw away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
            <Link href="/scan">
              <button className="gradient-button text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold flex items-center gap-2 w-full sm:w-auto justify-center">
                Start Scanning
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Button asChild variant="outline" size="lg" className="text-base sm:text-lg glass hover:bg-white/5 border-white/20 w-full sm:w-auto">
              <Link href="/explorer">
                Explore Materials
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Search, title: 'Scan Plastics', desc: 'Upload a photo to identify plastic types instantly', href: '/scan' },
              { icon: Recycle, title: 'Explore Materials', desc: 'Learn about all 7 plastic types and their recyclability', href: '/explorer' },
              { icon: MapPin, title: 'Local Rules', desc: 'Check what your municipality accepts for recycling', href: '/local' },
            ].map((item, idx) => (
              <Link key={idx} href={item.href}>
                <Card className="p-6 interactive-card glass-strong gradient-border cursor-pointer h-full group">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/15 transition-colors">
                    <item.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">The Problem with Recycling</span>
            </h2>
            <p className="text-lg text-foreground/60 text-balance">
              Current recycling symbols are confusing, misleading, and don't tell you the whole story
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { icon: Search, title: 'Hard to Identify', desc: 'Tiny symbols hidden on products make it difficult to know what you\'re dealing with' },
              { icon: Eye, title: 'Misleading Information', desc: 'A recycling symbol doesn\'t mean it actually gets recycled in your area' },
              { icon: Recycle, title: 'Hidden Reality', desc: 'Most people don\'t know what really happens to their plastic after disposal' }
            ].map((item, idx) => (
              <div key={idx} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/15 transition-colors border border-emerald-500/20">
                  <item.icon className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-sm text-foreground/60 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
        
        <div className="container mx-auto max-w-3xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight tracking-tight px-4">
            <span className="gradient-text">Ready to see the truth about your plastics?</span>
          </h2>
          <p className="text-xl text-foreground/60 mb-12 text-balance px-4">
            Upload a photo and discover the real lifecycle of your materials
          </p>
          <Link href="/scan">
            <button className="gradient-button text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2 mx-auto">
              Scan Your Plastic
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </section>

      <footer className="py-16 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Product</h4>
              <ul className="space-y-3 text-sm text-foreground/60">
                <li><Link href="/scan" className="hover:text-foreground transition-colors">Scan Plastic</Link></li>
                <li><Link href="/explorer" className="hover:text-foreground transition-colors">Explorer</Link></li>
                <li><Link href="/local" className="hover:text-foreground transition-colors">Local Rules</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Learn</h4>
              <ul className="space-y-3 text-sm text-foreground/60">
                <li><Link href="/about-design" className="hover:text-foreground transition-colors">About Design</Link></li>
                <li><Link href="/system" className="hover:text-foreground transition-colors">Mark System</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Resources</h4>
              <ul className="space-y-3 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-foreground">Company</h4>
              <ul className="space-y-3 text-sm text-foreground/60">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-sm text-foreground/60">
            <p className="mb-2">
              <span className="gradient-text font-semibold">Clairity</span> — Making recycling transparent.
            </p>
            <p>&copy; 2025 All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
