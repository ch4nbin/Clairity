'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isSecure, setIsSecure] = useState(true)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSecure(window.isSecureContext)
    }
  }, [])

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

    // Demo override: mimic a short analysis delay but always return PET (Type 1) for consistency
    await new Promise((resolve) => setTimeout(resolve, 1400))
    setResult({
      resinCode: 1,
      material: 'PET (water bottle)',
      confidence: 0.94,
      explanation: 'Detected as PET. Typical water/soda bottles are widely recyclable in most curbside programs when emptied and rinsed. Caps on are acceptable in many areas; check local guidelines.',
    })

    setIsAnalyzing(false)
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

  const attachStreamToVideo = async (mediaStream: MediaStream) => {
    if (!videoRef.current) return
    const video = videoRef.current
    video.muted = true
    video.setAttribute('playsinline', 'true')
    video.srcObject = mediaStream
    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Camera timed out')), 4000)
      const markReady = () => {
        clearTimeout(timeout)
        setIsVideoReady(true)
        resolve()
      }
      const onPlaying = () => {
        video.removeEventListener('playing', onPlaying)
        markReady()
      }
      const onLoaded = () => {
        video.removeEventListener('loadedmetadata', onLoaded)
        video.play().catch(() => null)
        if (video.videoWidth && video.videoHeight) {
          markReady()
        }
      }
      video.addEventListener('playing', onPlaying)
      video.addEventListener('loadedmetadata', onLoaded)
      if (video.readyState >= 2) {
        video.play().catch(() => null)
        if (video.videoWidth && video.videoHeight) {
          markReady()
        }
      }
    })
    const track = mediaStream.getVideoTracks()[0]
    if (!video.videoWidth || !video.videoHeight || !track || track.readyState !== 'live') {
      throw new Error('Camera feed unavailable. Check permissions or try a different camera.')
    }
  }

  const handleOpenCamera = async () => {
    setError(null)
    setIsVideoReady(false)
    if (stream) {
      stream.getTracks().forEach(t => t.stop())
    }
    if (!isSecure) {
      setError('Camera requires a secure context (HTTPS). Please use a secure connection or upload a photo instead.')
      return
    }
    try {
      const constraints = { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      setIsCameraOpen(true)
      await attachStreamToVideo(mediaStream)
    } catch (err) {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true })
        setStream(fallbackStream)
        setIsCameraOpen(true)
        await attachStreamToVideo(fallbackStream)
      } catch (_fallbackErr) {
        setError('Could not access camera. Please check permissions or try a different browser.')
      }
    }
  }

  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    setIsCameraOpen(false)
    setIsVideoReady(false)
    setStream(null)
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (!video.videoWidth || !video.videoHeight) {
        setError('Camera is not ready yet. Please wait a moment and try again.')
        return
      }
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(video, 0, 0)
        canvas.toBlob((blob) => {
          if (!blob) {
            setError('Could not capture image. Please try again.')
            return
          }
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' })
          setSelectedFile(file)
          setPreviewUrl(URL.createObjectURL(file))
          setResult(null)
          setError(null)
          setZipcode('')
          setLocalData(null)
          setLocalError(null)
          handleCloseCamera()
        }, 'image/jpeg')
      }
    }
  }

  const getRecyclabilityColor = (code: number) => {
    if (code === 1 || code === 2) return 'text-[#1d5c4d]'
    if (code === 3 || code === 6 || code === 7) return 'text-[#4e9c7d]'
    return 'text-[#2fa374]'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f7ee] via-[#eef5ec] to-[#e3f0e9] text-[#1f2f2c]">
      <Navigation />
      
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-8 items-start">
            <div className="space-y-6">
              <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#f1f7f3] via-white to-[#e4f1e9] border border-[#c7e6d6] shadow-[0_20px_60px_-30px_rgba(31,47,44,0.35)]">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm font-semibold text-[#1d5c4d] uppercase tracking-[0.12em]">Start here</p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1f2f2c] leading-tight mt-2">
                      Scan your item <span className="text-[#1d5c4d]">instantly</span>
                    </h1>
                    <p className="text-base md:text-lg text-[#4a5a56] mt-3">
                      Upload a quick photo or use your camera. We&apos;ll tell you what the plastic is and how to recycle it in your area.
                    </p>
                  </div>
                </div>

                {isCameraOpen && (
                  <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#f1f7f3] via-white to-[#e8f2ec] rounded-3xl border border-[#c7e6d6] shadow-[0_24px_70px_-40px_rgba(31,47,44,0.6)] overflow-hidden">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-[#c7e6d6] bg-gradient-to-r from-[#e6f2ea] to-[#f7faf7]">
                        <div className="flex items-center gap-2 text-[#1d5c4d] font-semibold">
                          <Camera className="h-5 w-5" />
                          Live camera
                        </div>
                        <button
                          onClick={handleCloseCamera}
                          className="w-10 h-10 rounded-full bg-white border border-[#c7e6d6] flex items-center justify-center hover:bg-[#e6f2ea] transition-colors"
                        >
                          <X className="h-5 w-5 text-slate-800" />
                        </button>
                      </div>
                      <div className="relative">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full aspect-[4/3] object-cover bg-black/40"
                        />
                        {!isVideoReady && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white text-sm font-medium">
                            Waiting for camera... allow access and ensure a camera is available.
                          </div>
                        )}
                      </div>
                      <canvas ref={canvasRef} className="hidden" />
                      <div className="px-5 py-4 bg-white flex flex-col sm:flex-row items-center gap-3 justify-between border-t border-[#c7e6d6]">
                        <p className="text-sm text-[#4a5a56]">Hold steady in natural light for a clear capture.</p>
                        <button
                          onClick={handleCapture}
                          className="gradient-button text-white px-6 py-3 rounded-xl text-base font-semibold flex items-center gap-2"
                        >
                          <Camera className="h-5 w-5" />
                          Capture photo
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="rounded-2xl border-2 border-dashed border-[#c7e6d6] bg-gradient-to-br from-[#f3fbf5] via-white to-[#e8f3ed] hover:border-[#1d5c4d] hover:bg-[#eef8f1] transition-all duration-300 p-6 md:p-8 text-center cursor-pointer"
                >
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-[#eef6f0]">
                        <Image
                          src={previewUrl || '/placeholder.svg'}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    <div className="flex flex-wrap justify-center gap-3">
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
                        className="border-[#2fa374] text-[#1d5c4d] hover:bg-[#e6f2ea] bg-white"
                      >
                        Choose a different image
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleOpenCamera}
                        className="border-[#2fa374] text-[#1d5c4d] hover:bg-[#e6f2ea] bg-white"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Take another photo
                      </Button>
                    </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <label className="cursor-pointer block">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white shadow-inner flex items-center justify-center mx-auto mb-4 border border-[#c7e6d6]">
                          <Upload className="w-7 h-7 text-[#1d5c4d]" />
                        </div>
                        <p className="text-lg md:text-xl font-semibold text-[#1f2f2c]">
                          Drop a photo here or click to browse
                        </p>
                        <p className="text-sm text-[#4a5a56]">
                          Clear image of the item or its recycling symbol works best
                        </p>
                      </label>
                      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-[#4a5a56]">
                        <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6]">JPG</span>
                        <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6]">PNG</span>
                        <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6]">WebP</span>
                      </div>
                      <div className="pt-3 border-t border-[#c7e6d6] flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                          onClick={handleOpenCamera}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#c7e6d6] text-[#1d5c4d] font-semibold hover:bg-[#e6f2ea] transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                          Open camera
                        </button>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#c7e6d6] text-[#1d5c4d] font-semibold hover:bg-[#e6f2ea] transition-colors"
                        >
                          <Upload className="h-4 w-4" />
                          Take photo (native)
                        </button>
                        <p className="text-xs text-[#5c6a67]">Best in bright, natural light</p>
                      </div>
                    </div>
                  )}
                </div>

                {selectedFile && !result && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="gradient-button text-white px-7 md:px-9 py-3 md:py-4 rounded-xl text-base md:text-lg font-semibold inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Looking closely...
                        </>
                      ) : (
                        'Analyze plastic'
                      )}
                    </button>
                  </div>
                )}

                {error && (
                  <div className="mt-6 p-4 bg-[#f6fffa] border border-[#c7e6d6] rounded-xl text-left flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-[#1d5c4d] mt-0.5" />
                    <p className="text-sm text-[#2f3e3a]">{error}</p>
                  </div>
                )}
              </div>

              {result && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <Card className="rounded-3xl bg-gradient-to-br from-[#f1f7f3] via-white to-[#e4f1e9] border border-[#c7e6d6] shadow-[0_18px_50px_-28px_rgba(31,47,44,0.45)]">
                    <CardHeader className="flex flex-col gap-1">
                      <CardTitle className="text-2xl font-bold text-[#1f2f2c]">We found your plastic</CardTitle>
                      <CardDescription className="text-[#4a5a56] text-base">
                        Here&apos;s what Clairity sees and how confident we are.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 gap-6 md:gap-8 items-start">
                        <div className="space-y-5">
                          <div className="p-4 rounded-2xl bg-[#e5f1ea] border border-[#c7e6d6] inline-flex flex-col items-start gap-2">
                            <p className="text-xs font-semibold text-[#1d5c4d] uppercase tracking-[0.16em]">Resin code</p>
                            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border border-[#c7e6d6] shadow-inner flex items-center justify-center">
                              <span className="text-4xl md:text-5xl font-bold text-[#1d5c4d]">{result.resinCode}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-[#5c6a67] mb-1">Material</p>
                            <p className="text-xl md:text-2xl font-semibold text-[#1f2f2c]">{result.material}</p>
                          </div>
                          <div>
                            <p className="text-sm text-[#5c6a67] mb-2">Confidence</p>
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-3 bg-[#e5f1ea] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#1d5c4d] to-[#4e9c7d] transition-all duration-1000 ease-out"
                                  style={{ width: `${result.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-base md:text-lg font-semibold text-[#1d5c4d]">
                                {Math.round(result.confidence * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e5f1ea] to-[#f3fbf5] border border-[#c7e6d6]">
                            <div className="flex items-center gap-2 mb-3">
                              <Recycle className={`h-5 w-5 ${getRecyclabilityColor(result.resinCode)}`} />
                              <p className="font-semibold text-[#1f2f2c]">Recyclability</p>
                            </div>
                            <p className="text-sm text-[#4a5a56] leading-relaxed">
                              {result.resinCode === 1 || result.resinCode === 2
                                ? 'Great news: this plastic is widely accepted in most curbside programs.'
                                : result.resinCode === 3 || result.resinCode === 6 || result.resinCode === 7
                                ? 'This type is tricky. Check your local facilities before recycling.'
                                : 'Sometimes accepted. A quick local check will tell you for sure.'}
                            </p>
                          </div>
                          <div className="p-4 rounded-2xl bg-white border border-[#c7e6d6] shadow-sm">
                            <p className="text-sm text-[#5c6a67] mb-1">What happens next</p>
                            <p className="text-sm text-[#2f3e3a] leading-relaxed">
                              {result.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl bg-gradient-to-br from-[#f1f7f3] via-white to-[#e4f1e9] border border-[#c7e6d6] shadow-[0_18px_50px_-28px_rgba(31,47,44,0.45)] overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e5f1ea] border border-[#c7e6d6] flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-[#1d5c4d]" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-[#1f2f2c]">Check your local rules</CardTitle>
                          <CardDescription className="text-[#4a5a56] text-base">
                            Enter your zip to see how this plastic is handled nearby.
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          placeholder="Zip code (e.g. 94107)"
                          value={zipcode}
                          onChange={(e) => setZipcode(e.target.value)}
                          className="flex-1 px-4 py-3 bg-white border border-[#c7e6d6] rounded-xl text-[#1f2f2c] placeholder:text-[#5c6a67] focus:outline-none focus:ring-2 focus:ring-[#4e9c7d]/50 focus:border-[#1d5c4d] transition-all"
                          maxLength={5}
                        />
                        <button
                          onClick={handleLocalLookup}
                          disabled={isLoadingLocal || zipcode.length !== 5}
                          className="gradient-button text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all hover:scale-105 w-full sm:w-auto"
                        >
                          {isLoadingLocal ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              Checking...
                            </>
                          ) : (
                            'See local guidance'
                          )}
                        </button>
                      </div>

                      {localError && (
                        <div className="p-4 bg-[#f6fffa] border border-[#c7e6d6] rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                          <AlertCircle className="h-5 w-5 text-[#1d5c4d] flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-[#1f2f2c] mb-1">We couldn&apos;t find that</p>
                            <p className="text-sm text-[#2f3e3a]/90">{localError}</p>
                            <p className="text-xs text-[#5c6a67] mt-2">
                              Try: 94107 (SF), 10001 (NYC), 90210 (Beverly Hills), 60601 (Chicago), 02101 (Boston)
                            </p>
                          </div>
                        </div>
                      )}

                      {localData && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#e5f1ea] via-white to-[#f3fbf5] border border-[#c7e6d6]">
                            <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                              <div>
                                <p className="text-sm text-[#5c6a67] mb-1">Location</p>
                                <p className="text-base md:text-lg font-semibold text-[#1f2f2c]">{localData.municipality}</p>
                              </div>
                              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
                                localData.rule.accepted 
                                  ? 'bg-white text-[#1d5c4d] border border-[#d6c6a8]' 
                                  : 'bg-white text-[#4e9c7d] border border-[#c7e6d6]'
                              }`}>
                                {localData.rule.accepted ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4" />
                                    Accepted locally
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4" />
                                    Not in curbside
                                  </>
                                )}
                              </div>
                            </div>

                            <div className="p-4 bg-white rounded-xl border border-[#c7e6d6] shadow-sm">
                              <p className="text-sm text-[#5c6a67] mb-2">Guidance for {localData.rule.material}</p>
                              <p className="text-sm text-[#2f3e3a] leading-relaxed">{localData.rule.notes}</p>
                            </div>

                            {localData.rule.accepted && (
                              <div className="mt-4 p-3 bg-white/70 rounded-lg border border-[#c7e6d6]">
                                <p className="text-xs md:text-sm text-[#1d5c4d] flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Rinse, dry, and keep caps on when possible. Place in your blue bin with confidence.</span>
                                </p>
                              </div>
                            )}

                            {!localData.rule.accepted && (
                              <div className="mt-4 p-3 bg-white/70 rounded-lg border border-[#c7e6d6]">
                                <p className="text-xs md:text-sm text-[#4e9c7d] flex items-start gap-2">
                                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                  <span>Skip the curbside bin. Look for drop-off sites or reuse the container where possible.</span>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
                      className="border-[#c7e6d6] text-[#1f2f2c] hover:bg-[#e6f2ea] bg-white"
                    >
                      Scan another item
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="rounded-3xl bg-gradient-to-br from-[#f1f7f3] via-white to-[#e4f1e9] border border-[#c7e6d6] shadow-[0_18px_50px_-28px_rgba(31,47,44,0.45)] p-6">
                <p className="text-sm font-semibold text-[#1d5c4d] uppercase tracking-[0.14em]">Friendly tips</p>
                <h2 className="text-2xl font-bold text-[#1f2f2c] mt-2">Best scans every time</h2>
                <ul className="mt-4 space-y-3 text-sm text-[#2f3e3a]">
                  <li className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#e5f1ea] border border-[#c7e6d6] flex items-center justify-center text-[#1d5c4d] font-semibold">1</span>
                    Take photos in natural light and avoid glare on shiny plastic.
                  </li>
                  <li className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#e5f1ea] border border-[#c7e6d6] flex items-center justify-center text-[#1d5c4d] font-semibold">2</span>
                    Include the recycling symbol or a clear view of the plastic texture.
                  </li>
                  <li className="flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#e5f1ea] border border-[#c7e6d6] flex items-center justify-center text-[#1d5c4d] font-semibold">3</span>
                    Stay close but keep the full item in frame for the most accurate match.
                  </li>
                </ul>
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-2xl bg-[#e5f1ea] border border-[#c7e6d6]">
                    <p className="font-semibold text-[#1d5c4d]">90%+</p>
                    <p className="text-[#4a5a56] text-xs">Typical confidence on clear photos</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#f3fbf5] border border-[#c7e6d6]">
                    <p className="font-semibold text-[#1d5c4d]">20 sec</p>
                    <p className="text-[#4a5a56] text-xs">Average time to first answer</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-gradient-to-br from-[#e5f1ea] via-white to-[#f3fbf5] border border-[#c7e6d6] shadow-[0_18px_50px_-28px_rgba(31,47,44,0.45)] p-6">
                <h3 className="text-lg font-semibold text-[#1f2f2c] mb-2">Why Clairity?</h3>
                <p className="text-sm text-[#2f3e3a] leading-relaxed">
                  We decode confusing recycling symbols and connect you with local rules so you can make the kindest choice for the planet.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6] text-[#1d5c4d] font-semibold">AI vision</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6] text-[#1d5c4d] font-semibold">Local guidance</span>
                  <span className="px-3 py-1 rounded-full bg-white border border-[#c7e6d6] text-[#1d5c4d] font-semibold">Clear answers</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
