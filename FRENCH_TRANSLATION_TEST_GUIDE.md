# 🧪 French Translation - Test Guide

## Quick Test Steps

### Step 1: Create Blog in French

**Using Postman or cURL:**

```bash
POST http://localhost:5000/api/blog
Content-Type: application/json

{
  "title": { "fr": "Les Meilleures Propriétés à Dubaï" },
  "excerpt": { "fr": "Découvrez les meilleures propriétés disponibles à Dubaï" },
  "content": { "fr": "Dubaï est l'un des marchés immobiliers les plus recherchés au monde. Nous vous proposons une sélection exclusive de propriétés de luxe." },
  "category": { "fr": "Immobilier" },
  "tags": [
    { "fr": "Dubaï" },
    { "fr": "Propriétés" },
    { "fr": "Luxe" }
  ],
  "author": {
    "name": "Jean Dupont",
    "avatar": "https://example.com/avatar.jpg"
  },
  "featuredImage": "https://example.com/image.jpg",
  "seo": {
    "metaTitle": { "fr": "Meilleures Propriétés à Dubaï" },
    "metaDescription": { "fr": "Trouvez les meilleures propriétés à Dubaï avec notre sélection exclusive" },
    "keywords": { "fr": "propriétés, dubaï, immobilier, luxe" }
  }
}
```

### Step 2: Verify Response

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": {
      "en": "Best Properties in Dubai",
      "ar": "أفضل العقارات في دبي",
      "fr": "Les Meilleures Propriétés à Dubaï"
    },
    "excerpt": {
      "en": "Discover the best properties available in Dubai",
      "ar": "اكتشف أفضل العقارات المتاحة في دبي",
      "fr": "Découvrez les meilleures propriétés disponibles à Dubaï"
    },
    "content": {
      "en": "Dubai is one of the most sought-after real estate markets in the world...",
      "ar": "دبي هي واحدة من أكثر أسواق العقارات المطلوبة في العالم...",
      "fr": "Dubaï est l'un des marchés immobiliers les plus recherchés au monde..."
    },
    "category": {
      "en": "Real Estate",
      "ar": "العقارات",
      "fr": "Immobilier"
    },
    "tags": [
      {
        "en": "Dubai",
        "ar": "دبي",
        "fr": "Dubaï"
      },
      {
        "en": "Properties",
        "ar": "العقارات",
        "fr": "Propriétés"
      },
      {
        "en": "Luxury",
        "ar": "الفخامة",
        "fr": "Luxe"
      }
    ],
    "slug": {
      "en": "best-properties-in-dubai",
      "ar": "أفضل-العقارات-في-دبي",
      "fr": "les-meilleures-proprietes-a-dubai"
    },
    "seo": {
      "metaTitle": {
        "en": "Best Properties in Dubai",
        "ar": "أفضل العقارات في دبي",
        "fr": "Meilleures Propriétés à Dubaï"
      },
      "metaDescription": {
        "en": "Find the best properties in Dubai with our exclusive selection",
        "ar": "ابحث عن أفضل العقارات في دبي مع اختيارنا الحصري",
        "fr": "Trouvez les meilleures propriétés à Dubaï avec notre sélection exclusive"
      },
      "keywords": {
        "en": "properties, dubai, real estate, luxury",
        "ar": "العقارات، دبي، العقارات، الفخامة",
        "fr": "propriétés, dubaï, immobilier, luxe"
      }
    },
    "status": "draft",
    "views": 0,
    "likes": 0,
    "isActive": true,
    "isFeatured": false,
    "createdAt": "2024-...",
    "updatedAt": "2024-..."
  },
  "message": "Blog post created successfully"
}
```

### Step 3: Retrieve Blog by French Slug

```bash
GET http://localhost:5000/api/blog/slug/les-meilleures-proprietes-a-dubai
```

**Expected Result:**
- ✅ Blog found
- ✅ All translations returned
- ✅ Content in requested language

### Step 4: Search by French Category

```bash
GET http://localhost:5000/api/blog?category=Immobilier
```

**Expected Result:**
- ✅ Blog found in results
- ✅ Filtered by French category

### Step 5: Search by French Tag

```bash
GET http://localhost:5000/api/blog?tag=Dubaï
```

**Expected Result:**
- ✅ Blog found in results
- ✅ Filtered by French tag

## ✅ What to Check

### Database Check
1. Open MongoDB Compass or MongoDB Atlas
2. Navigate to `blogs` collection
3. Find the blog you created
4. Verify:
   - ✅ `title.fr` contains French title
   - ✅ `excerpt.fr` contains French excerpt
   - ✅ `content.fr` contains French content
   - ✅ `category.fr` contains French category
   - ✅ `tags[].fr` contains French tags
   - ✅ `slug.fr` contains French slug
   - ✅ `seo.metaTitle.fr` contains French meta title
   - ✅ `seo.metaDescription.fr` contains French meta description
   - ✅ `seo.keywords.fr` contains French keywords

### API Check
1. ✅ Blog creation returns all three languages
2. ✅ Blog retrieval by French slug works
3. ✅ Category filter works with French
4. ✅ Tag filter works with French
5. ✅ Search includes French content

## 🔍 Troubleshooting

### Issue: French content not saved
**Solution:**
- Check if blog model was recompiled
- Restart backend server
- Verify database connection

### Issue: French slug not generated
**Solution:**
- Ensure `titleFr` is provided
- Check slug generation logic in controller
- Verify database schema supports `slug.fr`

### Issue: French content not found by slug
**Solution:**
- Verify slug is correct
- Check if blog status is 'published'
- Verify `isActive` is true

### Issue: Auto-translation not working
**Solution:**
- Check translation service logs
- Verify google-translate-api-x is installed
- Check internet connection for API calls

## 📊 Test Scenarios

### Scenario 1: French Only
```json
{
  "title": { "fr": "Titre en Français" },
  "excerpt": { "fr": "Extrait en Français" },
  "content": { "fr": "Contenu en Français" },
  ...
}
```
**Expected:** Auto-translates to English & Arabic ✅

### Scenario 2: French + English
```json
{
  "title": { "en": "English Title", "fr": "Titre en Français" },
  "excerpt": { "en": "English excerpt", "fr": "Extrait en Français" },
  "content": { "en": "English content", "fr": "Contenu en Français" },
  ...
}
```
**Expected:** Auto-translates to Arabic only ✅

### Scenario 3: All Three Languages
```json
{
  "title": { "en": "English", "ar": "عربي", "fr": "Français" },
  "excerpt": { "en": "English", "ar": "عربي", "fr": "Français" },
  "content": { "en": "English", "ar": "عربي", "fr": "Français" },
  ...
}
```
**Expected:** Uses all as-is, no translation ✅

## 🎯 Success Criteria

- [x] Blog created with French content
- [x] Auto-translation to English & Arabic works
- [x] French slug generated correctly
- [x] Blog retrievable by French slug
- [x] French category filter works
- [x] French tag filter works
- [x] All French fields saved to database
- [x] No TypeScript errors

---

**All tests passing? You're ready to go! 🚀**

