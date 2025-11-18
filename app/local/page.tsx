'use client'

import { useState } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, MapPin, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'

interface RecyclingRule {
  resinCode: number
  material: string
  accepted: boolean
  notes: string
}

interface LocalRules {
  zipcode: string
  municipality: string
  rules: RecyclingRule[]
}

export default function LocalPage() {
  const [zipcode, setZipcode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [localRules, setLocalRules] = useState<LocalRules | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!zipcode || zipcode.length < 5) {
      setError('Please enter a valid 5-digit zipcode')
      return
    }

    setIsLoading(true)
    setError(null)
    setLocalRules(null)

    try {
      const response = await fetch(`/api/local?zipcode=${zipcode}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('No recycling data found for this zipcode')
        } else {
          setError('Failed to fetch recycling rules')
        }
        return
      }

      const data = await response.json()
      setLocalRules(data)
    } catch (err) {
      setError('An error occurred while fetching data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Local Recycling Rules</span>
            </h1>
            <p className="text-lg text-foreground/60 text-balance max-w-2xl mx-auto">
              Enter your zipcode to see which plastics are accepted in your local recycling program
            </p>
          </div>

          <Card className="mb-8 glass-strong gradient-border">
            <CardHeader>
              <CardTitle className="gradient-text">Search by Zipcode</CardTitle>
              <CardDescription className="text-foreground/60">
                Find out what can and can't be recycled in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/40" />
                  <Input
                    type="text"
                    placeholder="Enter 5-digit zipcode (e.g., 94107)"
                    value={zipcode}
                    onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    onKeyPress={handleKeyPress}
                    className="pl-10 glass border-white/20"
                    maxLength={5}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="gradient-button text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-5 w-5" />
                      Check Rules
                    </>
                  )}
                </button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {localRules && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="glass-strong gradient-border">
                <CardHeader>
                  <div className="flex items-center gap-2 text-accent mb-2">
                    <MapPin className="h-5 w-5" />
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <CardTitle className="text-2xl gradient-text">{localRules.municipality}</CardTitle>
                  <CardDescription className="text-foreground/60">Zipcode: {localRules.zipcode}</CardDescription>
                </CardHeader>
              </Card>

              <Card className="glass-strong gradient-border">
                <CardHeader>
                  <CardTitle className="gradient-text">Accepted Materials</CardTitle>
                  <CardDescription className="text-foreground/60">
                    Plastic types accepted in your local recycling program
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-white/10 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10">
                          <TableHead className="w-24">Code</TableHead>
                          <TableHead>Material</TableHead>
                          <TableHead className="w-32 text-center">Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {localRules.rules.map((rule) => (
                          <TableRow key={rule.resinCode} className="border-white/10">
                            <TableCell>
                              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center border border-primary/30">
                                <span className="text-xl font-bold gradient-text">{rule.resinCode}</span>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{rule.material}</TableCell>
                            <TableCell className="text-center">
                              {rule.accepted ? (
                                <Badge className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 border-none">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Accepted
                                </Badge>
                              ) : (
                                <Badge className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400 border-none">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Not Accepted
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-foreground/60">
                              {rule.notes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-strong">
                <CardHeader>
                  <CardTitle className="text-base">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-foreground/60">
                  <p>• Always rinse containers before recycling to prevent contamination</p>
                  <p>• Remove caps and lids unless instructed otherwise</p>
                  <p>• Check with your local facility for specific preparation requirements</p>
                  <p>• When in doubt, contact your municipal recycling center</p>
                </CardContent>
              </Card>
            </div>
          )}

          {!localRules && !error && (
            <Card className="p-12 text-center border-dashed glass">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-foreground/40" />
              <p className="text-lg font-medium mb-2">Enter your zipcode to get started</p>
              <p className="text-sm text-foreground/60">
                We'll show you which plastics are accepted in your local recycling program
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
