# Skill: UI/UX Design Mastery

## Visual Principles

### 1. Obsidian Layering
- **Background**: `#121314`
- **Surface**: `#1b1c1d` (Elevated cards)
- **Overlay**: Use `backdrop-blur` (32px+) on almost all floating components to create a "glass" clinical hardware effect.

### 2. The "No Line" Rule
- Avoid 1px borders. Use tonal shifts in background colors or soft outer glows (`box-shadow`) to define boundaries.

### 3. Typography Hierarchy
- Large headlines in **Manrope** should be high-contrast and authoritative.
- Small labels in **Inter** should use letter-spacing (`0.1em`) for a technical, readout feel.

## Motion Guidelines

### 1. The "Breathe" Transition
- Use `framer-motion` for entrances. Soft, low-velocity drifts `y: 20` to `y: 0` are preferred over fast, aggressive movements.

### 2. Interaction Feedback
- Micro-animations (e.g., subtle card scale and outer glow on hover) are essential for engagement.

## Clinical Authority
Maintain a calm, spacious, and extremely premium look. Avoid cluttering medical data. Use "White Space" (or rather "Dark Space") to create a sense of bespoke, high-end care.
