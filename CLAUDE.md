# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Prontowhats is a web application built with Astro that allows users to send WhatsApp messages without saving contacts. The app automatically detects the user's country via IP geolocation and provides a form to enter a phone number and optional message, then redirects to WhatsApp Web/mobile.

## Development Commands

### Development Mode
```bash
npm run dev        # Start Astro development server with hot reload
npm start          # Alias for npm run dev
```

### Build Commands
```bash
npm run build      # Production build - static site generation
npm run preview    # Preview production build locally
```

### Testing
```bash
npm test           # Run Jest test suite
npm run test:w     # Run tests in watch mode
```

### Utility Commands
```bash
npm run make:countries-list  # Generate country codes JSON from script
npm run astro      # Run Astro CLI commands
```

## Architecture

### Frontend Stack
- **Astro** - Modern static site generator with component-based architecture
- **TypeScript** - Main application logic with strict typing
- **Tailwind CSS** - Utility-first CSS framework with custom Inter font
- **FontAwesome** - Icon library for UI elements

### Build System
- **Astro** - Handles bundling, optimization, and static site generation
- **Vite** - Fast build tool and dev server (used internally by Astro)
- **TypeScript** - Type checking and compilation

### Key Features
- **Smart Paste**: Automatically formats pasted phone numbers via `smartPaste` utility
- **Country Detection**: Auto-selects user's country using ipapi.co geolocation
- **Analytics Tracking**: Google Analytics integration with gtag events
- **Form Validation**: Real-time validation for phone and country inputs

### Project Structure
- `src/pages/index.astro` - Main page (Astro component)
- `src/layouts/Layout.astro` - Base HTML layout
- `src/components/` - Reusable Astro components (Navigation, CountrySelect, WhatsAppForm)
- `src/lib/main.ts` - Main application logic
- `src/lib/extenders/smartPaste/` - Phone number formatting utilities
- `src/lib/track.ts` - Analytics tracking wrapper
- `src/styles/main.css` - Tailwind CSS and global styles
- `src/json/country-codes.json` - Country data for select dropdown
- `public/` - Static assets (images, fonts, etc.)

### Build Configuration
- `astro.config.mjs` - Astro configuration with Tailwind integration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration extending Astro's strictest preset
- Environment-based builds: `SEND_MESSAGE` flag controls WhatsApp redirect behavior

### Component Architecture
- **Layout.astro**: Base layout with meta tags, Google Analytics, and global styles
- **Navigation.astro**: Header navigation component
- **CountrySelect.astro**: Country dropdown with flag emojis
- **WhatsAppForm.astro**: Main form component for phone input and message

### Testing Setup
- Jest with ts-jest preset
- jsdom environment for DOM testing
- Tests located in `src/**/tests/` directories
- Path mapping configured for `@/*` imports pointing to `src/`

### Development Notes
- Development builds use `SEND_MESSAGE=false` to log WhatsApp URLs instead of redirecting
- Production builds enable actual WhatsApp redirects and analytics tracking
- Astro handles CSS processing, bundling, and optimization automatically
- Static site generation creates optimized HTML, CSS, and JS files in `dist/`
- Font files and assets are copied from `public/` directory during build