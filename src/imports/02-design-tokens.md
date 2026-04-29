# Design Tokens

## Primary Theme

| Token | Value |
| --- | --- |
| `primary` | `#101F36` |
| `primary200` | `#90caf9` |
| `lightprimary` | `#e3f2fd` |
| `darkprimary` | `#1565c0` |
| `secondary` | `#81D742` |
| `secondary200` | `#b39ddb` |
| `lightsecondary` | `#ede7f6` |
| `darksecondary` | `#4527a0` |
| `success` | `#00c853` |
| `lightsuccess` | `#b9f6ca` |
| `error` | `#f44336` |
| `lighterror` | `#f9d8d8` |
| `accent` | `#FFAB91` |
| `warning` | `#ffc107` |
| `lightwarning` | `#fff8e1` |
| `info` | `#0e939d` |
| `lightText` | `#616161` |
| `darkText` | `#212121` |
| `surface` | `#fff` |
| `on-surface-variant` | `#fff` |
| `borderLight` | `#90caf9` |
| `containerBg` | `#e3f2fd` |
| `inputBorder` | `#787878` |
| `gray100` | `#fafafa` |
| `link` | `#0000ff` |
| `facebook` | `#4267b2` |
| `linkedin` | `#0e76a8` |
| `twitter` | `#1da1f2` |

## Dark Theme

Dark mode exists in code but should be treated as secondary reference unless a prototype explicitly needs a dark variant.

| Token | Value |
| --- | --- |
| `primary` | `#1e88e5` |
| `secondary` | `#7c4dff` |
| `info` | `#03c9d7` |
| `success` | `#05b187` |
| `accent` | `#fc4b6c` |
| `warning` | `#fec90f` |
| `error` | `#fc4b6c` |
| `lightprimary` | `#29314f` |
| `lightsecondary` | `#29314f` |
| `lightsuccess` | `#143c33` |
| `lighterror` | `#f9d8d8` |
| `lightwarning` | `#fff8e1` |
| `darkprimary` | `#1565c0` |
| `darksecondary` | `#4527a0` |
| `darkText` | `#d7dcec` |
| `lightText` | `#bdc8f0` |
| `borderLight` | `#404968` |
| `inputBorder` | `#5f698d` |
| `containerBg` | `#1a223f` |
| `surface` | `#111936` |
| `background` | `#111936` |
| `on-surface-variant` | `#111936` |
| `facebook` | `#4267b2` |
| `twitter` | `#1da1f2` |
| `linkedin` | `#0e76a8` |
| `gray100` | `#fafafa` |
| `primary200` | `#90caf9` |
| `secondary200` | `#b39ddb` |

## Radius Scale

| Radius token | Value |
| --- | --- |
| `0` | `0` |
| `sm` | `$border-radius-root * 0.5` |
| `null` | `$border-radius-root` |
| `md` | `$border-radius-root * 1` |
| `lg` | `$border-radius-root * 2` |
| `xl` | `$border-radius-root * 6` |
| `pill` | `9999px` |
| `circle` | `50%` |
| `shaped` | `$border-radius-root * 6 0` |

## Base SCSS Variables

| Variable | Value |
| --- | --- |
| `font-size-root` | `1rem` |
| `border-radius-root` | `0.25rem` |
| `card-item-spacer-xy` | `20px 24px` |
| `card-text-spacer` | `24px` |
| `card-title-size` | `18px` |
| `box-shadow` | `1px 0 20px rgb(0 0 0 / 8%)` |

## Breakpoints

| Breakpoint | Min width |
| --- | --- |
| `xs` | `0` |
| `sm` | `600` |
| `md` | `960` |
| `lg` | `1280` |
| `xl` | `1920` |

- Mobile breakpoint key: `sm`

## Vuetify Defaults

| Component | Default |
| --- | --- |
| `VBtn` | `none` |
| `VCard` | `rounded: 'md'` |
| `VTextField` | `rounded: 'lg'` |
| `VTooltip` | `location: 'top'` |

## Do This

- Use semantic token meanings rather than inventing a new palette.
- Keep primary surfaces light and neutral, with dark navy primary accents and bright green secondary accents.
- Use compact radii and light card shadows. This UI is more operational than soft or luxurious.
