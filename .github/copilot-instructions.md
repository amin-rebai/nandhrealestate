# HN Real Estate - Copilot Instructions

## Project Architecture

This is a **full-stack monorepo** with three independent TypeScript applications:

- **`backend/`**: Node.js/Express REST API (port 5000)
- **`frontend/`**: React public website (port 3000)
- **`admin-panel/`**: React admin dashboard (port 3001)

All three share similar patterns but are separately deployed. The **backend is the source of truth** for data and business logic; frontends fetch from it via Axios.

## Running the Project

```bash
# Root level - runs all three apps concurrently
npm run dev

# Or run individually from root
npm run backend    # Terminal 1: Node server
npm run frontend   # Terminal 2: Public site
npm run admin      # Terminal 3: Admin dashboard

# Individual app setup
cd backend && npm run dev     # Just backend
cd frontend && npm start      # Just frontend
cd admin-panel && npm start   # Just admin panel
```

**Key build script** at root `package.json`: `npm run install-all` installs deps for all three apps.

## Core Patterns

### 1. **Multilingual Content (English + Arabic)**

The app is **fully bilingual**. Content in the database is stored with language keys:

```typescript
// Backend: Property.ts model
title: { en: string; ar: string }
description: { en: string; ar: string }
location: { en: string; ar: string }
features: { en: string[]; ar: string[] }
```

**Language resolution**:

- Backend detects language via query param (`?lang=ar`) or Accept-Language header → `backend/src/utils/languageUtils.ts` → `getLanguageFromRequest()`
- Transforms response to single language via `transformContentForLanguage()` before returning
- Frontend auto-detects and stores in localStorage via i18next
- Admin panel uses same i18next setup

**When adding multilingual fields**:

- Add to model with nested `{ en, ar }` structure
- Use `transformContentForLanguage()` in controllers for API responses
- Frontend accesses via `useTranslation()` hook from i18next

### 2. **Authentication & Authorization**

JWT-based with role-based access:

```typescript
// Backend: auth.ts middleware
protect; // Verifies Bearer token, attaches user to req.user
authorize(...roles); // Checks if req.user.role matches allowed roles
```

**User roles**: `'user'`, `'agent'`, `'admin'`

**Admin panel pattern** (see `ProtectedRoute.tsx`):

- Stores token in localStorage as `'adminToken'`
- ProtectedRoute checks token on load via Redux async thunk `getCurrentUser()`
- Shows loading spinner while verifying
- Redirects non-admin/non-agent users with error message

**When protecting routes**:

- Backend: Chain `protect` then `authorize('agent', 'admin')` in route definition
- Admin frontend: Wrap protected pages in `<ProtectedRoute><YourPage /></ProtectedRoute>`

### 3. **Redux State Management**

Both React apps use **Redux Toolkit** slices pattern:

```typescript
// Frontend structure: src/store/slices/
propertySlice.ts; // Properties list + detail (fetchProperties, fetchPropertyById)
userSlice.ts; // User auth state
languageSlice.ts; // Current language
contentSlice.ts; // Static content
blogSlice.ts; // Blog posts

// Admin panel: src/store/slices/
authSlice.ts; // Admin authentication + getCurrentUser thunk
propertySlice.ts; // CRUD for admin property management
userSlice.ts; // Admin user management
contentSlice.ts; // Admin content management
blogSlice.ts; // Admin blog management
```

**Patterns**:

- Async operations use `createAsyncThunk` → `extraReducers` pattern
- API base URL: `http://localhost:5000/` (frontend), same for admin
- Error handling: Store errors in slice state, display in component
- Thunk example: `export const fetchProperties = createAsyncThunk('properties/fetchProperties', async ...)` with rejection handling

### 4. **API Design**

Backend follows RESTful conventions:

```
GET    /properties              # List (with filters, pagination)
GET    /properties/:id          # Single item
POST   /properties              # Create (auth required)
PUT    /properties/:id          # Update (auth required)
DELETE /properties/:id          # Delete (auth required)

GET    /auth/me                 # Current user
POST   /auth/register           # User registration
POST   /auth/login              # User login

GET    /users                   # List users (admin only)
PUT    /users/:id               # Update user
DELETE /users/:id               # Delete user

GET/POST /upload                # File upload
GET/POST /content               # Static content
GET/POST /blog                  # Blog posts
```

