"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Palette, Eye, Download, Copy, Github, ExternalLink, Zap, Shield, Sparkles, Code } from "lucide-react"
import Link from "next/link"
import { SkipToContent } from "@/components/skip-to-content"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { HeroBackground, getHeroForeground } from '@/components/ui/hero-background';

// Sample palettes for demo (add paletteName for type compatibility)
function parseRgb(str: string): [number, number, number] {
	const m = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
	if (!m) return [0,0,0];
	return [parseInt(m[1]), parseInt(m[2]), parseInt(m[3])];
}
const samplePalettes = [
	{
		paletteName: "Tropical Sunset",
		name: "Tropical Sunset",
		colors: [
			{ hex: "#FF6B6B", role: "Primary", rgb: parseRgb("rgb(255, 107, 107)"), hsl: "hsl(0, 100%, 71%)", description: "" },
			{ hex: "#4ECDC4", role: "Secondary", rgb: parseRgb("rgb(78, 205, 196)"), hsl: "hsl(176, 57%, 55%)", description: "" },
			{ hex: "#FFE66D", role: "Accent", rgb: parseRgb("rgb(255, 230, 109)"), hsl: "hsl(50, 100%, 71%)", description: "" },
			{ hex: "#F7FFF7", role: "Background", rgb: parseRgb("rgb(247, 255, 247)"), hsl: "hsl(120, 100%, 98%)", description: "" },
			{ hex: "#1A1A1A", role: "Surface", rgb: parseRgb("rgb(26, 26, 26)"), hsl: "hsl(0, 0%, 10%)", description: "" },
		],
	},
	{
		paletteName: "Ocean Depths",
		name: "Ocean Depths",
		colors: [
			{ hex: "#2E86AB", role: "Primary", rgb: parseRgb("rgb(46, 134, 171)"), hsl: "hsl(198, 58%, 43%)", description: "" },
			{ hex: "#A23B72", role: "Secondary", rgb: parseRgb("rgb(162, 59, 114)"), hsl: "hsl(328, 47%, 43%)", description: "" },
			{ hex: "#F18F01", role: "Accent", rgb: parseRgb("rgb(241, 143, 1)"), hsl: "hsl(36, 99%, 47%)", description: "" },
			{ hex: "#F8F9FA", role: "Background", rgb: parseRgb("rgb(248, 249, 250)"), hsl: "hsl(210, 17%, 98%)", description: "" },
			{ hex: "#212529", role: "Surface", rgb: parseRgb("rgb(33, 37, 41)"), hsl: "hsl(210, 11%, 15%)", description: "" },
		],
	},
];

