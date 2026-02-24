# Property Finder Sync Button - Quick Reference

## 🎯 What Was Added

A **"Sync from Property Finder"** button in the admin panel's Properties page that allows admins to manually sync all properties from Property Finder.

## 📍 Location

**Admin Panel** → **Properties Page** → **Top-Right Corner**

The button is gold/tan colored (#C5A059) with a sync icon.

## 🔄 How It Works

```
Click Button → Confirmation Dialog → Start Sync → Processing → Result Dialog → Auto-Refresh List
```

## 📊 What You'll See

### Confirmation Dialog
- Warns about the sync operation
- Explains that existing properties will be updated
- Notes the process may take a few minutes

### Result Dialog (After Sync)
Shows statistics:
- ✓ **Total Properties Found** - Number of properties in Property Finder
- ✓ **Created** - New properties added to database
- ⟳ **Updated** - Existing properties updated
- ✗ **Errors** - Any sync errors (if applicable)

## ⚙️ Technical Details

**File Modified:** `admin-panel/src/pages/Properties.tsx`

**API Endpoint:** `POST /api/property-finder/sync`

**Authentication:** Admin token required

**Response Time:** Depends on number of properties (typically 1-5 minutes)

## ✨ Features

- ✅ One-click sync operation
- ✅ Confirmation before sync
- ✅ Real-time progress feedback
- ✅ Detailed result statistics
- ✅ Automatic properties list refresh
- ✅ Error handling and reporting
- ✅ Prevents duplicate requests (button disabled during sync)

## 🚀 Usage Steps

1. Go to Admin Panel → Properties
2. Click "Sync from Property Finder" button (top-right)
3. Confirm the sync operation
4. Wait for the result dialog
5. Review the statistics
6. Properties list will auto-refresh

## 📝 Notes

- Only active properties from Property Finder are synced
- Existing properties are matched by reference number
- Requires admin authentication
- Backend must have Property Finder integration configured
- Check backend console for detailed sync logs

## 🔗 Related Files

- Backend Controller: `backend/src/controllers/propertyFinderController.ts`
- Backend Routes: `backend/src/routes/propertyFinderRoutes.ts`
- Admin Component: `admin-panel/src/pages/Properties.tsx`

## 📚 Documentation

See `PROPERTY_FINDER_SYNC_BUTTON.md` for detailed documentation.

