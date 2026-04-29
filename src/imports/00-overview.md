# Customer Portal Overview

Use this package to keep Figma Make prototypes recognizably close to the existing Aretiico customer portal. The target is the current production-style application, not a redesign.

## Product and Audience

- Product purpose: Allow customers to purchase and manage certificates, verifications, and related trust workflows.
- Primary audience: Aretiico customers managing certificates, verifications, organisations, and related account workflows.
- Typical activities: register and sign in; verify identity, domains, email, and organisations; request, approve, download, revoke, and reorder certificates; manage tasks, invites, and profile settings
- Visual goal: Faithful to the current portal: formal, structured, card-based, and trust-oriented.

## App Structure

- Main authenticated shell routes: dashboard, certificates, organisations, verifications, invites, domains
- Auth routes: /auth/login, /auth/logout, /auth/password/forgotten, /auth/password/reset, /auth/password/update, /auth/2fa/setup, /auth/2fa/recovery, /auth/2fa/confirm, /auth/terms-agreement, /auth/register/:token
- Public utility routes: /verify/domain/:secret1, /verify/email-addresses/:urlSecret, /organisations/join/:secret
- Form routes: report-an-issue, respond/:problemReportId/:hash

## What Figma Make Should Emulate

- A serious enterprise portal for identity, verification, certificates, and regulated workflows.
- Dense but readable business UI, built around cards, forms, tabs, tables, chips, alerts, and action buttons.
- A left-sidebar application shell with a top app bar and content inside a generous container.
- Heavy use of semantic states: success, warning, error, info, verification levels, approval states, and workflow statuses.
- Limited decorative flourish. Visual emphasis comes from color, spacing, structure, and trust-oriented content rather than playful illustration.

## Do This

- Make screens look like a real authenticated operations portal, not a marketing page or startup landing page.
- Preserve the existing information density and tabular/form-based workflow feel.
- Prefer recognisable portal screens such as dashboard, domain index, organisation detail, verification detail, certificate order, and profile settings.
