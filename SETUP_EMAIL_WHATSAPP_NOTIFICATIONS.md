# 📧💬 Email & WhatsApp Notifications Setup Guide

## ✅ Current Status

Your contact form is **FULLY IMPLEMENTED** and ready to send:

- ✅ Email notifications to admin
- ✅ Email confirmation to users
- ✅ WhatsApp notifications to admin
- ✅ WhatsApp confirmation to users

**All you need to do is configure the credentials!**

---

## 🚀 Quick Setup (Choose Your Method)

### Option 1: Gmail (Easiest - 5 minutes)

### Option 2: Other Email Provider (10 minutes)

### Option 3: WhatsApp via Twilio (15 minutes)

---

## 📧 STEP 1: Email Setup (Gmail)

### 1.1 Enable 2-Factor Authentication

1. Go to: https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled

### 1.2 Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** and **Windows Computer** (or Other)
3. Click **Generate**
4. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### 1.3 Update Backend Environment Variables

Open `backend/.env` file and add/update:

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
ADMIN_EMAIL=info@nandhrealestate.qa
```

**Replace:**

- `your_email@gmail.com` → Your Gmail address
- `abcdefghijklmnop` → The 16-character app password (remove spaces)
- `info@nandhrealestate.qa` → Email where you want to receive notifications

---

## 💬 STEP 2: WhatsApp Setup (Twilio)

### 2.1 Create Twilio Account

1. Go to: https://www.twilio.com/try-twilio
2. Sign up for a **FREE** account
3. Verify your phone number

### 2.2 Get WhatsApp Sandbox Access

1. In Twilio Console, go to: **Messaging** → **Try it out** → **Send a WhatsApp message**
2. Follow instructions to join the sandbox:
   - Send the code (e.g., "join <code>") to the Twilio WhatsApp number
   - You'll receive a confirmation message

### 2.3 Get Your Credentials

1. Go to Twilio Console Dashboard: https://console.twilio.com/
2. Copy these values:
   - **Account SID** (starts with AC...)
   - **Auth Token** (click to reveal)
3. Go to **Messaging** → **Try it out** → **Send a WhatsApp message**
   - Copy the **WhatsApp Sandbox Number** (e.g., +14155238886)

### 2.4 Update Backend Environment Variables

Open `backend/.env` file and add/update:

```env
# WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

**Replace:**

- `ACxxxxxxxx...` → Your Twilio Account SID
- `your_auth_token_here` → Your Twilio Auth Token
- `+14155238886` → Your Twilio WhatsApp Sandbox Number
- `+97470704504` → Your WhatsApp number (must join sandbox first!)

### 2.5 Important: Join Sandbox with Admin Number

**Before testing, you MUST:**

1. From your admin WhatsApp number (+97470704504)
2. Send the join code to the Twilio WhatsApp number
3. Wait for confirmation message

---

## 🧪 STEP 3: Test the Setup

### 3.1 Start the Backend

```bash
cd backend
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB connected
```

### 3.2 Start the Frontend

```bash
cd frontend
npm start
```

### 3.3 Test the Contact Form

1. Open browser: http://localhost:3000/contact
2. Fill out the form:
   - **Name:** Test User
   - **Email:** your_test_email@gmail.com
   - **Phone:** +97412345678 (use WhatsApp number for testing)
   - **Message:** This is a test message
3. Click **Submit**

### 3.4 Check Results

✅ **Frontend:** Should show success message  
✅ **Admin Email:** Check inbox for notification  
✅ **User Email:** Check test email inbox for confirmation  
✅ **Admin WhatsApp:** Check for notification message  
✅ **User WhatsApp:** Check for confirmation message (if phone provided)

---

## 🔍 Troubleshooting

### Email Not Working?

**Problem:** "Error sending email"
**Solutions:**

1. ✅ Check Gmail app password is correct (no spaces)
2. ✅ Verify 2-Factor Authentication is enabled
3. ✅ Try generating a new app password
4. ✅ Check SMTP_EMAIL matches the Gmail account
5. ✅ Ensure no firewall blocking port 587

**Problem:** "Invalid login"
**Solution:** You're using your regular password instead of app password

**Problem:** "Less secure app access"
**Solution:** Use App Password instead (see Step 1.2)

### WhatsApp Not Working?

**Problem:** "Twilio not configured"
**Solutions:**

1. ✅ Check all Twilio credentials are in `.env`
2. ✅ Verify Account SID starts with "AC"
3. ✅ Ensure no extra spaces in credentials

**Problem:** "WhatsApp numbers not configured"
**Solutions:**

1. ✅ Add TWILIO_WHATSAPP_NUMBER to `.env`
2. ✅ Add ADMIN_WHATSAPP_NUMBER to `.env`
3. ✅ Include country code (e.g., +974...)

**Problem:** "Message not delivered"
**Solutions:**

1. ✅ Join Twilio sandbox with admin number first
2. ✅ Send join code from WhatsApp to Twilio number
3. ✅ Wait for confirmation before testing
4. ✅ Check Twilio Console for error logs

**Problem:** "Free trial limitations"
**Solution:** Twilio free trial only sends to verified numbers. Add numbers in Twilio Console → Phone Numbers → Verified Caller IDs

---

## 📋 Complete .env Example

Here's what your `backend/.env` should look like:

