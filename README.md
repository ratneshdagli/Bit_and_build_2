# ChromaGen - AI-Powered Color Palette Generator

ChromaGen is a Next.js application that generates beautiful color palettes using AI. It combines the power of Google's Gemini AI with accessibility features to create harmonious color schemes for designers and developers.

## Features

- **Multi-modal Generation**: Generate palettes from text prompts, images, or both
- **AI-Powered**: Uses Groq API with Llama 3.1 8B Instant model for intelligent color palette generation
- **Palette Lock & Reroll**: Lock favorite colors and regenerate only unlocked ones
- **Tints & Shades Ladder**: Generate 5-10 lighter/darker variations of any color
- **Contrast Matrix**: Visual grid showing WCAG contrast ratios for all color pairs
- **Auto-Fix Contrast**: One-click button to automatically adjust colors for better accessibility
- **Comprehensive Export**: CSS variables, Tailwind config, JSON, SCSS, Design Tokens
- **Shareable Links**: Generate URLs to share palettes with others
- **Accessibility First**: Built-in WCAG contrast checking and color blindness simulation
- **Modern UI**: Built with Next.js, Tailwind CSS, and Radix UI components

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Groq API key (get from [console.groq.com](https://console.groq.com/keys))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chromaen-frontent
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/keys)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Text Prompts
Enter descriptive text like "A calming palette for a yoga studio website" to generate themed color palettes.

### Image Upload
Upload an image (PNG, JPG, WEBP) to extract colors and create a palette based on the image.

### Combined Mode
Use both text and image together for more precise palette generation.

### Advanced Features

#### Palette Lock & Reroll
- Click the lock icon on any color swatch to lock it
- Use the "Reroll" button to regenerate only unlocked colors
- Perfect for iterating on specific colors while keeping favorites

#### Tints & Shades
- Click "Tints & Shades" on any color to see lighter and darker variations
- Generate 5-10 steps of each color for comprehensive color scales
- Copy individual variations or use them in your designs

#### Contrast Matrix
- View a visual grid showing WCAG contrast ratios between all color pairs
- See which combinations pass AA (4.5:1) and AAA (7:1) standards
- Click the ✕ button on failing combinations to auto-fix contrast

#### Export Options
- **CSS Variables**: Ready-to-use CSS custom properties
- **Tailwind Config**: Drop-in Tailwind CSS configuration
- **JSON**: Structured data format for developers
- **SCSS Variables**: SCSS variables for Sass projects
- **Design Tokens**: Standard design token format

#### Shareable Links
- Generate URLs to share palettes with team members or clients
- Links include all color information and can be opened directly in ChromaGen
- Use the native share API on mobile devices

## Project Structure

```
chromaen-frontent/
├── app/                    # Next.js app directory
│   ├── demo/              # Demo page with ChromaGen functionality
│   ├── docs/              # Documentation page
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── accessibility-report.tsx
│   ├── color-swatch.tsx
│   ├── figma-export-modal.tsx
│   ├── palette-card.tsx
│   ├── palette-display.tsx
│   ├── prompt-input.tsx
│   └── loader.tsx
├── lib/                   # Utilities and services
│   ├── services/         # AI and color services
│   │   ├── accessibilityService.ts      # WCAG and color blindness simulation (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
│   │   ├── colorThiefService.ts
│   │   ├── geminiService.ts
│   │   └── groqService.ts
│   ├── types.ts          # TypeScript type definitions
│   └── utils.ts          # Utility functions
└── public/               # Static assets
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component primitives
- **Groq API** - AI-powered palette generation with Llama 3.1 8B Instant model
- **ColorThief** - Image color extraction
- **Lucide React** - Icons

## API Integration

The app uses Groq's API for palette generation. Make sure to:

1. Get an API key from [Groq Console](https://console.groq.com/keys)
2. Set the `NEXT_PUBLIC_GROQ_API_KEY` environment variable
3. The API key is used client-side for direct AI calls

## Accessibility Features

- WCAG AA/AAA contrast ratio checking
- Color blindness simulation (Protanopia, Deuteranopia, Tritanopia, Achromatopsia)
- Keyboard navigation support
- Screen reader compatibility

## Deployment

The app can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Docker**

Make sure to set the `NEXT_PUBLIC_GROQ_API_KEY` environment variable in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
```
chromaen-frontent
├─ app
│  ├─ demo
│  │  └─ page.tsx
│  ├─ docs
│  │  └─ page.tsx
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ components
│  ├─ accessibility-checker.tsx
│  ├─ accessibility-report.tsx
│  ├─ color-swatch.tsx
│  ├─ ColorAdjustmentSwatch.tsx
│  ├─ contrast-matrix-new.tsx
│  ├─ contrast-matrix.tsx
│  ├─ dark-mode-toggle.tsx
│  ├─ export-modal.tsx
│  ├─ figma-export-modal.tsx
│  ├─ icons.tsx
│  ├─ loader.tsx
│  ├─ palette-card.tsx
│  ├─ palette-display.tsx
│  ├─ palette-generator.tsx
│  ├─ palette-previews
│  │  ├─ ChartPreview.tsx
│  │  ├─ LandingPagePreview.tsx
│  │  └─ MobileAppPreview.tsx
│  ├─ prompt-input.tsx
│  ├─ share-modal.tsx
│  ├─ skip-to-content.tsx
│  ├─ theme-provider.tsx
│  ├─ tints-shades-ladder.tsx
│  └─ ui
│     ├─ badge.tsx
│     ├─ button.tsx
│     ├─ card.tsx
│     ├─ input.tsx
│     ├─ select.tsx
│     └─ tabs.tsx
├─ components.json
├─ lib
│  ├─ services
│  │  ├─ accessibilityService.ts
│  │  ├─ colorThiefService.ts
│  │  ├─ colorVariationsService.ts
│  │  ├─ contrastFixService.ts
│  │  ├─ exportService.ts
│  │  ├─ geminiService.ts
│  │  ├─ groqService.ts
│  │  └─ urlService.ts
│  ├─ types.ts
│  └─ utils.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ pages
│  └─ api
│     └─ groq-enhance.ts
├─ pnpm-lock.yaml
├─ postcss.config.mjs
├─ public
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  ├─ placeholder.svg
│  └─ professional-headshot.png
├─ README.md
├─ styles
│  └─ globals.css
└─ tsconfig.json

```