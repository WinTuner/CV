# Accessibility

Target: **WCAG 2.1 Level AA** (in progress — baseline is implemented).

## What's Already In Place

- **Skip link** — "Skip to content" link in `app/layout.tsx` targeting the
  `#main` landmark.
- **ARIA labels** — icon-only buttons (theme toggle, language toggle, menu
  toggle, social links, lightbox close) all carry accessible names.
- **Focus management** — the mobile menu moves focus into the first link when
  opened, returns focus to the toggle on close, and closes on `Escape`.
- **Focus visibility** — global `:focus-visible` outline styles in
  `app/globals.css`.
- **Reduced motion** — all ambient/infinite animations are disabled under
  `prefers-reduced-motion` via a shared media query block.
- **Semantic landmarks** — pages use `header`, `nav`, `main`, `section`,
  `article`, `footer`; headings follow a logical hierarchy.
- **Keyboard-operable widgets** — tabs in the hero terminal use
  `aria-pressed` buttons; the lightbox closes on `Escape`; the CLI accepts
  keyboard input and history (ArrowUp/Down).
- **Contrast-aware print** — the `@media print` block forces high-contrast
  black-on-white for the resume flow.

## Known Gaps / Next Steps

1. **Automated audit** — run axe against every route:
   ```bash
   npx @axe-core/cli http://localhost:3000
   ```
2. **Contrast pass** — verify `muted-foreground` on `background` and
   `secondary-foreground` on `secondary` hit 4.5:1 in both themes (the yellow
   accent palette is the main risk).
3. **Screen-reader testing** — NVDA / VoiceOver pass over the terminal widget
   and the blog post content (check that `<pre>`/code blocks read sensibly).
4. **Live regions** — add an `aria-live` region for form submission
   feedback in the contact/newsletter sections.
5. **Touch targets** — confirm interactive elements are ≥44×44px on mobile
   (some small tag chips are below this).
6. **Focus trap** — the mobile menu does not yet trap Tab focus inside the
   open panel (the page behind remains reachable).

## Testing Checklist

- [ ] Tab through every route; ensure a visible focus ring at each stop
- [ ] Open/close mobile menu with keyboard; verify focus returns to toggle
- [ ] `Escape` closes menu and lightbox
- [ ] Run axe-core; fix all critical issues
- [ ] Test both themes in light and dark mode at 200% zoom
- [ ] Verify reduced-motion disables marquee, aurora, shine, pulse animations

---

**Last updated**: August 2026
