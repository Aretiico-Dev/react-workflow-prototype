# Figma Make Instructions

Use these instructions with the other attached markdown files and screenshots when asking Figma Make to generate portal concepts or stakeholder prototypes.

## Core Prompt Guidance

- Match the existing Aretiico customer portal closely.
- Keep the product in the enterprise trust-services space: certificates, identity, verification, organisations, approvals, and secure workflows.
- Use the documented token values, typography scale, shell layout, and card-heavy component system.
- Prefer authenticated app screens over marketing pages unless the prompt explicitly asks for an auth or public utility route.

## Specific Style Guardrails

- Use Titillium Web across the interface.
- Use the current light theme as the main visual direction.
- Preserve the left sidebar + top app bar shell on logged-in screens.
- Use nested outlined cards, compact tables, chips, tabs, and semantic status colors.
- Keep the UI professional, dense, and audit-friendly.

## Avoid

- Do not redesign the product into a consumer dashboard, SaaS landing page, fintech app, or glassmorphic concept.
- Do not replace the palette with purple-heavy, pastel, or trendy neon aesthetics.
- Do not use oversized headings, oversized whitespace, or illustration-led empty states.

## Suggested Prompt Snippet

```text
Create a high-fidelity Aretiico customer portal screen that matches the attached design context package. Use the documented Titillium Web typography, semantic light theme tokens, left-sidebar enterprise shell, and dense card/form/table patterns. Keep the UI faithful to the existing regulated certificate and verification portal rather than redesigning it.
```
