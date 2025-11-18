'use client'

import { useState, useCallback, useRef } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Loader2, Recycle, AlertCircle, MapPin, CheckCircle2, XCircle, Camera, X } from 'lucide-react'
import Image from 'next/image'

interface ClassificationResult {
  resinCode: number
  material: string
  confidence: number
  explanation: string
}

interface LocalRecyclingData {
  zipcode: string
  municipality: string
  rule: {
    resinCode: number
    material: string
    accepted: boolean
    notes: string
  }
}

export default function ScanPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [zipcode, setZipcode] = useState('')
  const [isLoadingLocal, setIsLoadingLocal] = useState(false)
  const [localData, setLocalData] = useState<LocalRecyclingData | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
      setZipcode('')
      setLocalData(null)
      setLocalError(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setResult(null)
      setError(null)
      setZipcode('')
      setLocalData(null)
      setLocalError(null)
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedFile)

      const response = await fetch('/api/classify', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to classify image')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLocalLookup = async () => {
    if (!zipcode || !result) return

    setIsLoadingLocal(true)
    setLocalError(null)
    setLocalData(null)

    try {
      const response = await fetch(`/api/local?zipcode=${zipcode}`)
      
      if (!response.ok) {
        throw new Error('No data found for this zipcode')
      }

      const data = await response.json()
      // Find the rule for the current scanned plastic type
      const relevantRule = data.rules.find((rule: any) => rule.resinCode === result.resinCode)
      
      if (relevantRule) {
        setLocalData({
          zipcode: data.zipcode,
          municipality: data.municipality,
          rule: relevantRule
        })
      } else {
        throw new Error('No rules found for this plastic type')
      }
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Failed to fetch local rules')
    } finally {
      setIsLoadingLocal(false)
    }
  }

  const handleOpenCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      })
      setStream(mediaStream)
      setIsCameraOpen(true)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      setError('Could not access camera. Please check permissions.')
    }
  }

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
    setStream(null)
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setResult(null)
            setError(null)
            setZipcode('')
            setLocalData(null)
            setLocalError(null)
            handleCloseCamera()
          }
        }, 'image/jpeg')
      }
    }
  }

  const getRecyclabilityColor = (code: number) => {
    if (code === 1 || code === 2) return 'text-emerald-400'
    if (code === 3 || code === 6 || code === 7) return 'text-orange-400'
    return 'text-yellow-400'
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
              <span className="gradient-text">Scan Your Plastic</span>
            </h1>
            <p className="text-base md:text-lg text-foreground/60 text-balance px-4">
              Upload a photo of your plastic item to identify its type and learn about its lifecycle
            </p>
          </div>

          <Card className="mb-8 glass-strong gradient-border">
            <CardHeader>
              <CardTitle className="text-foreground text-lg md:text-xl">Upload Image</CardTitle>
              <CardDescription className="text-foreground/60 text-sm md:text-base">
                Take a clear photo of the plastic item or its recycling symbol
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCameraOpen && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
                  <div className="relative w-full max-w-2xl">
                    <button
                      onClick={handleCloseCamera}
                      className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <X className="h-5 w-5 text-white" />
                    </button>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-xl"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={handleCapture}
                        className="gradient-button text-white px-8 py-4 rounded-xl text-lg font-semibold flex items-center gap-2"
                      >
                        <Camera className="h-5 w-5" />
                        Capture Photo
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="border-2 border-dashed border-white/20 rounded-xl p-6 md:p-12 text-center hover:border-emerald-400/30 hover:bg-emerald-500/5 transition-all duration-300 cursor-pointer group"
              >
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto aspect-video rounded-xl overflow-hidden bg-muted/50 ring-1 ring-white/10">
                      <Image
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        setResult(null)
                        setZipcode('')
                        setLocalData(null)
                        setLocalError(null)
                      }}
                      className="glass border-white/20"
                    >
                      Choose Different Image
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="cursor-pointer block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-4 text-foreground/40 group-hover:text-emerald-400 transition-colors" />
                      <p className="text-base md:text-lg font-medium mb-2">
                        Drop an image here or click to browse
                      </p>
                      <p className="text-xs md:text-sm text-foreground/60">
                        Supports JPG, PNG, WebP
                      </p>
                    </label>
                    <div className="pt-4 border-t border-white/10">
                      <button
                        onClick={handleOpenCamera}
                        className="glass border border-white/20 hover:bg-white/5 text-foreground px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mx-auto transition-all"
                      >
                        <Camera className="h-5 w-5" />
                        Take Photo with Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {selectedFile && !result && (
                <div className="mt-6 text-center">
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="gradient-button text-white px-6 md:px-8 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold flex items-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Plastic'
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {result && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="glass-strong gradient-border">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg md:text-xl">Classification Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                    <div className="space-y-6">
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Resin Code</p>
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                          <span className="text-4xl md:text-5xl font-bold gradient-text">{result.resinCode}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Material Type</p>
                        <p className="text-xl md:text-2xl font-bold text-foreground">{result.material}</p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Confidence</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-3 bg-secondary/50 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000 ease-out"
                              style={{ width: `${result.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-base md:text-lg font-semibold text-foreground">
                            {Math.round(result.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 glass rounded-lg border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <Recycle className={`h-5 w-5 ${getRecyclabilityColor(result.resinCode)}`} />
                          <p className="font-semibold text-sm md:text-base">Recyclability Status</p>
                        </div>
                        <p className="text-xs md:text-sm text-foreground/60 leading-relaxed">
                          {result.resinCode === 1 || result.resinCode === 2
                            ? 'Widely accepted in most recycling programs'
                            : result.resinCode === 3 || result.resinCode === 6 || result.resinCode === 7
                            ? 'Rarely recycled - check your local facilities'
                            : 'Sometimes accepted - verify with your local program'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-strong gradient-border">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg md:text-xl">What Happens to This Plastic?</CardTitle>
                  <CardDescription className="text-foreground/60 text-sm md:text-base">
                    The reality of {result.material} recycling and lifecycle
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                    {result.explanation}
                  </p>
                </CardContent>
              </Card>

              <Card className="glass-strong gradient-border overflow-hidden">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <CardTitle className="text-foreground text-lg md:text-xl">How to Recycle in Your Area</CardTitle>
                      <CardDescription className="text-foreground/60 text-sm md:text-base">
                        Enter your zip code to see local recycling guidelines for this plastic
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        placeholder="Enter zip code"
                        value={zipcode}
                        onChange={(e) => setZipcode(e.target.value)}
                        className="flex-1 px-4 py-3 bg-background/50 border border-white/10 rounded-xl text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        maxLength={5}
                      />
                      <button
                        onClick={handleLocalLookup}
                        disabled={isLoadingLocal || zipcode.length !== 5}
                        className="gradient-button text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 w-full sm:w-auto"
                      >
                        {isLoadingLocal ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Looking up...
                          </>
                        ) : (
                          'Check Local Rules'
                        )}
                      </button>
                    </div>

                    {localError && (
                      <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-destructive mb-1">Not Found</p>
                          <p className="text-sm text-destructive/80">{localError}</p>
                          <p className="text-xs text-foreground/60 mt-2">
                            Try: 94107 (SF), 10001 (NYC), 90210 (Beverly Hills), 60601 (Chicago), 02101 (Boston)
                          </p>
                        </div>
                      </div>
                    )}

                    {localData && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-4 glass rounded-xl border border-white/10">
                          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                            <div>
                              <p className="text-sm text-foreground/60 mb-1">Location</p>
                              <p className="text-base md:text-lg font-semibold text-foreground">{localData.municipality}</p>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                              localData.rule.accepted 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                            }`}>
                              {localData.rule.accepted ? (
                                <>
                                  <CheckCircle2 className="h-4 w-4" />
                                  Accepted
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-4 w-4" />
                                  Not Accepted
                                </>
                              )}
                            </div>
                          </div>

                          <div className="p-4 bg-background/30 rounded-lg border border-white/5">
                            <p className="text-sm text-foreground/60 mb-2">Guidelines for {localData.rule.material}</p>
                            <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">{localData.rule.notes}</p>
                          </div>

                          {localData.rule.accepted && (
                            <div className="mt-4 p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                              <p className="text-xs md:text-sm text-emerald-400/90 flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>This plastic can be recycled in your area's curbside program. Remember to rinse and prepare according to local guidelines.</span>
                              </p>
                            </div>
                          )}

                          {!localData.rule.accepted && (
                            <div className="mt-4 p-3 bg-orange-500/5 rounded-lg border border-orange-500/10">
                              <p className="text-xs md:text-sm text-orange-400/90 flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span>This plastic is not accepted in your local curbside recycling program. Consider alternative disposal methods or specialized recycling facilities.</span>
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button
                  onClick={() => {
                    setSelectedFile(null)
                    setPreviewUrl(null)
                    setResult(null)
                    setZipcode('')
                    setLocalData(null)
                    setLocalError(null)
                  }}
                  variant="outline"
                  size="lg"
                  className="glass border-white/20"
                >
                  Scan Another Item
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
