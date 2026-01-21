# Currency Field - Step-by-Step Testing Guide

## 🎯 Test Objective

Verify that properties can be created and updated with different currencies, and that the selected currency is correctly saved to the database.

## 📋 Pre-Test Checklist

- [ ] Admin panel is running
- [ ] Backend API is running
- [ ] MongoDB is running
- [ ] You have admin/agent access
- [ ] Browser console is open (F12)

## 🧪 Test Case 1: Create Property with USD

### Steps:
1. Navigate to Admin Panel → Properties
2. Click "Add New Property" button
3. Fill in the form:
   - **Listing Type:** For Sale
   - **Property Title:** "Luxury Apartment - USD Test"
   - **Description:** "Test property with USD currency"
   - **Price:** 850000
   - **Currency:** USD ← **SELECT THIS**
   - **Country:** UAE
   - **City/Area:** Dubai
   - **Location Details:** Marina Tower
   - **Bedrooms:** 2
   - **Bathrooms:** 2
   - **Area:** 1200
   - **Year Built:** 2023
   - **Category:** Residential
   - **Property Type:** Apartment

4. Click "Create Property" button
5. Wait for success message

### Expected Results:
- ✅ Property created successfully
- ✅ Form closes
- ✅ Property appears in list
- ✅ Console shows: `propertyData: { ..., currency: "USD", ... }`

### Verify in Database:
```javascript
// MongoDB Compass or mongosh
db.properties.findOne({ title: { $regex: "USD Test" } })

// Should show:
{
  "price": 850000,
  "currency": "USD",  // ← MUST BE USD, NOT QAR
  ...
}
```

---

## 🧪 Test Case 2: Create Property with AED

### Steps:
1. Click "Add New Property"
2. Fill in form:
   - **Title:** "Villa - AED Test"
   - **Price:** 2500000
   - **Currency:** AED ← **SELECT THIS**
   - **Country:** UAE
   - **City/Area:** Abu Dhabi
   - Other required fields...

3. Click "Create Property"

### Expected Results:
- ✅ Property saved with currency: AED
- ✅ Database shows: `"currency": "AED"`

---

## 🧪 Test Case 3: Create Property with EUR

### Steps:
1. Click "Add New Property"
2. Fill in form:
   - **Title:** "Apartment - EUR Test"
   - **Price:** 750000
   - **Currency:** EUR ← **SELECT THIS**
   - **Country:** France
   - **Location:** Paris
   - Other required fields...

3. Click "Create Property"

### Expected Results:
- ✅ Property saved with currency: EUR
- ✅ Database shows: `"currency": "EUR"`

---

## 🧪 Test Case 4: Edit Property and Change Currency

### Steps:
1. Find the "USD Test" property in the list
2. Click "Edit" button
3. Verify currency shows: USD
4. Change currency to: **SAR**
5. Click "Update Property"

### Expected Results:
- ✅ Property updated successfully
- ✅ Currency changed from USD to SAR
- ✅ Database shows: `"currency": "SAR"`

---

## 🧪 Test Case 5: Verify All 8 Currencies

Create one property for each currency:

| # | Currency | Price | Country |
|---|----------|-------|---------|
| 1 | QAR | 2,500,000 | Qatar |
| 2 | USD | 850,000 | UAE |
| 3 | EUR | 750,000 | France |
| 4 | AED | 3,125,000 | UAE |
| 5 | SAR | 3,500,000 | Saudi Arabia |
| 6 | KWD | 300,000 | Kuwait |
| 7 | BHD | 350,000 | Bahrain |
| 8 | OMR | 400,000 | Oman |

### Verification:
```javascript
// Check all properties have correct currencies
db.properties.find({}).project({ title: 1, currency: 1, price: 1 })

// Should show 8 different currencies
```

---

## 🔍 Browser Console Verification

### Check Network Tab:
1. Open DevTools (F12)
2. Go to Network tab
3. Create a property with USD
4. Find the POST request to `/api/properties`
5. Click on it and view Request Payload
6. **Should show:** `"currency": "USD"`

### Check Console Logs:
1. Open DevTools Console
2. Create a property
3. **Should see:**
   ```
   handleSubmit called
   formData: { ..., currency: "USD", ... }
   propertyData: { ..., currency: "USD", ... }
   Dispatching createProperty/updateProperty...
   Property created/updated successfully
   ```

---

## ✅ Success Criteria

All of the following must be true:

- [ ] Can create property with QAR
- [ ] Can create property with USD
- [ ] Can create property with EUR
- [ ] Can create property with AED
- [ ] Can create property with SAR
- [ ] Can create property with KWD
- [ ] Can create property with BHD
- [ ] Can create property with OMR
- [ ] Can edit property and change currency
- [ ] Database stores correct currency value
- [ ] API request includes currency field
- [ ] No console errors
- [ ] Form displays selected currency

---

## 🐛 Troubleshooting

### Issue: Currency still saves as QAR
**Solution:** 
- Clear browser cache (Ctrl+Shift+Delete)
- Restart admin panel
- Check that line 310 has: `currency: formData.currency,`

### Issue: Currency dropdown not showing
**Solution:**
- Refresh page
- Check browser console for errors
- Verify form state includes currency

### Issue: API error when saving
**Solution:**
- Check backend logs
- Verify currency is one of: QAR, USD, EUR, AED, SAR, KWD, BHD, OMR
- Check network tab for error details

---

**Status:** Ready for testing! 🚀

