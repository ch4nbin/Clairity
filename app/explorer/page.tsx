'use client'

import { useState, useMemo } from 'react'
import { Navigation } from '@/components/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Recycle, AlertTriangle, CheckCircle2 } from 'lucide-react'

interface PlasticType {
  resinCode: number
  material: string
  fullName: string
  recyclabilityScore: number
  commonUses: string[]
  description: string
}

const PLASTIC_TYPES: PlasticType[] = [
  {
    resinCode: 1,
    material: 'PET',
    fullName: 'Polyethylene Terephthalate',
    recyclabilityScore: 95,
    commonUses: ['Water bottles', 'Soda bottles', 'Food containers', 'Mouthwash bottles'],
    description: 'Most commonly recycled plastic. Found in beverage bottles and food packaging. Clear and lightweight with good barrier properties.',
  },
  {
    resinCode: 2,
    material: 'HDPE',
    fullName: 'High-Density Polyethylene',
    recyclabilityScore: 90,
    commonUses: ['Milk jugs', 'Detergent bottles', 'Shampoo bottles', 'Toys'],
    description: 'Highly recyclable and durable. Used for containers that need to be sturdy and chemical-resistant. Opaque or colored appearance.',
  },
  {
    resinCode: 3,
    material: 'PVC',
    fullName: 'Polyvinyl Chloride',
    recyclabilityScore: 20,
    commonUses: ['Pipes', 'Window frames', 'Medical tubing', 'Wire insulation'],
    description: 'Rarely recycled due to toxic additives. Durable and weather-resistant but releases harmful chemicals when burned or degraded.',
  },
  {
    resinCode: 4,
    material: 'LDPE',
    fullName: 'Low-Density Polyethylene',
    recyclabilityScore: 45,
    commonUses: ['Plastic bags', 'Squeeze bottles', 'Flexible lids', 'Bread bags'],
    description: 'Flexible and soft plastic. Technically recyclable but not accepted in most curbside programs. Often ends up in landfills.',
  },
  {
    resinCode: 5,
    material: 'PP',
    fullName: 'Polypropylene',
    recyclabilityScore: 75,
    commonUses: ['Yogurt containers', 'Bottle caps', 'Straws', 'Food storage'],
    description: 'Increasingly recyclable with good heat resistance. Found in many food containers and packaging. Growing acceptance in recycling programs.',
  },
  {
    resinCode: 6,
    material: 'PS',
    fullName: 'Polystyrene',
    recyclabilityScore: 15,
    commonUses: ['Styrofoam cups', 'Disposable plates', 'Packaging peanuts', 'Food trays'],
    description: 'Rarely recycled and highly problematic. Breaks into microplastics easily. Most facilities refuse to process due to low economic value.',
  },
  {
    resinCode: 7,
    material: 'Other',
    fullName: 'Other Plastics',
    recyclabilityScore: 10,
    commonUses: ['Polycarbonate', 'Bioplastics', 'Mixed plastics', 'CDs/DVDs'],
    description: 'Catch-all category for various plastics. Generally not recyclable in standard facilities. Includes newer materials like bioplastics.',
  },
]

export default function ExplorerPage() {
  const [selectedResinCode, setSelectedResinCode] = useState<string>('all')
  const [minRecyclability, setMinRecyclability] = useState<number>(0)

  const filteredPlastics = useMemo(() => {
    return PLASTIC_TYPES.filter((plastic) => {
      const matchesResinCode = selectedResinCode === 'all' || plastic.resinCode === parseInt(selectedResinCode)
      const matchesRecyclability = plastic.recyclabilityScore >= minRecyclability
      return matchesResinCode && matchesRecyclability
    })
  }, [selectedResinCode, minRecyclability])

  const getRecyclabilityLevel = (score: number) => {
    if (score >= 75) return { label: 'Highly Recyclable', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 }
    if (score >= 40) return { label: 'Sometimes Recycled', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', icon: Recycle }
    return { label: 'Rarely Recycled', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">Plastic Explorer</span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              Browse all 7 plastic resin codes and learn about their properties, uses, and recyclability
            </p>
          </div>

          <Card className="mb-8 glass-strong gradient-border">
            <CardHeader>
              <CardTitle className="text-foreground">Filter Plastics</CardTitle>
              <CardDescription className="text-foreground/60">
                Narrow down by resin code or recyclability score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Resin Code</label>
                  <Select value={selectedResinCode} onValueChange={setSelectedResinCode}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue placeholder="All resin codes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Resin Codes</SelectItem>
                      {PLASTIC_TYPES.map((plastic) => (
                        <SelectItem key={plastic.resinCode} value={plastic.resinCode.toString()}>
                          {plastic.resinCode} - {plastic.material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Minimum Recyclability: {minRecyclability}%
                  </label>
                  <Slider
                    value={[minRecyclability]}
                    onValueChange={(value) => setMinRecyclability(value[0])}
                    max={100}
                    step={5}
                    className="mt-3"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-foreground/60">
              Showing {filteredPlastics.length} of {PLASTIC_TYPES.length} plastic types
            </p>
          </div>

          {filteredPlastics.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlastics.map((plastic) => {
                const recyclability = getRecyclabilityLevel(plastic.recyclabilityScore)
                const RecyclabilityIcon = recyclability.icon

                return (
                  <Card key={plastic.resinCode} className="interactive-card glass-strong gradient-border hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-20 h-20 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-4xl font-bold gradient-text">{plastic.resinCode}</span>
                        </div>
                        <Badge variant="secondary" className={`${recyclability.bg} border`}>
                          <RecyclabilityIcon className={`h-3 w-3 mr-1 ${recyclability.color}`} />
                          <span className={recyclability.color}>{plastic.recyclabilityScore}%</span>
                        </Badge>
                      </div>
                      <CardTitle className="text-xl text-foreground">{plastic.material}</CardTitle>
                      <CardDescription className="text-xs text-foreground/60">{plastic.fullName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Recyclability Status</p>
                        <Badge className={`${recyclability.bg} ${recyclability.color} border-none`}>
                          {recyclability.label}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Common Uses</p>
                        <div className="flex flex-wrap gap-2">
                          {plastic.commonUses.map((use, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-white/20">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Description</p>
                        <p className="text-sm text-foreground/60 leading-relaxed">
                          {plastic.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="p-12 text-center glass">
              <Recycle className="h-12 w-12 mx-auto mb-4 text-foreground/40" />
              <p className="text-lg font-medium mb-2">No plastics match your filters</p>
              <p className="text-sm text-foreground/60">
                Try adjusting your filters to see more results
              </p>
            </Card>
          )}

          {/* Info Section */}
          <Card className="mt-12 glass-strong gradient-border">
            <CardHeader>
              <CardTitle className="text-foreground">Understanding Recyclability Scores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span className="font-semibold text-foreground">75-100%: Highly Recyclable</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Widely accepted in most recycling programs with established infrastructure
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-foreground">40-74%: Sometimes Recycled</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Accepted by some programs - check with your local facility
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-orange-400" />
                    <span className="font-semibold text-foreground">0-39%: Rarely Recycled</span>
                  </div>
                  <p className="text-sm text-foreground/60">
                    Not economically viable - most facilities do not accept
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
