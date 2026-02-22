# Quick Start Guide - Contact Form Notifications

## ⚡ 5-Minute Setup

### Step 1: Get Gmail App Password (2 minutes)

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication (if not already enabled)
3. Search for "App passwords"
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password

### Step 2: Configure Email (1 minute)

Edit `backend/.env`:

```env
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=paste_16_char_password_here
ADMIN_EMAIL=admin@nandhrealestate.qa
```

### Step 3: Get Twilio Credentials (2 minutes)

1. Create account at https://www.twilio.com
2. Go to Console Dashboard
3. Copy Account SID and Auth Token
4. Go to Messaging > Try it out > Send a WhatsApp message
5. Get your Twilio WhatsApp number

### Step 4: Configure WhatsApp (1 minute)

Edit `backend/.env`:

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+1234567890
ADMIN_WHATSAPP_NUMBER=+974XXXXXXXXX
```

## ✅ Test It

1. Start backend: `npm run dev` (in backend folder)
2. Start frontend: `npm start` (in frontend folder)
3. Go to Contact page
4. Fill out form and submit
5. Check your email and WhatsApp!

## 📁 What Was Added

**Backend:**

- `src/services/emailService.ts` - Email handling
- `src/services/whatsappService.ts` - WhatsApp handling

**Frontend:**

- Updated Contact.tsx with form submission

**Config:**

- `.env.template` - Environment variables reference
- Updated `.env.example`

## 🎯 Features

✅ Admin gets email with all details  
✅ User gets confirmation email  
✅ Admin gets WhatsApp message  
✅ User gets WhatsApp confirmation  
✅ Form shows loading state  
✅ Success/error messages  
✅ Auto-clear form on success

## 🆘 Troubleshooting

**Emails not working?**

- Check SMTP credentials
- Verify Gmail allows app access
- Check backend logs

**WhatsApp not working?**

- Verify Twilio credentials
- Check phone numbers have country code
- Ensure Twilio account has credits

**Form not submitting?**

- Check browser console
- Verify backend is running
- Check API_URL is correct

## 📚 Full Documentation

- `CONTACT_FORM_SETUP.md` - Detailed setup
- `IMPLEMENTATION_CHECKLIST.md` - Complete checklist
- `CONTACT_FORM_SUMMARY.md` - Feature overview

## 🚀 You're Done!

Your contact form now sends automatic notifications. Users will receive:

- Professional email confirmation
- WhatsApp message (if phone provided)

And you'll receive:

- Detailed email with all inquiry info
- WhatsApp notification for quick response
