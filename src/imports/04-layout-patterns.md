# Layout Patterns

## Auth Layout

- Full-viewport background image with a dark purple-toned overlay base (`#1b102c`).
- Auth card width is capped around `475px`.
- Language selector lives as a pill button in the top-right corner.
- Main auth content is a centered outlined card with the logo and a compact heading.

## Authenticated Shell

- Left navigation drawer with rail mode on desktop and drawer mode on mobile.
- Top app bar height is 80px and holds sidebar toggle, notifications, locale menu, and profile menu.
- Main content sits inside a fluid Vuetify container with a page-wrapper class and optional boxed width.
- Shell content is card-based and uses repeated inner outlined cards.

## Responsive Behavior

- Mobile breakpoint starts at the Vuetify `sm` threshold.
- Sidebar behavior changes by viewport: rail on desktop, drawer on smaller screens.
- Desktop screens often use multi-column cards. Mobile screens should stack without changing the overall visual language.

## Information Architecture

- Expect breadcrumbs, page titles, tabs, tables, cards, and dialogs to coexist on a single screen.
- Pages are utilitarian and often combine read-only status summaries with forms or task actions.
- Dense business content is normal. Whitespace is measured and functional, not airy.

## Do This

- Keep the portal shell visible on authenticated screens whenever possible.
- Build layouts around cards inside the app container, not around giant open canvases.
- Preserve the distinction between auth screens, public utility screens, and logged-in application screens.
