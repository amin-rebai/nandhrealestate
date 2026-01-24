# RTL Testing Guide for Arabic

## Quick Testing Steps

### 1. **Switch to Arabic Language**
- Click the language switcher button (🌐) in the header
- Select "Arabic" (العربية)
- Page should immediately switch to RTL

### 2. **Verify HTML Attributes**
Open browser DevTools (F12) and check:
```html
<html dir="rtl" lang="ar">
```

Should show:
- ✅ `dir="rtl"` attribute
- ✅ `lang="ar"` attribute

### 3. **Visual Verification Checklist**

#### Text & Content
- [ ] All text aligns to the right
- [ ] Arabic text displays correctly
- [ ] No text overflow issues
- [ ] Proper line breaks

#### Navigation
- [ ] Menu items reverse order
- [ ] Logo stays on left (due to order property)
- [ ] Dropdown menus align right
- [ ] Active states display correctly

#### Mobile Menu (< 768px)
- [ ] Menu slides from LEFT (not right)
- [ ] Menu items align right
- [ ] Close button works
- [ ] Dropdown items align right

#### Layout & Spacing
- [ ] Flexbox items reverse correctly
- [ ] Grid items display in RTL order
- [ ] Margins/padding adjust for RTL
- [ ] Icons flip if needed

#### Forms
- [ ] Input fields align right
- [ ] Labels align right
- [ ] Placeholders display correctly
- [ ] Form validation works

#### Footer
- [ ] Footer content reverses
- [ ] Social links reverse
- [ ] Links align right
- [ ] Copyright text aligns right

#### Cards & Components
- [ ] Property cards display correctly
- [ ] Service cards align right
- [ ] Testimonials display properly
- [ ] Badges position correctly

### 4. **Responsive Testing**

#### Desktop (1200px+)
```bash
# Full width testing
- Navigation displays horizontally
- All content visible
- No horizontal scroll
```

#### Tablet (768px - 1199px)
```bash
# Medium screen testing
- Mobile menu works
- Content stacks properly
- Touch targets adequate
```

#### Mobile (< 768px)
```bash
# Small screen testing
- Menu slides from left
- Content readable
- No overflow
- Touch friendly
```

### 5. **Browser DevTools Inspection**

Check computed styles:
```css
/* Should see these applied */
[dir="rtl"] {
  text-align: right;
}

[dir="rtl"] .navbar {
  flex-direction: row-reverse;
}

[dir="rtl"] .nav-links {
  flex-direction: row-reverse;
}
```

### 6. **Font Verification**

Check that Arabic fonts load:
```
Tajawal, Cairo, or Amiri fonts should be used
```

In DevTools:
1. Inspect Arabic text
2. Check "Computed" tab
3. Verify font-family shows Arabic font

### 7. **Language Persistence**

Test that language persists:
1. Switch to Arabic
2. Refresh page (F5)
3. Should still be in Arabic
4. Check localStorage: `i18nextLng = 'ar'`

### 8. **Switching Back**

Test switching back to English:
1. Click language switcher
2. Select English
3. Page should switch to LTR
4. Check: `<html dir="ltr" lang="en">`

## Common Issues & Solutions

### Issue: Text not aligning right
**Solution**: Check if `[dir="rtl"]` CSS is loaded in App.css

### Issue: Mobile menu slides from right
**Solution**: Verify mobile RTL media query at line 2634 in App.css

### Issue: Arabic text looks wrong
**Solution**: Ensure Arabic fonts are loaded from Google Fonts

### Issue: Icons flipped incorrectly
**Solution**: Check if SVG needs `transform: scaleX(-1)` in RTL

### Issue: Form inputs misaligned
**Solution**: Verify contact-icon margin rules in RTL section

## Performance Check

- [ ] No console errors
- [ ] No console warnings
- [ ] Page loads quickly
- [ ] Language switch is instant
- [ ] No layout shift

## Accessibility Check

- [ ] Screen readers work in RTL
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast maintained
- [ ] ARIA labels correct

## Final Verification

```bash
✅ RTL direction applied
✅ All text aligns right
✅ Navigation reverses
✅ Mobile menu works
✅ Forms display correctly
✅ Footer aligns right
✅ No visual issues
✅ Responsive on all devices
✅ Language persists
✅ Performance good
```

---

**Status**: Ready for Testing