export default function HomePage() {
	const [currentPalette, setCurrentPalette] = useState(0)
	const [prompt, setPrompt] = useState("")
	const [isGenerating, setIsGenerating] = useState(false)
	const [showResult, setShowResult] = useState(false)

	const handleGenerate = async () => {
		setIsGenerating(true)
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1200))
		setIsGenerating(false)
		setShowResult(true)
	}

	const copyToClipboard = (text: string) => {
		navigator.clipboard.writeText(text)
	}

	const downloadCSS = () => {
		const palette = samplePalettes[currentPalette]
		const css = palette.colors.map((color) => `  --cg-${color.role.toLowerCase()}: ${color.hex};`).join("\n")

		const cssContent = `:root {\n${css}\n}`
		const blob = new Blob([cssContent], { type: "text/css" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = `${palette.name.toLowerCase().replace(" ", "-")}-palette.css`
		a.click()
	}

	const heroForeground = getHeroForeground(samplePalettes[currentPalette]);

	return (
		<div className="min-h-screen bg-background relative overflow-x-hidden">
			<HeroBackground palette={samplePalettes[currentPalette]} />
			<SkipToContent />

			{/* Navigation */}
			<header className="border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
				<div className="container mx-auto px-4 lg:px-6 py-4 flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
							<Palette className="h-6 w-6 text-primary" aria-hidden="true" />
						</div>
						<span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ChromaGen</span>
					</div>
					<nav className="hidden md:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
						<Link href="/demo" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">
							Demo
						</Link>
						<Link href="/docs" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">
							Docs
						</Link>
						<Link href="#team" className="text-muted-foreground hover:text-foreground transition-all duration-200 font-medium hover:scale-105">
							Team
						</Link>
						<Link
							href="#"
							className="text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-105"
							aria-label="GitHub repository"
						>
							<Github className="h-5 w-5" aria-hidden="true" />
						</Link>
						<DarkModeToggle />
					</nav>
					<Button asChild size="sm" className="shadow-lg">
						<Link href="/demo">Try Demo</Link>
					</Button>
				</div>
			</header>

			<main id="main-content">
				{/* Hero Section */}
				<section className="py-24 lg:py-32 px-4" aria-labelledby="hero-heading">
					<div className="container mx-auto text-center max-w-5xl">
						<div className="mb-4">
							<Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium shadow-sm animate-fade-in">
								<Sparkles className="h-4 w-4 mr-1" aria-hidden="true" />
								ChromaGen for Designers
							</Badge>
						</div>
						<h1
							id="hero-heading"
													className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance mb-8 text-foreground leading-tight animate-slide-up"
						>
							ChromaGen — AI-Powered Generative Palettes for Designers
						</h1>
						<p className="text-xl lg:text-2xl text-muted-foreground text-balance mb-12 leading-relaxed max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
							Generate creative color palettes from text or images — with built-in WCAG accessibility auditing and
							color-blindness previews.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
							<Button size="lg" asChild className="text-lg px-8 shadow-xl">
								<Link href="/demo">Try Demo</Link>
							</Button>
							<Button size="lg" variant="outline" asChild className="text-lg px-8 glass shadow-lg">
								<Link href="#" className="flex items-center gap-2">
									<Github className="h-5 w-5" aria-hidden="true" />
									View GitHub
								</Link>
							</Button>
						</div>

						{/* Animated Palette Preview */}
						<div
							className="glass border border-border/50 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl animate-scale-in"
							style={{ animationDelay: '0.3s' }}
							role="img"
							aria-label="Sample color palette preview"
						>
							<div className="flex justify-center space-x-3 mb-6">
								{samplePalettes[currentPalette].colors.map((color, index) => (
									<div
										key={index}
										className="w-20 h-20 rounded-xl shadow-lg animate-fade-in color-swatch border border-white/20"
										style={{ backgroundColor: color.hex, animationDelay: `${index * 60}ms` }}
										aria-label={`${color.role} color: ${color.hex}`}
									/>
								))}
							</div>
							<p className="text-base text-muted-foreground font-medium">
								Generates 5-color palettes, exports CSS variables, and checks WCAG contrast.
							</p>
						</div>
					</div>
				</section>

				{/* Problem → Solution */}
				<section className="py-16 px-4 bg-muted/30" aria-labelledby="problem-solution-heading">
					<div className="container mx-auto max-w-6xl">
						<h2 id="problem-solution-heading" className="sr-only">
							Problem and Solution
						</h2>
						<div className="grid md:grid-cols-2 gap-12">
							<div>
								<h3 className="text-3xl font-bold mb-6 text-foreground">Why designers need ChromaGen</h3>
								<p className="text-lg text-muted-foreground leading-relaxed">
									Designers waste hours crafting palettes that look good but break accessibility rules. Existing tools
									either lack creativity or fail accessibility checks. ChromaGen builds on generative AI to produce
									palettes that are aesthetic, usable, and compliant out-of-the-box.
								</p>
							</div>
							<div>
								<h3 className="text-3xl font-bold mb-6 text-foreground">How ChromaGen solves it</h3>
								<p className="text-lg text-muted-foreground leading-relaxed">
									Multi-modal generator: accepts natural language prompts or images, outputs harmonized palettes
									(primary/secondary/accent), runs automatic WCAG contrast checks, and previews color-blindness
									simulations.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Key Features */}
				<section className="py-16 px-4" aria-labelledby="features-heading">
					<div className="container mx-auto max-w-6xl">
						<h2 id="features-heading" className="text-3xl font-bold text-center mb-12 text-foreground">
							Key Features
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
							<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="listitem">
								<CardHeader>
									<Zap className="h-8 w-8 text-primary mb-2" aria-hidden="true" />
									<CardTitle>Multi-Modal Prompting</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Type a natural language prompt or upload an image to seed the palette.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="listitem">
								<CardHeader>
									<Sparkles className="h-8 w-8 text-accent mb-2" aria-hidden="true" />
									<CardTitle>Generative Color Engine</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										AI creates coherent 5-color palettes and suggests roles (primary, secondary, accent).
									</CardDescription>
								</CardContent>
							</Card>

							<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="listitem">
								<CardHeader>
									<Shield className="h-8 w-8 text-chart-2 mb-2" aria-hidden="true" />
									<CardTitle>Accessibility Auditor</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>
										Automatic WCAG AA/AAA pass/fail per text/background pair + suggestions to adjust colors.
									</CardDescription>
								</CardContent>
							</Card>

							<Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1" role="listitem">
								<CardHeader>
									<Code className="h-8 w-8 text-chart-4 mb-2" aria-hidden="true" />
									<CardTitle>Export & Integrations</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>Copy HEX/RGB/HSL, download CSS variables, and call our API.</CardDescription>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="py-16 px-4 bg-muted/30">
					<div className="container mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">How It Works</h2>
						<div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-4">
							{[
								{ icon: Upload, title: "Prompt or Image", desc: "Input text or upload image" },
								{ icon: Zap, title: "AI Generator", desc: "Process with AI model" },
								{ icon: Palette, title: "Palette + Roles", desc: "Generate 5-color palette" },
								{ icon: Eye, title: "Accessibility Audit", desc: "Check WCAG compliance" },
								{ icon: Download, title: "Export/Use", desc: "Download CSS or JSON" },
							].map((step, index) => (
								<div key={index} className="flex flex-col items-center text-center group">
									<div className="bg-primary/10 p-4 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
										<step.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="font-semibold mb-2">{step.title}</h3>
									<p className="text-sm text-muted-foreground">{step.desc}</p>
									{index < 4 && (
										<div className="hidden md:block absolute right-0 top-1/2 transform translate-x-8 -translate-y-1/2">
											<div className="w-8 h-0.5 bg-border"></div>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Interactive Demo Preview */}
				<section className="py-16 px-4" aria-labelledby="demo-heading">
					<div className="container mx-auto max-w-4xl">
						<h2 id="demo-heading" className="text-3xl font-bold text-center mb-12 text-foreground">
							Try a quick example
						</h2>
						<Card className="p-6">
							<div className="space-y-6">
								<div className="flex flex-col sm:flex-row gap-4">
									<label htmlFor="palette-prompt" className="sr-only">
										Describe your desired color palette
									</label>
									<Input
										id="palette-prompt"
										placeholder="An energetic palette for a fitness brand inspired by a tropical sunset"
										value={prompt}
										onChange={(e) => setPrompt(e.target.value)}
										className="flex-1"
										aria-describedby="prompt-help"
									/>
									<p id="prompt-help" className="sr-only">
										Enter a description of the color palette you want to generate
									</p>

									<Button
										variant="outline"
										className="flex items-center gap-2 bg-transparent"
										aria-label="Upload image to generate palette from"
									>
										<Upload className="h-4 w-4" aria-hidden="true" />
										Upload Image
									</Button>
									<Button
										onClick={handleGenerate}
										disabled={isGenerating}
										className="flex items-center gap-2"
										aria-describedby={isGenerating ? "generating-status" : undefined}
									>
										{isGenerating ? (
											<>
												<div
													className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"
													aria-hidden="true"
												></div>
												<span id="generating-status">Generating...</span>
											</>
										) : (
											<>
												<Sparkles className="h-4 w-4" aria-hidden="true" />
												Generate
											</>
										)}
									</Button>
								</div>

								{showResult && (
									<div className="animate-fade-in" role="region" aria-label="Generated color palette results">
										<div className="grid grid-cols-5 gap-4 mb-6">
											{samplePalettes[0].colors.map((color, index) => (
												<div key={index} className="text-center">
													<div
														className="w-full h-20 rounded-lg mb-2 shadow-sm"
														style={{ backgroundColor: color.hex }}
														role="img"
														aria-label={`${color.role} color: ${color.hex}`}
													/>
													<p className="text-sm font-medium mb-1">{color.role}</p>
													<div className="space-y-1">
														<div className="flex items-center justify-between text-xs">
															<span className="font-mono">{color.hex}</span>
															<Button
																size="sm"
																variant="ghost"
																onClick={() => copyToClipboard(color.hex)}
																className="h-6 w-6 p-0"
																aria-label={`Copy ${color.hex} to clipboard`}
															>
																<Copy className="h-3 w-3" aria-hidden="true" />
															</Button>
														</div>
													</div>
												</div>
											))}
										</div>

										<div
											className="bg-muted/50 rounded-lg p-4 mb-4"
											role="region"
											aria-labelledby="accessibility-results"
										>
											<h4 id="accessibility-results" className="font-semibold mb-2">
												Accessibility Check
											</h4>
											<div className="flex flex-wrap gap-2" role="list">
												<Badge variant="secondary" className="bg-green-100 text-green-800" role="listitem">
													4.8:1 — AA (pass)
												</Badge>
												<Badge variant="secondary" className="bg-green-100 text-green-800" role="listitem">
													7.2:1 — AAA (pass)
												</Badge>
												<Badge variant="secondary" className="bg-yellow-100 text-yellow-800" role="listitem">
													3.1:1 — AA (fail)
												</Badge>
											</div>
										</div>

										<div className="flex flex-wrap gap-2" role="group" aria-label="Export options">
											<Button
												onClick={downloadCSS}
												variant="outline"
												className="flex items-center gap-2 bg-transparent"
											>
												<Download className="h-4 w-4" aria-hidden="true" />
												Download CSS
											</Button>
											<Button variant="outline" className="flex items-center gap-2 bg-transparent">
												<Copy className="h-4 w-4" aria-hidden="true" />
												Copy JSON
											</Button>
											<Button variant="outline" className="flex items-center gap-2 bg-transparent">
												<Copy className="h-4 w-4" aria-hidden="true" />
												Copy HEXs
											</Button>
										</div>
									</div>
								)}
							</div>
						</Card>
					</div>
				</section>

				{/* Technology Stack */}
				<section className="py-16 px-4 bg-muted/30">
					<div className="container mx-auto max-w-6xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">Technology / How we built it</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[
								{ title: "Model", desc: "Fine-tuned diffusion/GPT-style color model" },
								{ title: "Accessibility", desc: "WCAG 2.1 checks" },
								{ title: "Image Processing", desc: "OpenCV" },
								{ title: "API", desc: "FastAPI" },
								{ title: "Frontend", desc: "React + Tailwind" },
								{ title: "Database", desc: "PostgreSQL" },
							].map((tech, index) => (
								<Card key={index} className="text-center">
									<CardHeader>
										<CardTitle className="text-lg">{tech.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription>{tech.desc}</CardDescription>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>

				{/* Judging Alignment */}
				<section className="py-16 px-4">
					<div className="container mx-auto max-w-4xl">
						<h2 className="text-3xl font-bold text-center mb-12 text-foreground">Built to win the hackathon</h2>
						<div className="space-y-6">
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
										Creativity
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Generative, multi-modal palette outputs + unique educational accessibility suggestions.</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Code className="h-5 w-5 text-accent" aria-hidden="true" />
										Technical Complexity
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>
										Model fine-tuning, image embedding → color extraction, on-the-fly WCAG computations, color-blind
										simulation.
									</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Zap className="h-5 w-5 text-chart-2" aria-hidden="true" />
										Practicality
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Instant exports, CSS variables, designer-friendly outputs, minimal integration friction (API).</p>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Eye className="h-5 w-5 text-chart-4" aria-hidden="true" />
										Presentation
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p>Interactive demo, clear visuals, explicit accessibility features and export formats.</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</section>

				{/* Rules & Compliance */}
				<section className="py-16 px-4 bg-muted/30">
					<div className="container mx-auto max-w-4xl">
						<h2 className="text-3xl font-bold text-center mb-8 text-foreground">Rules & Compliance</h2>
						<Card className="border-primary/20">
							<CardContent className="p-6">
								<div className="space-y-4">
									<p className="text-foreground">
										<strong>Hackathon rules compliance:</strong> This prototype is built during the hackathon. No
										pre-packaged full app used. All code will be pushed to the provided repository during the event.
										3rd-party libraries used are open-source; any external assets have CC license or were created during
										the hackathon.
									</p>
									<Button variant="outline" asChild>
										<Link href="#" className="flex items-center gap-2">
											<ExternalLink className="h-4 w-4" aria-hidden="true" />
											View repository
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				</section>

				{/* Team */}
				<section id="team" className="py-16 px-4" aria-labelledby="team-heading">
					<div className="container mx-auto max-w-6xl">
						<h2 id="team-heading" className="text-3xl font-bold text-center mb-12 text-foreground">
							Team
						</h2>
						<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
							{[
								{
									name: "Alex Chen",
									role: "ML Engineer",
									responsibilities: ["Model fine-tuning", "Color generation algorithms", "API development"],
									avatar: "/placeholder.svg?key=nz1m4",
								},
								{
									name: "Sarah Kim",
									role: "Frontend Developer",
									responsibilities: ["React components", "UI/UX design", "Accessibility implementation"],
									avatar: "/placeholder.svg?key=kf0e0",
								},
								{
									name: "Marcus Johnson",
									role: "UX Designer",
									responsibilities: ["User research", "Design system", "Accessibility auditing"],
									avatar: "/placeholder.svg?key=f9iyk",
								},
							].map((member, index) => (
								<Card key={index} className="text-center hover:shadow-lg transition-all duration-300" role="listitem">
									<CardHeader>
										<div className="w-24 h-24 rounded-full bg-muted mx-auto mb-4 overflow-hidden">
											<img
												src={member.avatar || "/placeholder.svg"}
												alt={`${member.name}, ${member.role}`}
												className="w-full h-full object-cover"
											/>
										</div>
										<CardTitle>{member.name}</CardTitle>
										<CardDescription className="text-primary font-medium">{member.role}</CardDescription>
									</CardHeader>
									<CardContent>
										<ul className="text-sm text-muted-foreground space-y-1" role="list">
											{member.responsibilities.map((resp, i) => (
												<li key={i} role="listitem">
													• {resp}
												</li>
											))}
										</ul>
										<div
											className="flex justify-center space-x-2 mt-4"
											role="group"
											aria-label={`${member.name}'s social links`}
										>
											<Button size="sm" variant="ghost" aria-label={`${member.name}'s GitHub profile`}>
												<Github className="h-4 w-4" aria-hidden="true" />
											</Button>
											<Button size="sm" variant="ghost" aria-label={`${member.name}'s LinkedIn profile`}>
												<ExternalLink className="h-4 w-4" aria-hidden="true" />
											</Button>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-border bg-muted/30 py-12 px-4" role="contentinfo">
				<div className="container mx-auto max-w-6xl">
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-lg font-semibold mb-4">Get in touch</h3>
							<form className="space-y-4" aria-label="Contact form">
								<label htmlFor="contact-name" className="sr-only">
									Name
								</label>
								<Input id="contact-name" placeholder="Name" />

								<label htmlFor="contact-email" className="sr-only">
									Email
								</label>
								<Input id="contact-email" placeholder="Email" type="email" />

								<label htmlFor="contact-message" className="sr-only">
									Message
								</label>
								<textarea
									id="contact-message"
									className="w-full p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground"
									placeholder="Short message"
									rows={3}
								/>
								<Button type="submit">Send Message</Button>
							</form>
						</div>
						<div>
							<div className="flex items-center space-x-2 mb-6">
								<Palette className="h-6 w-6 text-primary" aria-hidden="true" />
								<span className="text-xl font-bold">ChromaGen</span>
							</div>
							<nav className="space-y-2 text-sm text-muted-foreground" role="navigation" aria-label="Footer navigation">
								<Link href="#" className="block hover:text-foreground transition-colors">
									GitHub Repository
								</Link>
								<Link href="/demo" className="block hover:text-foreground transition-colors">
									Demo
								</Link>
								<Link href="/docs" className="block hover:text-foreground transition-colors">
									Docs
								</Link>
								<p>License: MIT</p>
							</nav>
							<div className="mt-6 pt-6 border-t border-border text-xs text-muted-foreground">
								<p>&copy; 2024 ChromaGen Team. Built for hackathon submission.</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
