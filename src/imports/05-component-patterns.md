# Component Patterns

## Buttons

- Primary actions use Vuetify buttons with semantic theme colors.
- Pill-shaped utility buttons appear in the top app bar for notifications, locale, and profile.
- Row-level actions in tables often use flat or light-primary buttons.

## Cards

- Cards are the dominant structural primitive.
- Common patterns include outlined cards, nested cards, titled cards with actions, and dedicated table cards.
- Dashboard evidence: the current dashboard view contains 8 card instances.

## Forms And Inputs

- Text inputs are Vuetify text fields with rounded large corners by default.
- Forms tend to live inside cards or tab panels, not as standalone wizard canvases.
- Labels and body text should stay compact and consistent with the Titillium Web scale.

## Tabs, Chips, And Status

- Detail screens often use tabs to segment profile, verifications, organisations, invites, tasks, and activity.
- User detail evidence: the current profile view exposes 9 tab items across the main detail shell.
- Chips are used for roles, domain items, and compact state-like metadata.
- Inline status notices pair an icon with bold semantic text.

## Dialogs

- Dialogs are modal Vuetify cards with explicit title/content/action structure.
- Default dialogs use a max width around 600px and rely on standard card padding and action rows.

## Tables And Indices

- Index pages are usually search + title + headers + row actions inside a card/table shell.
- Domain index evidence: the representative domain index currently contains 1 action button instance(s) in the row/action template.

## Prefer

- Outlined or flat cards with clear internal structure.
- Compact controls and action rows.
- Chips, badges, tabs, and status lines for workflow metadata.

## Avoid

- Oversized CTA buttons, giant hero cards, or consumer-style empty states.
- Minimalist frameless tables or highly stylized glassmorphism.
- Soft pastel component systems or playful rounded blobs.
