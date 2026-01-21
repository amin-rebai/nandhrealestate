# Currency Field - Admin Form Guide

## 📋 Form Layout

The property form now includes a currency selector next to the price field.

### Form Row Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ Listing Type (4 units)  │ [Dropdown: Sale/Rent/Off-Plan]       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Property Title (12 units)                                       │
│ [Text Input: Enter property title]                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Description (12 units)                                          │
│ [Text Area: Enter property description]                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────┬──────────────────────────────┐
│ Price (4 units)  │ Currency (2) │ Country (6 units)            │
│ [Number Input]   │ [Dropdown]   │ [Dropdown: Qatar/UAE/...]    │
│ QAR 2,500,000    │ QAR ▼        │                              │
└──────────────────┴──────────────┴──────────────────────────────┘
```

## 🎯 Price Field

**Label:** Price  
**Type:** Number input  
**Adornment:** Dynamic (shows selected currency)  
**Width:** 4 grid units (33%)  
**Required:** Yes  
**Validation:** Must be >= 0  

**Example:**
```
Price: [2500000]  ← Input field with QAR prefix
```

## 💱 Currency Field

**Label:** Currency  
**Type:** Dropdown selector  
**Width:** 2 grid units (17%)  
**Required:** Yes  
**Default:** QAR  

**Available Options:**
- QAR (Qatar Riyal)
- USD (US Dollar)
- EUR (Euro)
- AED (UAE Dirham)
- SAR (Saudi Riyal)
- KWD (Kuwaiti Dinar)
- BHD (Bahraini Dinar)
- OMR (Omani Rial)

**Example:**
```
Currency: [QAR ▼]  ← Dropdown showing selected currency
```

## 🌍 Country Field

**Label:** Country  
**Type:** Dropdown selector  
**Width:** 6 grid units (50%)  
**Required:** Yes  
**Default:** Qatar  

**Available Options:**
- Qatar
- UAE
- Saudi Arabia
- Egypt
- France
- Morocco
- Oman
- Turkey

## 📱 Responsive Behavior

### Desktop (md and above)
- Price: 4 units (33%)
- Currency: 2 units (17%)
- Country: 6 units (50%)

### Tablet/Mobile (xs)
- All fields stack vertically
- Each takes full width (12 units)

## 🔄 Dynamic Price Adornment

The price input field dynamically updates its prefix based on the selected currency:

```
Currency: QAR  → Price: [QAR 2,500,000]
Currency: USD  → Price: [USD 850,000]
Currency: AED  → Price: [AED 3,125,000]
Currency: EUR  → Price: [EUR 750,000]
```

## ✅ Form Validation

**Price Field:**
- Required: Yes
- Type: Number
- Min: 0
- Max: No limit

**Currency Field:**
- Required: Yes
- Must be one of: QAR, USD, EUR, AED, SAR, KWD, BHD, OMR
- Default: QAR

**Country Field:**
- Required: Yes
- Must be one of predefined countries

## 💾 Form Submission

When submitting the form, the following data is sent:

```json
{
  "price": 2500000,
  "currency": "QAR",
  "country": "Qatar",
  ...other fields
}
```

## 🎨 UI/UX Features

✅ **Clear Labels** - Each field has descriptive label  
✅ **Helpful Text** - Currency options show full names  
✅ **Dynamic Updates** - Price adornment changes with currency  
✅ **Responsive** - Works on all screen sizes  
✅ **Validation** - Real-time validation feedback  
✅ **Accessibility** - Proper ARIA labels and semantic HTML  

## 🚀 Usage Tips

1. **Set Currency First** - Select currency before entering price
2. **Use Correct Format** - Enter price as number (no commas)
3. **Match Country** - Select appropriate country for currency
4. **Save Regularly** - Save form to avoid data loss

---

**Status:** ✅ Form ready to use!

