# ⚡ Quick Setup - Contact Form Notifications

## 🎯 Goal

Enable email and WhatsApp notifications when users submit the contact form.

## ✅ Status: ALREADY IMPLEMENTED!

All code is ready. You just need to configure credentials.

---

## 📧 Email Setup (5 minutes)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Generate password for "Mail"
3. Copy the 16-character code

### Step 2: Update backend/.env

```env
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=info@nandhrealestate.qa
```

---

## 💬 WhatsApp Setup (10 minutes)

### Step 1: Create Twilio Account

1. Sign up: https://www.twilio.com/try-twilio
2. Get Account SID and Auth Token from dashboard

### Step 2: Join WhatsApp Sandbox

1. Go to: Messaging → Try it out → Send a WhatsApp message
2. Send join code from your WhatsApp to Twilio number
3. Wait for confirmation

### Step 3: Update backend/.env

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

---

## 🧪 Test

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm start

# Browser
http://localhost:3000/contact
# Fill form and submit
```

---

## ✅ What You'll Receive

When a user submits the contact form:

### Admin Gets:

- 📧 Email with inquiry details
- 💬 WhatsApp notification

### User Gets:

- 📧 Confirmation email
- 💬 WhatsApp confirmation (if phone provided)

---

## 🔍 Troubleshooting

### Email not working?

- ✅ Use App Password, not regular password
- ✅ Enable 2-Factor Authentication first
- ✅ Check spam folder

### WhatsApp not working?

- ✅ Join sandbox with admin number first
- ✅ Verify all Twilio credentials
- ✅ Check Twilio Console logs

---

## 📁 Files Involved

### Backend

- `backend/src/services/emailService.ts` - Email logic
- `backend/src/services/whatsappService.ts` - WhatsApp logic
- `backend/src/controllers/contactRequestController.ts` - Main controller
- `backend/.env` - Configuration

### Frontend

- `frontend/src/pages/Contact.tsx` - Contact form

---

## 🎉 That's It!

No code changes needed. Just:

1. Configure Gmail app password
2. Configure Twilio credentials
3. Test the form

**See [`SETUP_EMAIL_WHATSAPP_NOTIFICATIONS.md`](SETUP_EMAIL_WHATSAPP_NOTIFICATIONS.md) for detailed guide.**

---

**Status:** ✅ Ready to Configure  
**Time Required:** 15 minutes  
**Difficulty:** Easy