```env
# Server Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/hnrealstate
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=30d

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# File Upload
MAX_FILE_SIZE=5000000
FILE_UPLOAD_PATH=./public/uploads

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=info@nandhrealestate.qa

# WhatsApp Configuration (Twilio)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

---

## 🎯 What Happens When User Submits Form?

### 1. Form Submission

- User fills contact form
- Frontend validates data
- Sends POST request to `/api/contactrequests`

### 2. Backend Processing

- Saves inquiry to MongoDB
- Triggers email notifications (async)
- Triggers WhatsApp notifications (async)
- Returns success response

### 3. Admin Receives

- 📧 **Email** with formatted inquiry details
- 💬 **WhatsApp** message with contact info
- 📊 Entry in admin panel

### 4. User Receives

- 📧 **Email** confirmation
- 💬 **WhatsApp** confirmation (if phone provided)
- ✅ Success message on screen

---

## 📱 Message Templates

### Admin Email Template

```
Subject: New Contact Request: [Subject/Name]

Contact Details:
- Name: [User Name]
- Email: [User Email]
- Phone: [User Phone]
- Subject: [Subject]
- Property Type: [Type]
- Budget: [Budget]

Message:
[User Message]
```

### User Email Template

```
Subject: We Received Your Inquiry - N&H Homes Real Estate

Dear [User Name],

Thank you for reaching out to N&H Homes Real Estate.
We have received your inquiry and will get back to you
within 24 hours.

Your Inquiry Details:
- Name: [User Name]
- Email: [User Email]
- Phone: [User Phone]

Best regards,
N&H Homes Real Estate Team
```

### Admin WhatsApp Template

```
📧 *New Contact Request*

👤 *Name:* [User Name]
📧 *Email:* [User Email]
📱 *Phone:* [User Phone]
📝 *Subject:* [Subject]
🏠 *Property Type:* [Type]
💰 *Budget:* [Budget]

💬 *Message:*
[User Message]

---
N&H Homes Real Estate
```

### User WhatsApp Template

```
👋 *Thank you for contacting N&H Homes Real Estate!*

We have received your inquiry and will get back to you
within 24 hours.

If urgent, call us at:
📞 +974 7070 4504

Best regards,
N&H Homes Real Estate Team
🏢 Doha, Qatar
```

---

## 🔐 Security Best Practices

1. ✅ **Never commit `.env` file** to Git
2. ✅ Use **App Passwords**, not regular passwords
3. ✅ Keep **Twilio credentials** secret
4. ✅ Rotate credentials periodically
5. ✅ Use environment variables in production
6. ✅ Enable rate limiting for contact form

---

## 🚀 Production Deployment

### Environment Variables for Production

When deploying to production (Heroku, AWS, etc.), set these environment variables:

```bash
# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_production_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=info@nandhrealestate.qa

# WhatsApp (Upgrade to paid Twilio account for production)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

### Twilio Production Setup

For production, you need to:

1. Upgrade Twilio account (paid)
2. Request WhatsApp Business API access
3. Get approved WhatsApp Business number
4. Update TWILIO_WHATSAPP_NUMBER

**Note:** Sandbox is only for testing. For production, you need approved WhatsApp Business API.

---

## 📊 Monitoring & Logs

### Check Backend Logs

```bash
cd backend
npm run dev
```

Look for:

- ✅ `Admin notification email sent: [messageId]`
- ✅ `User confirmation email sent: [messageId]`
- ✅ `WhatsApp notification sent to admin: [sid]`
- ✅ `WhatsApp confirmation sent to user: [sid]`

### Check Twilio Logs

1. Go to: https://console.twilio.com/
2. Navigate to **Monitor** → **Logs** → **Messaging**
3. View delivery status of WhatsApp messages

---

## 💡 Tips & Best Practices

1. **Test with Real Data:** Use actual email and WhatsApp numbers
2. **Check Spam Folder:** First emails might go to spam
3. **Verify Numbers:** Add test numbers to Twilio verified list
4. **Monitor Costs:** Twilio charges per message (check pricing)
5. **Rate Limiting:** Consider adding rate limiting to prevent spam
6. **Backup:** Keep admin email as backup if WhatsApp fails

---

## 📞 Need Help?

### Quick Checks

- [ ] Backend server running?
- [ ] MongoDB connected?
- [ ] `.env` file configured?
- [ ] Gmail app password generated?
- [ ] Twilio sandbox joined?
- [ ] Admin WhatsApp number verified?

### Still Having Issues?

1. Check backend console for error messages
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test email separately using nodemailer test
5. Test WhatsApp separately using Twilio console

---

## ✅ Success Checklist

- [ ] Gmail app password generated
- [ ] Email credentials added to `.env`
- [ ] Twilio account created
- [ ] Twilio credentials added to `.env`
- [ ] Admin WhatsApp joined sandbox
- [ ] Backend server started successfully
- [ ] Frontend running
- [ ] Test form submission successful
- [ ] Admin email received
- [ ] User email received
- [ ] Admin WhatsApp received
- [ ] User WhatsApp received (if phone provided)

---

## 🎉 You're All Set!

Once configured, your contact form will automatically:

- ✅ Send professional emails
- ✅ Send WhatsApp notifications
- ✅ Store inquiries in database
- ✅ Provide user feedback
- ✅ Work in multiple languages

**No code changes needed - just configure and test!**

---

**Last Updated:** February 2026  
**Status:** ✅ Fully Implemented & Ready to Configure
