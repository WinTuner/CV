# Accessibility

Target: **WCAG 2.1 Level AA** (in progress — baseline is implemented).

## What's Already In Place

- **Skip link** — "Skip to content" link in `app/layout.tsx` targeting the
  `#main` landmark.
- **ARIA labels** — icon-only buttons (language toggle, menu toggle, social
  links, lightbox close) all carry accessible names. There is no theme toggle:
  the theme is forced dark (`forcedTheme="dark"`, `enableSystem={false}` in
  `app/layout.tsx`).
- **Focus management** — the mobile menu moves focus into the first link when
  opened, returns focus to the toggle on close, closes on `Escape`, and traps
  `Tab`/`Shift+Tab` inside the open panel (`mobileMenuRef` in
  `components/header.tsx`).
- **Focus visibility** — global `:focus-visible` outline styles in
  `app/globals.css`.
- **Reduced motion** — ambient/infinite animations are disabled under
  `prefers-reduced-motion` by five separate media-query blocks in
  `app/globals.css` (loader/route-progress/page-in, arrow spin, marquee,
  aurora, Christmas layer). The typing caret
  (`.typing-caret::after`, `blink ... infinite`) has no override yet.
- **Semantic landmarks** — pages use `header`, `nav`, `main`, `section`,
  `article`, `footer`; headings follow a logical hierarchy.
- **Keyboard-operable widgets** — the lightbox closes on `Escape`; the
  language toggle and menu toggle are plain buttons.
- **Contrast-aware print** — the `@media print` block forces high-contrast
  black-on-white for the resume flow.
- **Live regions** — the contact form reports outcomes through
  `role="status"` / `aria-live="polite"` on success and `role="alert"` /
  `aria-live="assertive"` on error (`components/contact-section.tsx`). The
  newsletter form in `components/public/blog/blog-sidebar.tsx` mirrors the
  same pattern.

## Known Gaps / Next Steps

Axe audit coverage lives in `e2e/a11y.spec.ts` — `@axe-core/playwright` over
six routes (`/`, `/projects`, `/introduction`, `/blog`, `/workbench`,
`/case-study/muanjai`) with `wcag2a`/`wcag2aa` tags, blocking on
critical/serious violations. Run it with:

```bash
npx playwright test e2e/a11y.spec.ts
```

1. **Contrast pass** — verify `muted-foreground` on `background` and
   `secondary-foreground` on `secondary` hit 4.5:1. Only the dark palette is
   reachable in the UI (`forcedTheme="dark"` in `app/layout.tsx`); the light
   palette still lives in the `:root` block of `app/globals.css` and would need
   re-checking if the toggle ever returns.
2. **Screen-reader testing** — NVDA / VoiceOver pass over the blog post
   content (check that `<pre>`/code blocks read sensibly).
3. **Touch targets** — confirm interactive elements are ≥44×44px on mobile
   (some small tag chips are below this).

## Testing Checklist

- [ ] Tab through every route; ensure a visible focus ring at each stop
- [ ] Open/close mobile menu with keyboard; verify focus returns to toggle
- [ ] `Escape` closes menu and lightbox
- [ ] Run `npx playwright test e2e/a11y.spec.ts`; fix all critical/serious issues
- [ ] Test the dark theme at 200% zoom (the light palette is unreachable while
      `forcedTheme="dark"`)
- [ ] Verify reduced-motion disables reveal animations (the typing caret still
      blinks)

---

**Last updated**: August 2026