**Response format**:

```json
{ "success": true, "data": {...}, "language": "en" }
{ "success": false, "error": "message" }
```

### 5. **File Uploads**

Handled by `backend/src/controllers/uploadController.ts`:

- Multer configured for image uploads
- Files stored in `backend/public/uploads/`
- Served as static files via `app.use('/uploads', express.static(...))`
- Admin panel has `<ImageUpload />` component for property images
- Property model stores image URLs as array of strings

### 6. **Frontend Components**

**Shared across frontend & admin**:

- `LanguageSwitcher.tsx` - Toggle between EN/AR, updates i18next + document direction (RTL)
- `ImageGallery.tsx` - Display image arrays
- `MultilingualTextField.tsx` - Input fields with en/ar tabs

**Frontend-specific** (`frontend/src/components/`):

- `Header.tsx`, `Footer.tsx` - Layout
- `HeroSlider.tsx` - Property carousel
- `PortfolioShowcase.tsx` - Featured properties grid

**Frontend pages**:

- `Home.tsx`, `About.tsx`, `Properties.tsx`, `Agents.tsx` - Main pages
- `PropertyDetail.tsx`, `Blog.tsx`, `BlogPost.tsx`, `Contact.tsx` - Detail/content pages

**Admin-specific** (`admin-panel/src/components/`):

- `ImageUpload.tsx` - Upload component for properties and pages
- `RichTextEditor.tsx` - Blog/content editor
- `Layout.tsx` - Admin dashboard layout with navigation

**Admin pages** (`admin-panel/src/pages/`):

- `Content.tsx` - Frontend page management (Hero & About sections with hero video/image upload)
- `Properties.tsx` - Property CRUD operations
- `Users.tsx` - User management
- `Blog.tsx` - Blog post management
- `Media.tsx` - Media library

## Data Model Conventions

### Property Model

```typescript
// backend/src/models/Property.ts
- Core fields: title, description, price, location, country
- Specs: bedrooms, bathrooms, area, yearBuilt
- Categorization: type ('sale'|'rent'|'off-plan'), status ('available'|'sold'|'rented')
- Media: images[], video?
- Multilingual: title, description, location, features have {en, ar}
- Off-plan fields: completionDate, paymentPlan, developer, projectName, handoverDate, startingPrice, downPayment, installmentPlan
- Relations: agent (User ObjectId), verified (Boolean)
- Indexes: location, type, status, price (for query performance)
```

### User Model

Stores name, email, password (hashed), role, contact info. Used for both agents (property listers) and admins.

### Blog Model

Multilingual posts: title, content, slug, author, publishedAt

### Restructured Admin Content Management

**New page-based structure** (v2 - replacing generic content sections):

Admin panel now focuses on managing individual frontend page sections instead of generic content:

```typescript
// admin-panel/src/pages/Content.tsx
- Tab 1: Hero Section (hero title, subtitle, description, CTA, video/image background)
- Tab 2: About Section (title, content, image, statistics)
- Tab 3: Page Settings (future extensibility)
```

**Key features**:

- **Edit Mode Toggle**: Click "Edit" to unlock fields, "Save Changes" to persist
- **Hero Media**: Choose between video (recommended) or image background
- **Video Upload**: Direct video upload to backend (`/upload/video`)
- **Image Upload**: Reusable `<ImageUpload />` component with preview
- **Live Preview**: Side-by-side preview showing how content appears on frontend
- **Multilingual**: All text fields support EN/AR via `<MultilingualTextField />`

**To add a new page section**:

1. Create new Redux state in `contentSlice.ts`
2. Add fetch thunk: `fetchContentBySection('new-section')`
3. Add new Tab in `Content.tsx` with edit/save handlers
4. Frontend displays via `fetchContentBySection()` in store on page load

**Database**: All stored in `Content` model with `section` enum field. Single active hero/about per `isActive` flag.

## Common Modifications (Updated)

### Agents Management

