# AI Detective — Interactive Investigation Platform

A production-quality web application where users investigate fictional cases by examining evidence, connecting clues, questioning AI-generated suspects, identifying contradictions, and submitting final deductions.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint
npm run lint
```

Visit [http://localhost:3000](http://localhost:3000)

## Features

- **Case Selection** — Browse and select from pre-built investigation cases
- **Evidence System** — Interactive evidence locker with metadata, reliability scores, and cross-references
- **Investigation Board** — Drag-and-drop node graph connecting suspects, evidence, and locations
- **Timeline** — Chronological reconstruction with gap detection
- **Suspect Profiles** — Detailed suspect cards with alibis, motives, and suspicion scores
- **AI Detective Assistant** — Chat-based AI that answers case questions with evidence references
- **Contradiction Detection** — AI-powered identification of inconsistencies in statements
- **Final Deduction** — Multi-step deduction submission with automated scoring
- **Case Resolution** — Animated reveal of the actual solution vs your theory
- **Scoring System** — Investigation score based on accuracy, evidence, contradictions, and efficiency

## Demo Case

The project includes one fully playable hand-crafted case: **"The Locked Room"** — no API key required. A recruiter can deploy and play the complete investigation immediately.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State:** Zustand
- **AI:** OpenAI API (optional — demo works without it)

## Project Structure

```
src/
├── app/                    # Next.js app routes
├── cases/                  # Case data (structured, not hardcoded in components)
├── components/
│   ├── case/               # Case selection & briefing
│   ├── investigation/      # Investigation workspace & panels
│   │   └── panels/         # Individual workspace panels
│   ├── landing/            # Landing page
│   └── ui/                 # shadcn/ui components
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities & scoring
├── stores/                 # Zustand state stores
└── types/                  # TypeScript type definitions
```

## Architecture

```
Landing Page → Case Selection → Case Briefing → Investigation Workspace
                                                          ↓
                                            ┌─────────────┼─────────────┐
                                            ↓             ↓             ↓
                                      Evidence      Suspects      Timeline
                                      System        Profiles    Reconstruction
                                            ↓             ↓             ↓
                                      Investigation Board (Node Graph)
                                            ↓
                                      AI Detective Assistant
                                            ↓
                                      Contradiction Detection
                                            ↓
                                      Final Deduction → Scoring → Case Resolution
```

## AI Features (Requires API Key)

When `OPENAI_API_KEY` is configured:
- AI Detective Assistant answers case questions
- AI Suspect Interrogation (maintains character consistency)
- AI Contradiction Detection
- AI Case Generation

Without API key: The demo case works fully with deterministic data and pre-built AI responses.

## Environment Variables

See `.env.example` for required variables.

## Deployment

Optimized for Vercel deployment:

```bash
npm run build
```

## License

MIT
