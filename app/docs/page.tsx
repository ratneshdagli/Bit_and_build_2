"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Palette, Code, Book, Download, ExternalLink, Copy, Terminal, Lightbulb } from "lucide-react"
import Link from "next/link"

export default function DocsPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center space-x-2">
              <Book className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">ChromaGen Docs</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/demo">Try Demo</Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="#" className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Documentation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <a
                    href="#api-reference"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                  <a
                    href="#authentication"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Authentication
                  </a>
                  <a
                    href="#endpoints"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Endpoints
                  </a>
                  <a
                    href="#model-details"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Model Details
                  </a>
                  <a
                    href="#local-setup"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Local Setup
                  </a>
                  <a
                    href="#examples"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Examples
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                    <Link href="/demo">
                      <Palette className="h-4 w-4 mr-2" />
                      Try Demo
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="w-full justify-start bg-transparent">
                    <Link href="#">
                      <Download className="h-4 w-4 mr-2" />
                      Download SDK
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Introduction */}
            <section>
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-4 text-foreground">ChromaGen API Documentation</h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Generate beautiful, accessible color palettes using AI. Our API provides text-to-palette and
                  image-to-palette generation with built-in accessibility auditing.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Code className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">RESTful API</h3>
                    <p className="text-sm text-muted-foreground">Simple HTTP endpoints</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Lightbulb className="h-8 w-8 text-accent mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">AI-Powered</h3>
                    <p className="text-sm text-muted-foreground">Advanced color generation</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Palette className="h-8 w-8 text-chart-2 mx-auto mb-2" />
                    <h3 className="font-semibold mb-1">Accessible</h3>
                    <p className="text-sm text-muted-foreground">WCAG compliance built-in</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* API Reference */}
            <section id="api-reference">
              <h2 className="text-3xl font-bold mb-6 text-foreground">API Reference</h2>

              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Base URL</CardTitle>
                  <CardDescription>All API requests should be made to:</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm flex items-center justify-between">
                    <span>https://api.chromagen.dev</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("https://api.chromagen.dev", "base-url")}
                    >
                      {copiedEndpoint === "base-url" ? "Copied!" : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card id="authentication">
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    ChromaGen API uses API keys for authentication. Include your API key in the Authorization header.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded-lg font-mono text-sm mb-4">
                    Authorization: Bearer YOUR_API_KEY
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get your API key from the{" "}
                    <Link href="#" className="text-primary hover:underline">
                      developer dashboard
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Endpoints</h2>

              <div className="space-y-6">
                {/* Generate Endpoint */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        POST
                      </Badge>
                      <code className="text-lg font-mono">/api/generate</code>
                    </div>
                    <CardDescription>Generate a color palette from a text prompt or image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="request">
                      <TabsList>
                        <TabsTrigger value="request">Request</TabsTrigger>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="examples">Examples</TabsTrigger>
                      </TabsList>

                      <TabsContent value="request" className="mt-4">
                        <h4 className="font-semibold mb-2">Request Body</h4>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4">
                          {`{
  "prompt": "string",           // Text description of desired palette
  "image": "string",            // Base64 encoded image (optional)
  "options": {
    "count": 5,                 // Number of colors (3-8)
    "roles": true,              // Include semantic roles
    "accessibility_check": true, // Run WCAG compliance check
    "format": "hex"             // Output format: hex, rgb, hsl
  }
}`}
                        </pre>

                        <h4 className="font-semibold mb-2">Parameters</h4>
                        <div className="space-y-2">
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">
                              prompt
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">string</p>
                              <p className="text-sm text-muted-foreground">
                                Natural language description of the desired color palette
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">
                              image
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">string (optional)</p>
                              <p className="text-sm text-muted-foreground">
                                Base64 encoded image to extract colors from
                              </p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Badge variant="outline" className="mt-0.5">
                              options
                            </Badge>
                            <div>
                              <p className="text-sm font-medium">object (optional)</p>
                              <p className="text-sm text-muted-foreground">
                                Configuration options for palette generation
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="response" className="mt-4">
                        <h4 className="font-semibold mb-2">Response Format</h4>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          {`{
  "success": true,
  "palette": [
    {
      "hex": "#FF6B6B",
      "rgb": "rgb(255, 107, 107)",
      "hsl": "hsl(0, 100%, 71%)",
      "role": "primary",
      "contrast_ratio": "4.8:1",
      "wcag_aa": true,
      "wcag_aaa": false
    },
    {
      "hex": "#4ECDC4",
      "rgb": "rgb(78, 205, 196)",
      "hsl": "hsl(176, 57%, 55%)",
      "role": "secondary",
      "contrast_ratio": "7.2:1",
      "wcag_aa": true,
      "wcag_aaa": true
    }
  ],
  "metadata": {
    "prompt": "energetic fitness brand colors",
    "generation_time": 1.2,
    "model_version": "v2.1"
  },
  "accessibility": {
    "overall_score": "AA",
    "recommendations": [
      "Consider darkening accent color for better readability"
    ]
  }
}`}
                        </pre>
                      </TabsContent>

                      <TabsContent value="examples" className="mt-4">
                        <h4 className="font-semibold mb-2">cURL Example</h4>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4">
                          {`curl -X POST https://api.chromagen.dev/api/generate \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "prompt": "modern tech startup with blue accents",
    "options": {
      "count": 5,
      "roles": true,
      "accessibility_check": true
    }
  }'`}
                        </pre>

                        <h4 className="font-semibold mb-2">JavaScript Example</h4>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          {`const response = await fetch('https://api.chromagen.dev/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    prompt: 'warm coffee shop atmosphere',
    options: {
      count: 4,
      roles: true,
      accessibility_check: true
    }
  })
});

const data = await response.json();
console.log(data.palette);`}
                        </pre>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                {/* Audit Endpoint */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="bg-blue-100 text-blue-800">
                        POST
                      </Badge>
                      <code className="text-lg font-mono">/api/audit</code>
                    </div>
                    <CardDescription>Audit an existing color palette for accessibility compliance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-semibold mb-2">Request Body</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto mb-4">
                      {`{
  "colors": [
    "#FF6B6B",
    "#4ECDC4",
    "#FFE66D"
  ],
  "background": "#FFFFFF"  // Optional background color for contrast checking
}`}
                    </pre>

                    <h4 className="font-semibold mb-2">Response</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`{
  "success": true,
  "audit_results": [
    {
      "color": "#FF6B6B",
      "contrast_ratio": "4.8:1",
      "wcag_aa": true,
      "wcag_aaa": false,
      "recommendations": "Suitable for large text"
    }
  ],
  "overall_score": "AA",
  "color_blind_safe": true
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Model Details */}
            <section id="model-details">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Model Details</h2>

              <Card>
                <CardHeader>
                  <CardTitle>How ChromaGen Works</CardTitle>
                  <CardDescription>Understanding the AI model behind color palette generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Architecture</h4>
                    <p className="text-muted-foreground mb-4">
                      ChromaGen uses a fine-tuned transformer model trained on millions of color combinations from
                      professional design work, art history, and natural imagery. The model understands color theory,
                      harmony principles, and accessibility requirements.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Training Data</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Professional design portfolios and brand guidelines</li>
                      <li>Art museum collections and color theory references</li>
                      <li>Natural imagery and photography datasets</li>
                      <li>Accessibility-compliant color combinations</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Technical Stack</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-1">Model</h5>
                        <p className="text-sm text-muted-foreground">PyTorch-based transformer</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Backend</h5>
                        <p className="text-sm text-muted-foreground">FastAPI with Redis caching</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Image Processing</h5>
                        <p className="text-sm text-muted-foreground">OpenCV and PIL</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-1">Database</h5>
                        <p className="text-sm text-muted-foreground">PostgreSQL</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Local Setup */}
            <section id="local-setup">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Local Development</h2>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="h-5 w-5" />
                    Running ChromaGen Locally
                  </CardTitle>
                  <CardDescription>Set up ChromaGen for local development and testing</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="installation">
                    <TabsList>
                      <TabsTrigger value="installation">Installation</TabsTrigger>
                      <TabsTrigger value="configuration">Configuration</TabsTrigger>
                      <TabsTrigger value="usage">Usage</TabsTrigger>
                    </TabsList>

                    <TabsContent value="installation" className="mt-4">
                      <h4 className="font-semibold mb-2">Prerequisites</h4>
                      <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-1">
                        <li>Python 3.8+</li>
                        <li>Node.js 16+</li>
                        <li>PostgreSQL 12+</li>
                        <li>Redis (optional, for caching)</li>
                      </ul>

                      <h4 className="font-semibold mb-2">Clone and Install</h4>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`# Clone the repository
git clone https://github.com/chromagen/chromagen.git
cd chromagen

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install

# Set up the database
python manage.py migrate

# Start the development server
npm run dev`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="configuration" className="mt-4">
                      <h4 className="font-semibold mb-2">Environment Variables</h4>
                      <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                        {`# .env file
DATABASE_URL=postgresql://user:password@localhost:5432/chromagen
REDIS_URL=redis://localhost:6379
MODEL_PATH=./models/chromagen-v2.1.pt
API_SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-key  # Optional, for enhanced prompts`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="usage" className="mt-4">
                      <h4 className="font-semibold mb-2">Development Commands</h4>
                      <div className="space-y-3">
                        <div>
                          <code className="bg-muted px-2 py-1 rounded text-sm">npm run dev</code>
                          <p className="text-sm text-muted-foreground mt-1">Start development server</p>
                        </div>
                        <div>
                          <code className="bg-muted px-2 py-1 rounded text-sm">npm run test</code>
                          <p className="text-sm text-muted-foreground mt-1">Run test suite</p>
                        </div>
                        <div>
                          <code className="bg-muted px-2 py-1 rounded text-sm">python train.py</code>
                          <p className="text-sm text-muted-foreground mt-1">Train model with new data</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </section>

            {/* Examples */}
            <section id="examples">
              <h2 className="text-3xl font-bold mb-6 text-foreground">Code Examples</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>React Integration</CardTitle>
                    <CardDescription>Using ChromaGen in a React application</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`import { useState } from 'react';

function PaletteGenerator() {
  const [palette, setPalette] = useState([]);
  
  const generatePalette = async (prompt) => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    
    const data = await response.json();
    setPalette(data.palette);
  };
  
  return (
    <div>
      {palette.map(color => (
        <div 
          key={color.hex}
          style={{ backgroundColor: color.hex }}
          className="w-20 h-20"
        />
      ))}
    </div>
  );
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Python SDK</CardTitle>
                    <CardDescription>Using the ChromaGen Python library</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      {`from chromagen import ChromaGen

# Initialize client
client = ChromaGen(api_key="your-api-key")

# Generate palette
palette = client.generate(
    prompt="modern tech startup",
    count=5,
    accessibility_check=True
)

# Print colors
for color in palette.colors:
    print(f"{color.role}: {color.hex}")
    print(f"Contrast: {color.contrast_ratio}")
    
# Export as CSS
css = palette.to_css()
print(css)`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Footer */}
            <section className="border-t border-border pt-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground">
                    Check out our{" "}
                    <Link href="#" className="text-primary hover:underline">
                      GitHub repository
                    </Link>{" "}
                    or join our{" "}
                    <Link href="#" className="text-primary hover:underline">
                      Discord community
                    </Link>
                    .
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">v2.1</Badge>
                  <Badge variant="outline">MIT License</Badge>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