**Frontend Agents Page** (`frontend/src/pages/Agents.tsx`):

- Public page at `/agents` displaying all active agents
- Search agents by name/email
- View agent contact information
- Contact form to message agents directly
- Pagination support for large agent lists

**Backend Agents Endpoint**:

- `GET /users?role=agent` - List all agents (public route)
- `POST /users` with `role: 'agent'` - Create new agent (admin only)
- `PUT /users/:id` - Update agent details (admin only)
- `DELETE /users/:id` - Remove agent (admin only)

**Admin Agents Management** (`admin-panel/src/pages/Agents.tsx`):

- Full CRUD operations for managing agents
- Search, filter, and pagination
- Add new agents with name, email, phone
- Edit existing agent information
- Delete agents with confirmation
- Toggle agent active/inactive status

**Redux Integration**:

- Frontend uses `userSlice.ts` with `fetchAgents()` thunk
- Admin panel uses same `userSlice.ts` (admin flavor) with `fetchUsers({ role: 'agent' })`
- User model already supports agent role

### Adding a new API endpoint

1. **Backend route**: Add to `backend/src/routes/`
2. **Backend controller**: Implement logic in `backend/src/controllers/`
3. **Redux slice**: Create thunk in frontend/admin-panel `src/store/slices/`
4. **React component**: Call `useDispatch()` to trigger thunk, access state with `useSelector()`

### Adding a new field to Property

1. Update `backend/src/models/Property.ts` schema
2. If multilingual: use `{ en: string, ar: string }` structure + add to `multilingualFields` in `languageUtils.ts`
3. Update `Property` interface in `frontend/src/store/slices/propertySlice.ts`
4. Admin: Update form components in `admin-panel/src/pages/Properties.tsx`

### Adding a new frontend page section to admin Content Management

1. Add section type to `Content` model enum: `'hero' | 'about' | 'new-section'`
2. Add Redux state to `contentSlice.ts`: `newSection: ContentItem | null`
3. Add fetch in `Content.tsx` `useEffect`: `dispatch(fetchContentBySection('new-section'))`
4. Create new Tab with form fields (use `MultilingualTextField` for multilingual fields)
5. Implement save handler following hero/about pattern
6. Frontend accesses via `fetchContentBySection()` in respective page component

## Key Files by Purpose

| Purpose        | Files                                                                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authentication | `backend/src/middleware/auth.ts`, `admin-panel/src/components/ProtectedRoute.tsx`, `admin-panel/src/store/slices/authSlice.ts`                                         |
| Multilingual   | `backend/src/utils/languageUtils.ts`, `frontend/src/i18n/index.ts`, both `locales/*.json`                                                                              |
| Properties     | `backend/src/models/Property.ts`, `backend/src/routes/propertyRoutes.ts`, `frontend/src/store/slices/propertySlice.ts`                                                 |
| Agents         | `backend/src/controllers/userController.ts` (getAgents), `frontend/src/pages/Agents.tsx`, `admin-panel/src/pages/Agents.tsx`, `frontend/src/store/slices/userSlice.ts` |
| Admin CRUD     | `admin-panel/src/pages/Properties.tsx`, `admin-panel/src/pages/Agents.tsx`, `admin-panel/src/pages/Users.tsx`, `admin-panel/src/pages/Blog.tsx`                        |
| API base       | `backend/src/server.ts` - routes and middleware setup                                                                                                                  |

## Testing & Debugging

- **Backend**: `npm test` runs Jest (configure in `backend/tsconfig.json`)
- **Frontend/Admin**: `npm test` runs Create React App tests
- **API testing**: Backend health check: `GET http://localhost:5000/health`
- **Redux DevTools**: Install browser extension for Redux debugging
- **i18next debug**: Set `debug: true` in `src/i18n/index.ts` for language resolution logs

## Environment Variables

Create `.env` in `backend/` with:

```
MONGODB_URI=mongodb://localhost:27017/hnrealstate
JWT_SECRET=your_secret_key
JWT_EXPIRE=30d
PORT=5000
```

Frontend and admin-panel connect to backend via hardcoded `http://localhost:5000` (update for production deployment).
