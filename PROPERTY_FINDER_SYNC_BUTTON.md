# Property Finder Manual Sync Button - Admin Panel

## Overview
Added a manual sync button to the admin panel's Properties page to allow admins to manually sync properties from Property Finder.

## Changes Made

### File Modified: `admin-panel/src/pages/Properties.tsx`

#### 1. **Added Imports** (Lines 54-56)
- `Sync as SyncIcon` - Icon for the sync button
- `CheckCircle` - Success icon for result dialog
- `Error as ErrorIcon` - Error icon for result dialog

#### 2. **Added State Variables** (Lines 99-107)
```typescript
const [syncDialogOpen, setSyncDialogOpen] = useState(false);
const [syncResultDialogOpen, setSyncResultDialogOpen] = useState(false);
const [syncing, setSyncing] = useState(false);
const [syncResult, setSyncResult] = useState<{
  total: number;
  created: number;
  updated: number;
  errors: number;
} | null>(null);
```

#### 3. **Added Sync Function** (Lines 557-590)
`handleSyncProperties()` - Calls the backend API endpoint `/property-finder/sync` to:
- Fetch all active properties from Property Finder
- Create new properties in the database
- Update existing properties
- Display results to the user
- Refresh the properties list

#### 4. **Added Sync Button to Header** (Lines 612-629)
- Positioned in the top-right of the Properties page
- Gold/tan color (#C5A059) to match the design
- Shows "Syncing..." text while operation is in progress
- Disabled during sync operation

#### 5. **Added Confirmation Dialog** (Lines 1575-1600)
- Warns user about the sync operation
- Explains that existing properties will be updated
- Notes that the process may take a few minutes

#### 6. **Added Result Dialog** (Lines 1602-1650)
- Shows sync statistics:
  - Total properties found
  - Number of properties created
  - Number of properties updated
  - Number of errors (if any)
- Green checkmark for successful sync
- Red error icon if there were issues
- Auto-refreshes the properties list after sync

## How to Use

1. **Navigate to Properties Page**
   - Go to Admin Panel → Properties

2. **Click "Sync from Property Finder" Button**
   - Located in the top-right corner of the page
   - Gold/tan colored button with sync icon

3. **Confirm the Sync**
   - A confirmation dialog will appear
   - Click "Start Sync" to proceed

4. **Wait for Completion**
   - The button will show "Syncing..." while in progress
   - A result dialog will appear showing:
     - Total properties found
     - Properties created
     - Properties updated
     - Any errors encountered

5. **Review Results**
   - The properties list will automatically refresh
   - New properties will appear in the table
   - Updated properties will show latest data

## API Endpoint Used

**Endpoint:** `POST /api/property-finder/sync`

**Access:** Admin only (requires authentication token)

**Response:**
```json
{
  "success": true,
  "message": "Property sync completed",
  "stats": {
    "total": 50,
    "created": 10,
    "updated": 40,
    "errors": 0
  }
}
```

## Features

✅ **One-Click Sync** - Simple button to trigger manual sync
✅ **Confirmation Dialog** - Prevents accidental syncs
✅ **Real-time Feedback** - Shows sync progress
✅ **Detailed Results** - Displays created, updated, and error counts
✅ **Auto-Refresh** - Properties list updates automatically
✅ **Error Handling** - Gracefully handles sync failures
✅ **Disabled State** - Button disabled during sync to prevent multiple requests

## Testing

To test the sync button:

1. Ensure backend is running with Property Finder integration configured
2. Log in to admin panel
3. Navigate to Properties page
4. Click "Sync from Property Finder" button
5. Confirm the sync operation
6. Wait for results dialog
7. Verify properties are created/updated in the list

## Notes

- The sync operation may take several minutes depending on the number of properties
- Existing properties are matched by `propertyFinderRefId` or `referenceNumber`
- Only active properties from Property Finder are synced
- The operation requires admin authentication

