# Featured Properties Testing Guide

## 🧪 Quick Test (5 Minutes)

### Step 1: Open Home Page
1. Navigate to `http://localhost:3000` (or your frontend URL)
2. Scroll to "Featured Properties" section

### Step 2: Check Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Look for these logs:
   ```
   Fetching featured properties with limit: 3
   Featured properties response: [...]
   Found featured properties: 3
   ```

### Step 3: Verify Display
- [ ] Real properties display (not demo)
- [ ] Property images load
- [ ] Property details show (beds, baths, price)
- [ ] Links work (click to view property)

---

## 🔍 Detailed Testing

### Test 1: Properties Display
**Expected**: Real properties from database

**Steps**:
1. Open home page
2. Scroll to Featured Properties
3. Verify:
   - [ ] Properties have real images
   - [ ] Titles are real property names
   - [ ] Prices are realistic
   - [ ] Locations are real

**If Demo Shows**:
- Check console for errors
- Verify properties exist in database
- Check if any are marked as featured

### Test 2: Console Logging
**Expected**: Detailed logs showing what's happening

**Steps**:
1. Open console (F12)
2. Refresh page
3. Look for logs:
   - [ ] `Fetching featured properties with limit: 3`
   - [ ] `Featured properties response: [...]`
   - [ ] `Found featured properties: X` OR `No featured properties found...`

**If No Logs**:
- Check if console is open before page loads
- Refresh page
- Check for JavaScript errors

### Test 3: Fallback Logic
**Expected**: Shows newest properties if no featured

**Steps**:
1. Open console
2. Look for message:
   - `Found featured properties: X` (if featured exist)
   - `No featured properties found, falling back...` (if not)
3. Verify properties display either way

### Test 4: Admin Panel Integration
**Expected**: Changes reflect within 30 seconds

**Steps**:
1. Open home page in one window
2. Open admin panel in another
3. Mark a property as featured
4. Watch home page (should update in 30 seconds)
5. Check console for refresh logs

---

## 🐛 Troubleshooting

### Issue: Demo Content Shows
**Possible Causes**:
1. No properties in database
2. No properties marked as featured
3. API error

**Solution**:
1. Check console for error messages
2. Create properties in admin panel
3. Mark at least one as featured
4. Refresh home page

### Issue: No Console Logs
**Possible Causes**:
1. Console opened after page load
2. JavaScript disabled
3. Different browser

**Solution**:
1. Open console BEFORE loading page
2. Refresh page (Ctrl+F5)
3. Check for JavaScript errors
4. Try different browser

### Issue: Properties Don't Update
**Possible Causes**:
1. Polling not working
2. API not responding
3. Browser cache

**Solution**:
1. Hard refresh (Ctrl+Shift+Delete)
2. Check API is running
3. Check network tab in DevTools
4. Wait 30 seconds for poll

### Issue: Images Don't Load
**Possible Causes**:
1. Image URL incorrect
2. API URL wrong
3. Image file missing

**Solution**:
1. Check image URLs in database
2. Verify API_URL in .env
3. Check image files exist
4. Use fallback image

---

## ✅ Verification Checklist

### Configuration
- [ ] Config loads from database OR uses defaults
- [ ] `fetchFromDatabase` is true
- [ ] `propertyCount` is set (default: 3)

### Data Fetching
- [ ] API call to `/properties/featured` succeeds
- [ ] Properties array is populated
- [ ] Fallback works if no featured properties

### Display
- [ ] Real properties show (not demo)
- [ ] Images display correctly
- [ ] Property details are accurate
- [ ] Links work

### Logging
- [ ] Console shows fetch logs
- [ ] Error messages are clear
- [ ] Fallback messages appear when needed

### Polling
- [ ] Properties refresh every 30 seconds
- [ ] Console shows refresh logs
- [ ] Changes from admin appear

---

## 📊 Expected Console Output

### Successful Load:
```
Fetching featured properties with limit: 3
Featured properties response: Array(3)
  0: {_id: "...", title: {...}, price: 8500000, ...}
  1: {_id: "...", title: {...}, price: 15000, ...}
  2: {_id: "...", title: {...}, price: 12000000, ...}
Found featured properties: 3
```

### Fallback Load:
```
Fetching featured properties with limit: 3
Featured properties response: Array(0)
No featured properties found, falling back to newest properties
Fallback properties response: Array(3)
  0: {_id: "...", title: {...}, ...}
  1: {_id: "...", title: {...}, ...}
  2: {_id: "...", title: {...}, ...}
Using fallback properties: 3
```

### Error Handling:
```
Fetching featured properties with limit: 3
Error fetching featured properties: Error: Network Error
Attempting fallback fetch due to error
Fallback properties response: Array(3)
Using fallback properties: 3
```

---

## 🎯 Sign-Off

When all checks pass:
- ✅ Featured properties display correctly
- ✅ Console shows proper logging
- ✅ Fallback works
- ✅ Admin integration works
- ✅ Ready for production

---

**Status**: Ready for Testing

