# Contact Form Email & WhatsApp Notifications Setup Guide

## Overview

The contact form now sends automatic email and WhatsApp notifications when users submit inquiries. You'll receive notifications via:

- **Email**: Professional HTML emails to admin and confirmation to user
- **WhatsApp**: Formatted messages via Twilio

## Installation ✅

Required packages have been installed:

- `nodemailer` - For email sending
- `twilio` - For WhatsApp notifications
- `@types/nodemailer` - TypeScript types

## Configuration

### 1. Email Setup (Gmail SMTP)

Update your `.env` file in the `backend/` directory:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@nhrealestate.qa
```

**Steps to get Gmail App Password:**

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to App passwords (search for it)
4. Select "Mail" and "Windows Computer"
5. Copy the generated 16-character password
6. Use this as `SMTP_PASSWORD`

### 2. WhatsApp Setup (Twilio)

Update your `.env` file:

```env
# WhatsApp/Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
ADMIN_WHATSAPP_NUMBER=+974XXXXXXXXX
```

**Steps to setup Twilio:**

1. Create account at https://www.twilio.com
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. Go to Messaging > Try it out > Send a WhatsApp message
5. Get your Twilio WhatsApp number (starts with +1)
6. Add your admin WhatsApp number (with country code)

## Features

### Email Notifications

- **Admin Email**: Receives detailed contact request with all form data
- **User Email**: Receives confirmation that their inquiry was received
- Professional HTML templates with company branding
- Automatic formatting of all form fields

### WhatsApp Notifications

- **Admin WhatsApp**: Receives formatted message with contact details
- **User WhatsApp**: Receives confirmation message (if phone provided)
- Emoji formatting for better readability
- Includes company contact information

## Frontend Changes

The Contact page now includes:

- Form submission to `/contactrequests` API endpoint
- Loading state with spinner animation
- Success/error message display
- Auto-clear form on successful submission
- Responsive error handling

## Backend Changes

### New Services Created:

- `backend/src/services/emailService.ts` - Email handling
- `backend/src/services/whatsappService.ts` - WhatsApp handling

### Updated Controller:

- `backend/src/controllers/contactRequestController.ts` - Sends notifications

## Testing

1. **Test Email:**
   - Fill out contact form
   - Check admin email inbox
   - Check user email inbox

2. **Test WhatsApp:**
   - Fill out contact form with phone number
   - Check admin WhatsApp
   - Check user WhatsApp (if number provided)

## Troubleshooting

**Emails not sending:**

- Verify SMTP credentials are correct
- Check Gmail allows "Less secure apps" or use App Password
- Check backend logs for errors

**WhatsApp not sending:**

- Verify Twilio credentials
- Ensure phone numbers include country code (+974 for Qatar)
- Check Twilio account has credits
- Verify WhatsApp numbers are registered with Twilio

**Form not submitting:**

- Check browser console for errors
- Verify API_URL is correct
- Check backend is running on correct port

## Notes

- Notifications are sent asynchronously (fire-and-forget)
- Form submission succeeds even if notifications fail
- All form data is stored in MongoDB
- Admin can view all contact requests in admin panel
