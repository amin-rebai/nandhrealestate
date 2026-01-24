# Quick Start Guide - Multilingual Implementation

## 🚀 Getting Started

### For Testing the Multilingual Content

1. **Start the Frontend**
   ```bash
   cd frontend
   npm start
   ```

2. **Switch Languages**
   - Look for language switcher in the header
   - Click to toggle between English, Arabic, and French
   - Content should update automatically

3. **Test Pages**
   - Visit `/about` - See Global Network, Why Choose Us, Testimonials
   - Visit `/services` - See Service Cards, Benefits, Partnerships
   - Visit `/contact` - See Contact Form with translated labels
   - Visit `/blog` - See Blog posts with multilingual support

### For Adding More Translations

1. **Find the getText() function**
   ```typescript
   const getText = (text: MultilingualText | string | undefined): string => {
     if (!text) return '';
     if (typeof text === 'string') return text;
     const lang = i18n.language as 'en' | 'ar' | 'fr';
     return text[lang] || text.en || text.ar || text.fr || '';
   };
   ```

2. **Use the Pattern**
   ```typescript
   {getText({
     en: 'English text',
     ar: 'النص العربي',
     fr: 'Texte français'
   })}
   ```

3. **For Form Labels**
   ```typescript
   <label>{getText({
     en: 'Full Name',
     ar: 'الاسم الكامل',
     fr: 'Nom complet'
   })}</label>
   ```

## 📋 Checklist for New Pages

When adding multilingual content to a new page:

- [ ] Import useTranslation hook
- [ ] Create getText() helper function
- [ ] Identify all user-facing text
- [ ] Add English, Arabic, French translations
- [ ] Test language switching
- [ ] Check RTL layout for Arabic
- [ ] Verify form labels and placeholders
- [ ] Test on mobile devices

## 🎯 Priority Pages to Complete

1. **Properties.tsx** - High priority (user searches)
2. **PropertyDetail.tsx** - High priority (user views)
3. **Agents.tsx** - Medium priority
4. **OurServices.tsx** - Medium priority
5. **OurProcess.tsx** - Medium priority

## 📚 Reference Files

- `TRANSLATION_REFERENCE.md` - Common translations
- `REMAINING_PAGES_TRANSLATION_GUIDE.md` - Specific page guides
- `MULTILINGUAL_IMPLEMENTATION_GUIDE.md` - Full implementation guide

## 🧪 Testing Commands

```bash
# Test language switching
# 1. Open browser DevTools
# 2. Go to Application > Local Storage
# 3. Look for i18nextLng key
# 4. Change value to 'ar' or 'fr'
# 5. Refresh page

# Or use language switcher in header
```

## 💡 Tips

1. **Copy from Completed Pages**
   - About.tsx, Services.tsx, Contact.tsx are fully translated
   - Use them as templates for new pages

2. **Use Translation Reference**
   - Check TRANSLATION_REFERENCE.md for common phrases
   - Ensures consistency across website

3. **Test Early and Often**
   - Switch languages frequently while developing
   - Check mobile responsiveness

4. **Keep Translations Short**
   - Avoid very long translations
   - Test with actual content

## 🔗 Useful Links

- i18next: https://www.i18next.com/
- React i18next: https://react.i18next.com/
- RTL CSS: https://rtlcss.com/

## ❓ Common Issues

**Issue**: Text not updating when language changes
- **Solution**: Make sure you're using getText() function

**Issue**: Arabic text not displaying RTL
- **Solution**: CSS should handle this automatically, check browser DevTools

**Issue**: Form placeholders not translating
- **Solution**: Use getText() for placeholder attribute

**Issue**: Special characters showing incorrectly
- **Solution**: Ensure UTF-8 encoding in file headers

## 📞 Need Help?

1. Check existing implementations in About.tsx, Services.tsx, Contact.tsx
2. Review TRANSLATION_REFERENCE.md for common phrases
3. Follow the getText() pattern consistently
4. Test with actual i18n language switching

