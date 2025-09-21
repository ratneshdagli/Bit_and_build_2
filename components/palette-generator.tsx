"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Sparkles, Copy, Download, RefreshCw, Palette } from "lucide-react"

interface Color {
  hex: string
  rgb: string
  hsl: string
  role: string
  contrast?: string
}

interface PaletteData {
  id: string
  name: string
  colors: Color[]
  explanation?: string
}

interface PaletteGeneratorProps {
  onPaletteGenerated?: (palette: PaletteData) => void
  className?: string
}

const samplePalettes: PaletteData[] = [
  {
    id: "tropical",
    name: "Tropical Energy",
    explanation: "Vibrant and energetic palette inspired by tropical sunsets",
    colors: [
      { hex: "#FF6B6B", role: "Primary", rgb: "rgb(255, 107, 107)", hsl: "hsl(0, 100%, 71%)", contrast: "4.8:1" },
      { hex: "#4ECDC4", role: "Secondary", rgb: "rgb(78, 205, 196)", hsl: "hsl(176, 57%, 55%)", contrast: "7.2:1" },
      { hex: "#FFE66D", role: "Accent", rgb: "rgb(255, 230, 109)", hsl: "hsl(50, 100%, 71%)", contrast: "3.1:1" },
      { hex: "#F7FFF7", role: "Background", rgb: "rgb(247, 255, 247)", hsl: "hsl(120, 100%, 98%)", contrast: "19.2:1" },
      { hex: "#1A1A1A", role: "Surface", rgb: "rgb(26, 26, 26)", hsl: "hsl(0, 0%, 10%)", contrast: "15.8:1" },
    ],
  },
  {
    id: "ocean",
    name: "Ocean Depths",
    explanation: "Professional and trustworthy palette with deep blues",
    colors: [
      { hex: "#2E86AB", role: "Primary", rgb: "rgb(46, 134, 171)", hsl: "hsl(198, 58%, 43%)", contrast: "5.2:1" },
      { hex: "#A23B72", role: "Secondary", rgb: "rgb(162, 59, 114)", hsl: "hsl(328, 47%, 43%)", contrast: "6.1:1" },
      { hex: "#F18F01", role: "Accent", rgb: "rgb(241, 143, 1)", hsl: "hsl(36, 99%, 47%)", contrast: "4.5:1" },
      { hex: "#F8F9FA", role: "Background", rgb: "rgb(248, 249, 250)", hsl: "hsl(210, 17%, 98%)", contrast: "18.7:1" },
      { hex: "#212529", role: "Surface", rgb: "rgb(33, 37, 41)", hsl: "hsl(210, 11%, 15%)", contrast: "14.2:1" },
    ],
  },
]

export function PaletteGenerator({ onPaletteGenerated, className }: PaletteGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPalette, setCurrentPalette] = useState<PaletteData | null>(null)
  const [colorCount, setColorCount] = useState([5])
  const [includeRoles, setIncludeRoles] = useState(true)
  const [accessibilityCheck, setAccessibilityCheck] = useState(true)

  const generatePalette = useCallback(async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Simulate API call with realistic delay
    await new Promise((resolve) => setTimeout(resolve, 1200 + Math.random() * 800))

    // Return a sample palette (in real implementation, this would call the API)
    const palette = samplePalettes[Math.floor(Math.random() * samplePalettes.length)]
    const generatedPalette = {
      ...palette,
      id: `generated-${Date.now()}`,
      name: `Generated from: "${prompt.slice(0, 30)}${prompt.length > 30 ? "..." : ""}"`,
      explanation: `AI-generated palette based on your prompt: "${prompt}"`,
    }

    setCurrentPalette(generatedPalette)
    onPaletteGenerated?.(generatedPalette)
    setIsGenerating(false)
  }, [prompt, onPaletteGenerated])

  const regeneratePalette = useCallback(async () => {
    if (!prompt.trim()) return
    await generatePalette()
  }, [generatePalette, prompt])

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text)
  }, [])

  const copyAllColors = useCallback(() => {
    if (!currentPalette) return
    const colors = currentPalette.colors.map((c) => c.hex).join(", ")
    copyToClipboard(colors)
  }, [currentPalette, copyToClipboard])

  const downloadCSS = useCallback(() => {
    if (!currentPalette) return

    const css = currentPalette.colors.map((color) => `  --color-${color.role.toLowerCase()}: ${color.hex};`).join("\n")

    const cssContent = `:root {\n${css}\n}`
    const blob = new Blob([cssContent], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPalette.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-palette.css`
    a.click()
    URL.revokeObjectURL(url)
  }, [currentPalette])

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Palette Generator
          </CardTitle>
          <CardDescription>Generate beautiful, accessible color palettes using AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Describe your palette</label>
              <Input
                placeholder="e.g., Modern tech startup with blue accents"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && generatePalette()}
              />
            </div>

            {/* Advanced Options */}
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Number of colors</label>
                <div className="flex items-center space-x-3">
                  <Slider
                    value={colorCount}
                    onValueChange={setColorCount}
                    max={8}
                    min={3}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-8">{colorCount[0]}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="roles"
                    checked={includeRoles}
                    onChange={(e) => setIncludeRoles(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="roles" className="text-sm">
                    Include semantic roles
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="accessibility"
                    checked={accessibilityCheck}
                    onChange={(e) => setAccessibilityCheck(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="accessibility" className="text-sm">
                    Accessibility check
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex gap-2">
              <Button onClick={generatePalette} disabled={isGenerating || !prompt.trim()} className="flex-1">
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Palette
                  </>
                )}
              </Button>

              {currentPalette && (
                <Button onClick={regeneratePalette} disabled={isGenerating} variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Results Section */}
          {currentPalette && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{currentPalette.name}</h3>
                <div className="flex gap-2">
                  <Button onClick={copyAllColors} variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    Copy All
                  </Button>
                  <Button onClick={downloadCSS} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    CSS
                  </Button>
                </div>
              </div>

              {currentPalette.explanation && (
                <p className="text-sm text-muted-foreground">{currentPalette.explanation}</p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {currentPalette.colors.map((color, index) => (
                  <div key={index} className="text-center">
                    <div
                      className="w-full h-20 rounded-lg mb-2 shadow-sm border border-border/20 cursor-pointer hover:scale-105 transition-transform"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex)}
                      title={`Click to copy ${color.hex}`}
                    />
                    <p className="text-xs font-medium mb-1">{color.role}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center">
                        <code className="text-xs font-mono bg-muted px-1 rounded">{color.hex}</code>
                      </div>
                      {color.contrast && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            Number.parseFloat(color.contrast) >= 4.5
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }`}
                        >
                          {color.contrast}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
