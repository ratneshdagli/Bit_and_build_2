"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, EyeOff, Lightbulb, AlertTriangle } from "lucide-react"

interface Color {
  hex: string
  role: string
  contrast?: string
}

interface AccessibilityCheckerProps {
  colors: Color[]
  className?: string
}

const colorBlindnessTypes = [
  { value: "normal", label: "Normal Vision", filter: "none" },
  { value: "protanopia", label: "Protanopia (Red-blind)", filter: "sepia(100%) saturate(0%) hue-rotate(0deg)" },
  { value: "deuteranopia", label: "Deuteranopia (Green-blind)", filter: "sepia(100%) saturate(0%) hue-rotate(90deg)" },
  { value: "tritanopia", label: "Tritanopia (Blue-blind)", filter: "sepia(100%) saturate(0%) hue-rotate(180deg)" },
]

// Utility function to calculate contrast ratio
function getContrastRatio(color1: string, color2: string): number {
  // Simplified contrast calculation - in real implementation, use proper color space conversion
  const hex1 = color1.replace("#", "")
  const hex2 = color2.replace("#", "")

  const r1 = Number.parseInt(hex1.substr(0, 2), 16)
  const g1 = Number.parseInt(hex1.substr(2, 2), 16)
  const b1 = Number.parseInt(hex1.substr(4, 2), 16)

  const r2 = Number.parseInt(hex2.substr(0, 2), 16)
  const g2 = Number.parseInt(hex2.substr(2, 2), 16)
  const b2 = Number.parseInt(hex2.substr(4, 2), 16)

  const l1 = 0.2126 * (r1 / 255) + 0.7152 * (g1 / 255) + 0.0722 * (b1 / 255)
  const l2 = 0.2126 * (r2 / 255) + 0.7152 * (g2 / 255) + 0.0722 * (b2 / 255)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

export function AccessibilityChecker({ colors, className }: AccessibilityCheckerProps) {
  const [colorBlindness, setColorBlindness] = useState("normal")
  const [showSimulation, setShowSimulation] = useState(false)
  const [contrastResults, setContrastResults] = useState<
    Array<{
      foreground: string
      background: string
      ratio: number
      wcagAA: boolean
      wcagAAA: boolean
    }>
  >([])

  useEffect(() => {
    // Calculate contrast ratios between colors
    const results = []
    const backgroundColors = colors.filter(
      (c) => c.role.toLowerCase().includes("background") || c.role.toLowerCase().includes("surface"),
    )
    const foregroundColors = colors.filter(
      (c) => !c.role.toLowerCase().includes("background") && !c.role.toLowerCase().includes("surface"),
    )

    if (backgroundColors.length === 0 || foregroundColors.length === 0) return

    for (const bg of backgroundColors) {
      for (const fg of foregroundColors) {
        const ratio = getContrastRatio(fg.hex, bg.hex)
        results.push({
          foreground: fg.hex,
          background: bg.hex,
          ratio,
          wcagAA: ratio >= 4.5,
          wcagAAA: ratio >= 7,
        })
      }
    }

    setContrastResults(results)
  }, [colors])

  const currentFilter = colorBlindnessTypes.find((t) => t.value === colorBlindness)?.filter || "none"
  const overallScore =
    contrastResults.length > 0
      ? contrastResults.every((r) => r.wcagAAA)
        ? "AAA"
        : contrastResults.every((r) => r.wcagAA)
          ? "AA"
          : "Fail"
      : "N/A"

  const recommendations = [
    ...(contrastResults.some((r) => !r.wcagAA) ? ["Some color combinations fail WCAG AA standards"] : []),
    ...(contrastResults.some((r) => r.wcagAA && !r.wcagAAA) ? ["Consider increasing contrast for AAA compliance"] : []),
    ...(contrastResults.every((r) => r.wcagAAA) ? ["Excellent! All combinations meet AAA standards"] : []),
  ]

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-chart-2" />
            Accessibility Analysis
          </CardTitle>
          <CardDescription>WCAG compliance check and color-blindness simulation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold">Overall WCAG Score</h4>
              <p className="text-sm text-muted-foreground">Based on contrast ratios</p>
            </div>
            <Badge
              variant={overallScore === "AAA" ? "default" : overallScore === "AA" ? "secondary" : "destructive"}
              className={`text-lg px-3 py-1 ${
                overallScore === "AAA"
                  ? "bg-green-100 text-green-800"
                  : overallScore === "AA"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {overallScore}
            </Badge>
          </div>

          {/* Contrast Results */}
          {contrastResults.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Contrast Ratios</h4>
              <div className="space-y-2">
                {contrastResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded border border-border/20"
                          style={{ backgroundColor: result.foreground }}
                        />
                        <span className="text-sm">on</span>
                        <div
                          className="w-4 h-4 rounded border border-border/20"
                          style={{ backgroundColor: result.background }}
                        />
                      </div>
                      <span className="text-sm font-mono">{result.ratio.toFixed(1)}:1</span>
                    </div>
                    <div className="flex gap-1">
                      <Badge
                        variant={result.wcagAA ? "default" : "destructive"}
                        className={`text-xs ${result.wcagAA ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        AA {result.wcagAA ? "✓" : "✗"}
                      </Badge>
                      <Badge
                        variant={result.wcagAAA ? "default" : "secondary"}
                        className={`text-xs ${result.wcagAAA ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                      >
                        AAA {result.wcagAAA ? "✓" : "✗"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Color Blindness Simulation */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Color Vision Simulation</h4>
              <Button variant="outline" size="sm" onClick={() => setShowSimulation(!showSimulation)}>
                {showSimulation ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showSimulation ? "Hide" : "Show"} Simulation
              </Button>
            </div>

            {showSimulation && (
              <div className="space-y-4">
                <Select value={colorBlindness} onValueChange={setColorBlindness}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colorBlindnessTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-5 gap-2 p-4 bg-muted/20 rounded-lg" style={{ filter: currentFilter }}>
                  {colors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-full h-12 rounded border border-border/20"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-xs mt-1">{color.role}</p>
                    </div>
                  ))}
                </div>

                {colorBlindness !== "normal" && (
                  <p className="text-xs text-muted-foreground">
                    This simulation shows how your palette appears to users with{" "}
                    {colorBlindnessTypes.find((t) => t.value === colorBlindness)?.label.toLowerCase()}.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Recommendations
              </h4>
              <div className="space-y-2">
                {recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p>{rec}</p>
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
