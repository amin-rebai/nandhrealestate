# Property Finder Enterprise API Integration Guide

This guide explains how to integrate your website with the Property Finder Enterprise API to automatically sync properties.

## Overview

The Property Finder integration allows you to:

- Automatically receive properties posted on Property Finder via webhooks
- Sync properties in real-time when they're published/unpublished
- Manually sync all properties or individual properties
- Keep your website updated with Property Finder listings

## API Documentation

Based on: https://api-docs.propertyfinder.net/enterprise-api/index.html

**Base URL:** `https://atlas.propertyfinder.com`

### Authentication

The API uses OAuth 2.0 with JWT tokens:

1. Exchange API Key + API Secret for access token
2. Use the token in Authorization header
3. Token expires in 30 minutes

### Required Scopes

- `listings:read` - Read listings
- `listings:full_access` - Create/Update/Delete listings
- `webhooks:full_access` - Manage webhooks
- `users:read` - Read users
- `leads:read` - Read leads

## Setup Instructions

### 1. Get Property Finder API Credentials

1. Log in to **PF Expert** application
2. Navigate to **Developer Resources** → **API Credentials**
3. Create new API key with type **API Integration**
4. Enable required scopes:
   - `listings:read`
   - `listings:full_access` (for webhook setup)
   - `webhooks:full_access`
5. Note down:
   - API Key
   - API Secret
   - Generate API key (expires in max 365 days)

### 2. Configure Backend Environment Variables

Add the following to your [`backend/.env`](backend/.env) file:

```env
# Property Finder Enterprise API settings
PROPERTY_FINDER_API_KEY=your_property_finder_api_key
PROPERTY_FINDER_API_SECRET=your_property_finder_api_secret
PROPERTY_FINDER_API_URL=https://atlas.propertyfinder.com
PROPERTY_FINDER_WEBHOOK_SECRET=your_webhook_secret_for_verification
```

### 3. Configure Webhook in Property Finder

1. Log in to PF Expert dashboard
2. Navigate to **Developer Resources** → **Webhooks**
3. Add new webhook subscription:
   - **Event ID:** `listing.published`, `listing.unpublished`, `listing.action`
   - **URL:** `https://your-domain.com/property-finder/webhook`
   - **Secret:** (optional) Your webhook secret for signature verification

## API Endpoints

### 1. Webhook Endpoint (Automatic Sync)

**Endpoint:** `POST /property-finder/webhook`

**Access:** Public (verified by signature if secret configured)

**Description:** Receives webhook notifications from Property Finder when listings are published, unpublished, or have compliance actions.

**Webhook Events:**

- `listing.published` - New listing published on Property Finder
- `listing.unpublished` - Listing unpublished
- `listing.action` - Compliance action (permit issues, verification, etc.)

**Example Webhook Payload:**

```json
{
  "eventId": "listing.published",
  "eventType": "listing.published",
  "timestamp": "2026-02-13T12:00:00Z",
  "data": {
    "listing": {
      "id": 12345,
      "reference": "PF-12345",
      "title": "Luxury Apartment in West Bay",
      "description": "Beautiful 2-bedroom apartment...",
      "price": 500000,
      "currency": "QAR",
      "propertyType": "apartment",
      "listingType": "sale",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200,
      "location": {
        "id": 50,
        "name": "West Bay"
      },
      "images": [
        {
          "original": {
            "url": "https://..."
          }
        }
      ],
      "status": "active"
    }
  }
}
```

### 2. Manual Sync All Properties

**Endpoint:** `POST /property-finder/sync`

**Access:** Private (Admin only)

**Description:** Manually sync all active properties from Property Finder.

**Request:**

```bash
curl -X POST https://your-domain.com/property-finder/sync \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

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

### 3. Manual Sync Single Property

**Endpoint:** `POST /property-finder/sync/:identifier`

**Access:** Private (Admin only)

**Description:** Sync a specific property by ID or reference number.

**Request:**

```bash
curl -X POST https://your-domain.com/property-finder/sync/12345 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Or by reference number
curl -X POST https://your-domain.com/property-finder/sync/PF-12345 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 4. Get Webhook Subscriptions

