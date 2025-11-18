import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

interface PlasticMark {
  resinCode: number
  material: string
  fullName: string
  recyclabilityScore: number
  level: 'high' | 'medium' | 'low'
  notes: string
  visualConcept: string
}

const PLASTIC_MARKS: PlasticMark[] = [
  {
    resinCode: 1,
    material: 'PET',
    fullName: 'Polyethylene Terephthalate',
    recyclabilityScore: 95,
    level: 'high',
    notes: 'Widely accepted. Look for clear bottles and containers.',
    visualConcept: 'Bold green accents, prominent display, positive indicators',
  },
  {
    resinCode: 2,
    material: 'HDPE',
    fullName: 'High-Density Polyethylene',
    recyclabilityScore: 90,
    level: 'high',
    notes: 'Excellent recyclability. Common in milk jugs and detergent bottles.',
    visualConcept: 'Strong green indicators, high visibility, trustworthy design',
  },
  {
    resinCode: 3,
    material: 'PVC',
    fullName: 'Polyvinyl Chloride',
    recyclabilityScore: 20,
    level: 'low',
    notes: 'Rarely recycled. Contains toxic chemicals. Avoid when possible.',
    visualConcept: 'Red warning indicators, cautionary symbols, clear hazard communication',
  },
  {
    resinCode: 4,
    material: 'LDPE',
    fullName: 'Low-Density Polyethylene',
    recyclabilityScore: 45,
    level: 'medium',
    notes: 'Sometimes accepted. Check local programs for bags and films.',
    visualConcept: 'Yellow/amber cautionary tones, question mark indicators',
  },
  {
    resinCode: 5,
    material: 'PP',
    fullName: 'Polypropylene',
    recyclabilityScore: 75,
    level: 'high',
    notes: 'Growing acceptance. Common in food containers and caps.',
    visualConcept: 'Green with slight caution, positive but realistic indicators',
  },
  {
    resinCode: 6,
    material: 'PS',
    fullName: 'Polystyrene',
    recyclabilityScore: 15,
    level: 'low',
    notes: 'Almost never recycled. Breaks into microplastics. Major environmental concern.',
    visualConcept: 'Strong red warnings, environmental hazard symbols, avoid indicators',
  },
  {
    resinCode: 7,
    material: 'Other',
    fullName: 'Other Plastics',
    recyclabilityScore: 10,
    level: 'low',
    notes: 'Mixed categories. Generally not recyclable in standard facilities.',
    visualConcept: 'Gray/red uncertain indicators, requires special handling symbols',
  },
]

export default function SystemPage() {
  const getIcon = (level: string) => {
    switch (level) {
      case 'high':
        return CheckCircle2
      case 'medium':
        return AlertTriangle
      case 'low':
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const getColorClasses = (level: string) => {
    switch (level) {
      case 'high':
        return {
          bg: 'bg-green-100 dark:bg-green-950',
          text: 'text-green-700 dark:text-green-400',
          border: 'border-green-300 dark:border-green-800',
        }
      case 'medium':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-950',
          text: 'text-yellow-700 dark:text-yellow-400',
          border: 'border-yellow-300 dark:border-yellow-800',
        }
      case 'low':
        return {
          bg: 'bg-red-100 dark:bg-red-950',
          text: 'text-red-700 dark:text-red-400',
          border: 'border-red-300 dark:border-red-800',
        }
      default:
        return {
          bg: 'bg-secondary',
          text: 'text-muted-foreground',
          border: 'border-border',
        }
    }
  }

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
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Redesigned Mark System</span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              A visual language that communicates truth about plastic recyclability
            </p>
          </div>

          <Card className="mb-12 glass-strong border-white/10">
            <CardHeader>
              <CardTitle>Design Philosophy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                Our redesigned marks use color, typography, and iconography to communicate recyclability at a glance. 
                Unlike traditional resin codes that treat all plastics equally, our system provides honest visual 
                feedback about what actually gets recycled.
              </p>
              <p className="text-sm italic">
                Note: These are placeholder designs. Final marks will be refined through user testing and feedback.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {PLASTIC_MARKS.map((mark) => {
              const Icon = getIcon(mark.level)
              const colors = getColorClasses(mark.level)

              return (
                <Card key={mark.resinCode} className={`border-2 ${colors.border} glass-strong`}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-24 h-24 rounded-2xl ${colors.bg} flex items-center justify-center border-2 ${colors.border}`}>
                        <span className={`text-4xl font-bold ${colors.text}`}>{mark.resinCode}</span>
                      </div>
                      <Badge variant="secondary" className={`${colors.bg} ${colors.text} border-none`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {mark.recyclabilityScore}%
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{mark.material}</CardTitle>
                    <CardDescription className="text-sm">{mark.fullName}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Recyclability Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${colors.bg} ${colors.border} border-r-2 transition-all`}
                            style={{ width: `${mark.recyclabilityScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-semibold ${colors.text}`}>
                          {mark.recyclabilityScore}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Usage Notes</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {mark.notes}
                      </p>
                    </div>
                    <div className={`p-3 ${colors.bg} rounded-lg border ${colors.border}`}>
                      <p className={`text-xs font-medium mb-1 ${colors.text}`}>Visual Design Concept</p>
                      <p className={`text-xs ${colors.text}`}>
                        {mark.visualConcept}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Card className="glass-strong border-emerald-500/20 bg-emerald-500/5">
            <CardHeader>
              <CardTitle>Coming Soon: Physical Marks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed">
              <p>
                We're working on producing physical mark samples that manufacturers could adopt. These marks would be 
                larger, clearer, and more informative than current resin codes - printed prominently on packaging rather 
                than hidden in small print.
              </p>
              <p>
                Our goal is to partner with brands committed to transparency and give consumers the information they 
                need to make informed decisions about the products they buy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
