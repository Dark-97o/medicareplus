# Stitch UI Skill: Neon Sanctum

## Overview
The **Neon Sanctum** is a premium, clinical dark-mode design system. It is characterized by high-contrast neon accents, deep obsidian surfaces, and intentional asymmetry.

## Design Tokens
- **Background**: `#121314` (Deep Obsidian)
- **Primary**: `#00E5FF` (Luminescent Cyan)
- **Secondary**: `#9D50FF` (Obsidian Purple)
- **Typography**: 
  - Headlines: **Manrope** (Tracking: `-0.02em`)
  - Body/Labels: **Inter**
- **Roundness**: `xl` (0.75rem / 12px)

## Implementation Patterns

### 1. High-Contrast Hero
Use the `Primary` -> `Secondary` gradient for main CTAs and 3D highlights.

### 2. Glassmorphism
Apply `backdrop-blur-3xl` and `bg-black/40` for floating elements to maintain the "Neon" depth.

### 3. Asymmetric Layouts
Avoid rigid grids. Allow 3D models or key visual assets to break container boundaries.

## Stitch MCP Usage
When using the `StitchMCP` tools:
- Use `MODEL_ID_GEMINI_3_PRO` for design reasoning.
- Reference the `projects/2308998669860998126` project ID for themes.
- Always append "Use the Neon Sanctum premium aesthetic" to prompts.