**Endpoint:** `GET /property-finder/webhooks`

**Access:** Private (Admin only)

### 5. Create Webhook Subscription

**Endpoint:** `POST /property-finder/webhooks`

**Access:** Private (Admin only)

**Request Body:**

```json
{
  "eventId": "listing.published",
  "url": "https://your-domain.com/property-finder/webhook",
  "secret": "your_secret"
}
```

## Property Type Mapping

| Property Finder Type | Local Property Type |
| -------------------- | ------------------- |
| apartment            | Apartment           |
| villa                | Villa               |
| townhouse            | Townhouse           |
| penthouse            | Penthouse           |
| duplex               | Duplex              |
| studio               | Studio              |
| hotel-apartment      | Hotel Apartment     |
| bungalow             | Standalone Villa    |
| compound             | Compound Villa      |
| whole-building       | Whole Building      |
| office-space         | Office              |
| shop                 | Shop                |
| show-room            | Showroom            |
| warehouse            | Warehouse           |
| factory              | Factory             |
| labor-camp           | Labor Camp          |
| land                 | Land                |

## Qatar-Specific Property Types

**Residential:**

- apartment
- compound
- duplex
- hotel-apartment
- penthouse
- townhouse
- villa
- whole-building

**Commercial:**

- bulk-rent-unit
- bulk-sale-unit
- labor-camp
- office-space
- retail
- shop
- show-room
- staff-accommodation
- villa
- warehouse
- whole-building

**Land:**

- land

## Testing the Integration

### 1. Test Webhook Locally

Use ngrok to expose your local server:

```bash
# Install ngrok
npm install -g ngrok

# Expose your local server
ngrok http 5000

# Use the ngrok URL in Property Finder webhook settings
# Example: https://abc123.ngrok.io/property-finder/webhook
```

### 2. Test Manual Sync

```bash
# Login as admin to get token
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"your_password"}'

# Use the token to sync properties
curl -X POST http://localhost:5000/property-finder/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Workflow

### Automatic Sync (Recommended)

1. You post a property on Property Finder
2. Property Finder processes and publishes the listing
3. Property Finder sends webhook to your server
4. Your server receives webhook and verifies signature
5. Property is automatically created/updated in your database
6. Property appears on your website immediately

### Manual Sync

1. Admin triggers manual sync via API
2. System fetches all active listings from Property Finder
3. Listings are created/updated in bulk
4. Properties appear on your website

## Security

- Webhook requests can be verified using HMAC-SHA256 signature
- Manual sync endpoints require admin authentication
- API credentials are stored securely in environment variables
- Access tokens expire in 30 minutes (auto-refreshed)
- Never commit `.env` file to version control

## Rate Limits

- **Token endpoint:** 60 requests per minute
- **All other endpoints:** 650 requests per minute

## Troubleshooting

### Webhook Not Receiving Data

1. Check webhook URL is publicly accessible
2. Verify API credentials are correct
3. Check backend console for error messages
4. Verify webhook is configured in PF Expert

### Properties Not Syncing

1. Ensure API credentials are correct
2. Check at least one admin/agent user exists
3. Check backend console for errors
4. Try manual sync first

### Duplicate Properties

Properties are identified by `propertyFinderRefId` (listing ID). If a listing with the same ID exists, it will be updated.

## What's Next?

- [ ] Add manual sync button in admin panel UI
- [ ] Set up email/WhatsApp notifications for new properties
- [ ] Implement local image hosting
- [ ] Add sync status monitoring in admin panel

## Support

For Property Finder API documentation:
https://api-docs.propertyfinder.net/enterprise-api/index.html

For integration support:
integration.support@propertyfinder.ae
