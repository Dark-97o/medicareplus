---
description: Premium UI/UX Design Workflow
---

# Premium UI/UX Design Workflow

Follow these steps to transition from abstract requirements to a high-end "Neon Sanctum" interface.

## 1. Requirement Refinement
- Identify core clinical data to display.
- Map data to the the high-contrast hierarchy (Display-LG for hero, Label-SM for tech readouts).

## 2. Stitch Generation
- Use `mcp_StitchMCP_generate_screen_from_text` with the specific component requirement.
- **Prompt suffix**: "Apply the Neon Sanctum design system. Use Manrope headlines, Inter body, and Luminescent Cyan accents on a deep obsidian background."

## 3. High-End Polish
- Add `framer-motion` transitions.
- Implement `backdrop-blur` for all floating elements.
- Add "Underglow" effects using blurred radial gradients of the `Primary` or `Secondary` colors.

## 4. Verification
- Use the browser subagent to verify accessibility and visual fidelity.
- Check contrast ratios for neon-on-dark text.
