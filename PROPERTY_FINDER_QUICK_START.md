# Property Finder Integration - Quick Start

## 🚀 Quick Setup (5 Minutes)

### Step 1: Get Property Finder Credentials

1. Log in to **PF Expert** → **Developer Resources** → **API Credentials**
2. Create new API key (type: API Integration)
3. Enable scopes:
   - `listings:read`
   - `listings:full_access`
   - `webhooks:full_access`
4. Copy your **API Key** and **API Secret**

### Step 2: Add Environment Variables

Add to [`backend/.env`](backend/.env):

```env
PROPERTY_FINDER_API_KEY=your_api_key
PROPERTY_FINDER_API_SECRET=your_api_secret
PROPERTY_FINDER_API_URL=https://atlas.propertyfinder.com
PROPERTY_FINDER_WEBHOOK_SECRET=your_webhook_secret
```

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 4: Configure Webhook in PF Expert

1. Go to **Developer Resources** → **Webhooks**
2. Add webhook:
   - **Events:** `listing.published`, `listing.unpublished`, `listing.action`
   - **URL:** `https://your-domain.com/property-finder/webhook`
   - **Secret:** (optional) same as PROPERTY_FINDER_WEBHOOK_SECRET
3. Save

### Step 5: Test the Integration

**Manual Sync (first time):**

```bash
# Login as admin
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Sync all properties
curl -X POST http://localhost:5000/property-finder/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ How It Works

1. **You post property on Property Finder** → PF publishes it
2. **Property Finder sends webhook** → Your server receives it
3. **Property is created/updated** → Automatically in database
4. **Property appears on website** → Immediately visible!

## 📋 Available Endpoints

| Endpoint                    | Method | Access | Description          |
| --------------------------- | ------ | ------ | -------------------- |
| `/property-finder/webhook`  | POST   | Public | Receives webhooks    |
| `/property-finder/sync`     | POST   | Admin  | Sync all properties  |
| `/property-finder/sync/:id` | POST   | Admin  | Sync single property |
| `/property-finder/webhooks` | GET    | Admin  | List webhook subs    |
| `/property-finder/webhooks` | POST   | Admin  | Create webhook       |

## 🔍 Verify It's Working

Check backend console for:

```
Received Property Finder webhook: listing.published
Created new property from Property Finder: 507f1f77bcf86cd799439011
```

## 🆘 Troubleshooting

**Webhook not working?**

- Use ngrok: `ngrok http 5000`
- Check PF Expert webhook logs
- Verify API credentials

**Properties not syncing?**

- Ensure admin/agent user exists
- Check backend console for errors
- Try manual sync first

## 📚 Full Documentation

See [`PROPERTY_FINDER_INTEGRATION.md`](PROPERTY_FINDER_INTEGRATION.md)
