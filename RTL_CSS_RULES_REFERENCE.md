# RTL CSS Rules Reference

## Complete List of RTL Styles Applied for Arabic

All RTL styles are defined in `frontend/src/App.css` (lines 2444-2663) using the `[dir="rtl"]` selector.

## Core RTL Rules

### Text & Content Alignment
```css
[dir="rtl"] {
  text-align: right;
  font-family: 'Tajawal', 'Cairo', 'Amiri', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Navigation & Header
```css
[dir="rtl"] .navbar {
  flex-direction: row-reverse;
}

[dir="rtl"] .nav-links {
  flex-direction: row-reverse;
}

[dir="rtl"] .header-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .logo {
  order: 0;
}

[dir="rtl"] .mobile-menu-toggle {
  order: -1;
}
```

### Hero & Content Sections
```css
[dir="rtl"] .hero-content {
  text-align: right;
}

[dir="rtl"] .cta-buttons {
  flex-direction: row-reverse;
}

[dir="rtl"] .hero-cta {
  flex-direction: row-reverse;
}
```

### Grids & Layouts
```css
[dir="rtl"] .stats-grid {
  direction: rtl;
}

[dir="rtl"] .services-grid {
  direction: rtl;
}

[dir="rtl"] .properties-grid {
  direction: rtl;
}

[dir="rtl"] .featured-properties-grid {
  direction: rtl;
}

[dir="rtl"] .services-grid-modern {
  direction: rtl;
}

[dir="rtl"] .partners-categories-grid {
  direction: rtl;
}
```

### Mobile Menu (RTL)
```css
[dir="rtl"] .nav-links {
  right: auto;
  left: -100%;
}

[dir="rtl"] .nav-links.mobile-active {
  left: 0;
  right: auto;
}

[dir="rtl"] .nav-link-dropdown {
  flex-direction: row-reverse;
}

[dir="rtl"] .dropdown-arrow {
  margin-left: 0.5rem;
  margin-right: 0;
}

[dir="rtl"] .dropdown-icon {
  margin-left: 1rem;
  margin-right: 0;
}
```

### Forms & Inputs
```css
[dir="rtl"] .contact-item {
  text-align: right;
}

[dir="rtl"] .contact-details {
  text-align: right;
}

[dir="rtl"] .contact-icon {
  margin-left: 1rem;
  margin-right: 0;
}

[dir="rtl"] .contact-quick-info {
  flex-direction: row-reverse;
}

[dir="rtl"] .quick-contact-item {
  flex-direction: row-reverse;
}
```

### Footer
```css
[dir="rtl"] .footer-content {
  direction: rtl;
}

[dir="rtl"] .footer-section {
  text-align: right;
}

[dir="rtl"] .footer-bottom {
  flex-direction: row-reverse;
}

[dir="rtl"] .social-links {
  flex-direction: row-reverse;
}
```

### Dropdown Menu
```css
[dir="rtl"] .dropdown-menu {
  right: auto;
  left: 0;
  text-align: right;
}

[dir="rtl"] .dropdown-item {
  flex-direction: row-reverse;
}
```

### Cards & Components
```css
[dir="rtl"] .service-card-modern {
  text-align: right;
}

[dir="rtl"] .service-link {
  text-align: right;
}

[dir="rtl"] .property-features {
  flex-direction: row-reverse;
}

[dir="rtl"] .section-header-modern {
  text-align: right;
}

[dir="rtl"] .section-badge {
  text-align: right;
}

[dir="rtl"] .process-step {
  text-align: right;
}

[dir="rtl"] .partner-category {
  text-align: right;
}
```

### Buttons & Icons
```css
[dir="rtl"] .btn-modern-primary svg {
  margin-left: 0;
  margin-right: 0.5rem;
  transform: scaleX(-1);
}
```

### Mobile RTL (768px and below)
```css
@media (max-width: 768px) {
  [dir="rtl"] .nav-links {
    left: -100%;
    right: auto;
    align-items: flex-end;
  }

  [dir="rtl"] .nav-links.mobile-active {
    left: 0;
    right: auto;
  }

  [dir="rtl"] .nav-links a {
    text-align: right;
  }

  [dir="rtl"] .dropdown-item {
    flex-direction: row-reverse;
    text-align: right;
  }

  [dir="rtl"] .nav-link-dropdown a {
    text-align: right;
  }
}
```

## How It Works

1. **Automatic Application**: When `dir="rtl"` is set on `<html>`, all `[dir="rtl"]` CSS rules apply
2. **No Manual Changes**: Users don't need to do anything - it's automatic
3. **Cascading**: All child elements inherit RTL behavior
4. **Responsive**: Mobile RTL rules apply at breakpoints

## Testing

To verify RTL is working:
1. Switch to Arabic language
2. Check browser DevTools: `<html dir="rtl" lang="ar">`
3. Verify all text aligns right
4. Check navigation reverses
5. Test mobile menu slides from left

---

**Status**: All RTL rules implemented and tested

