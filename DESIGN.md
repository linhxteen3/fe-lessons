---
version: alpha
name: Brilliant Interactive Learning Design Analysis
description: >
  An analysis of Brilliant.org's "Serious Playfulness" design system — crafted specifically for interactive education, problem-solving, and STEM learning.
  It combines high-clarity typography with physical tactile feedback: crisp rounded cards, 3D bottom-bordered pressable buttons, gamified streak counters, and rich visual interactive widgets that make complex learning feel delightfully simple.

colors:
  primary: "#04a777"              # Signature vibrant green (success, submit, progress)
  primary-hover: "#038c64"
  primary-light: "#e6f8f2"
  accent-gold: "#ffb800"          # Gamification, streaks, stars, coins
  accent-gold-soft: "#fff8e6"
  accent-blue: "#2563eb"          # Interactive links, focus rings, info
  accent-blue-soft: "#eff6ff"
  ink: "#111827"                  # Deep charcoal for headings & high contrast text
  body: "#374151"                 # Readable body text
  muted: "#6b7280"                # Secondary explanations and metadata
  canvas: "#ffffff"               # Clean crisp white
  canvas-soft: "#f9fafb"          # Subtle backdrop for question stages
  card-bg: "#ffffff"
  border: "#e5e7eb"               # Distinct structural border (usually 2px)
  border-subtle: "#f3f4f6"
  border-active: "#2563eb"        # Selected option card border
  shadow-3d: "#d1d5db"            # Signature tactile 3D bottom-edge for buttons & cards
  error: "#ef4444"                # Incorrect choice state
  error-soft: "#fef2f2"

typography:
  display:
    fontFamily: "Plus Jakarta Sans, CoFo Robert, Inter, system-ui, sans-serif"
    fontSize: "36px"
    fontWeight: 800
    lineHeight: "44px"
    letterSpacing: "-0.5px"
  heading-1:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: "36px"
    letterSpacing: "-0.3px"
  heading-2:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: "30px"
  heading-3:
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "26px"
  body-lg:
    fontFamily: "Inter, CoFo Sans, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body-md:
    fontFamily: "Inter, CoFo Sans, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  code:
    fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace"
    fontSize: "14px"
    fontWeight: 500

radii:
  sm: "8px"
  md: "12px"
  lg: "16px"                      # Standard question card radius
  xl: "24px"
  pill: "9999px"                  # Pill badges and round buttons

components:
  interactive-card:
    border: "2px solid var(--border)"
    borderRadius: "16px"
    background: "#ffffff"
    padding: "20px"
    transition: "all 0.15s ease"
    hoverState: "border-color: var(--accent-blue); transform: translateY(-2px);"
    selectedState: "border-color: var(--accent-blue); background: var(--accent-blue-soft); box-shadow: 0 4px 0 var(--accent-blue);"
  tactile-button:
    borderRadius: "12px"
    fontWeight: 700
    padding: "12px 24px"
    border: "none"
    boxShadow: "0 4px 0 var(--shadow-3d)"
    activeState: "transform: translateY(2px); box-shadow: 0 2px 0 var(--shadow-3d);"
  progress-bar:
    height: "10px"
    borderRadius: "9999px"
    background: "var(--border-subtle)"
    fillColor: "var(--primary)"
