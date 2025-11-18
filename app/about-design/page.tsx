import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, AlertTriangle, Target, Lightbulb } from 'lucide-react'

export default function AboutDesignPage() {
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
      
      <main className="pt-32 pb-16 px-4 relative">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">About Our Design System</span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              Reimagining how we communicate about plastics and recycling
            </p>
          </div>

          <div className="space-y-6">
            <Card className="glass-strong border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl">Why Recycling Needs Clarity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  For decades, consumers have been told to "look for the recycling symbol" when deciding what to recycle. 
                  But this guidance obscures a critical truth: the presence of a recycling symbol does not mean an item 
                  will actually be recycled. In fact, most plastic with a recycling symbol ends up in landfills or 
                  incinerators.
                </p>
                <p>
                  The current system creates the illusion of sustainability while allowing the plastic industry to 
                  continue producing single-use materials at unprecedented rates. Consumers bear the burden of sorting 
                  and disposing responsibly, yet lack the information needed to make truly informed decisions.
                </p>
                <p>
                  Clairity exists to bridge this information gap. We believe transparency is the first step toward 
                  systemic change. When people understand what really happens to their plastic waste, they can make 
                  better choices and demand better solutions.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Eye className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl">Problems with Existing Resin Codes</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  The resin identification coding system was introduced in 1988 by the Society of the Plastics Industry. 
                  While it successfully identifies plastic types, it was never designed to indicate recyclability. Yet 
                  the chasing arrows symbol misleads consumers into believing all numbered plastics are equally recyclable.
                </p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-lg space-y-2 text-sm">
                  <p className="font-semibold text-foreground">Key problems:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Symbols are tiny and hard to find on products</li>
                    <li>The chasing arrows imply recyclability regardless of resin type</li>
                    <li>No distinction between widely recycled (PET, HDPE) and rarely recycled (PS, PVC) plastics</li>
                    <li>No information about local recycling acceptance</li>
                    <li>Doesn't communicate the reality of downcycling vs. true circular recycling</li>
                  </ul>
                </div>
                <p>
                  The result is "wishcycling" - tossing items into recycling bins and hoping for the best. This 
                  contaminates recycling streams, increases processing costs, and ultimately sends more material to 
                  landfills.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Target className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl">Design Goals for Clairity</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Our redesigned marking system aims to solve these communication failures through clear visual 
                  hierarchy and honest information. Every design decision prioritizes transparency over greenwashing.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">1. Instant Recognition</p>
                    <p className="text-sm">
                      Larger, clearer marks that are immediately visible without searching the product
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">2. Honest Communication</p>
                    <p className="text-sm">
                      Color coding and visual weight that reflects actual recyclability rates
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">3. Actionable Information</p>
                    <p className="text-sm">
                      Integration with local recycling rules so users know what to do
                    </p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-4 rounded-lg">
                    <p className="font-semibold text-foreground mb-2">4. Education First</p>
                    <p className="text-sm">
                      Context about what happens after disposal, not just identification
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-strong border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-emerald-400" />
                  </div>
                  <CardTitle className="text-2xl">How Our New Mark System Works</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-foreground/70 leading-relaxed">
                <p>
                  Our redesigned marks maintain the numbered resin code system for material identification but add 
                  crucial context through visual design. Each mark communicates not just what the plastic is, but what 
                  will likely happen to it.
                </p>
                <div className="bg-white/5 border border-white/10 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Visual Hierarchy</p>
                    <p className="text-sm">
                      Highly recyclable plastics (1, 2, 5) receive prominent, positive design treatment with green 
                      accents. Rarely recycled plastics (3, 6, 7) are marked with warning colors and clear cautionary 
                      indicators.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Context Integration</p>
                    <p className="text-sm">
                      When scanned with our app, each mark links to detailed information about local acceptance, 
                      processing methods, and true lifecycle outcomes. No more guessing.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Progressive Disclosure</p>
                    <p className="text-sm">
                      At a glance: recyclability indicator. With a scan: full material details, local rules, and 
                      environmental impact. Information scales to user engagement level.
                    </p>
                  </div>
                </div>
                <p>
                  We're still refining the visual language through user testing and feedback. Our goal is a system 
                  that empowers people with truth, not false hope. Because real environmental progress starts with 
                  clear information.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-strong border-emerald-500/20 bg-emerald-500/5">
              <CardContent className="py-8 text-center">
                <p className="text-lg font-medium mb-2">
                  This is a work in progress. We're iterating based on research and feedback.
                </p>
                <p className="text-sm text-foreground/60">
                  Have thoughts on how we can improve? We'd love to hear from you.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
