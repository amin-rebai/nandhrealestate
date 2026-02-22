# 📊 Contact Form Notification Flow

## 🔄 Complete Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER SUBMITS FORM                        │
│                     (Contact Page - Frontend)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND VALIDATION                           │
│  • Name, Email, Message required                                │
│  • Email format check                                            │
│  • Phone format check (optional)                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  POST /api/contactrequests                      │
│                    (Backend API Call)                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BACKEND: contactRequestController.ts                │
│  1. Validate data                                                │
│  2. Save to MongoDB                                              │
│  3. Trigger notifications (async)                                │
└────────────────────────────┬────────────────────────────────────┘
                             │
                ┌────────────┴────────────┐
                ▼                         ▼
┌───────────────────────────┐  ┌──────────────────────────┐
│   EMAIL NOTIFICATIONS     │  │  WHATSAPP NOTIFICATIONS  │
│   (emailService.ts)       │  │  (whatsappService.ts)    │
└───────────┬───────────────┘  └──────────┬───────────────┘
            │                              │
    ┌───────┴────────┐          ┌─────────┴──────────┐
    ▼                ▼          ▼                    ▼
┌────────┐      ┌────────┐  ┌────────┐         ┌────────┐
│ Admin  │      │  User  │  │ Admin  │         │  User  │
│ Email  │      │ Email  │  │WhatsApp│         │WhatsApp│
└────────┘      └────────┘  └────────┘         └────────┘
```

---

## 📝 Detailed Step-by-Step Flow

### 1️⃣ User Action

```
User fills contact form:
├── Name: John Doe
├── Email: john@example.com
├── Phone: +97412345678
├── Subject: Property Inquiry
├── Property Type: Residential - Sale
├── Budget: QAR500K - QAR1M
└── Message: I'm interested in...
```

### 2️⃣ Frontend Processing

```javascript
// Contact.tsx
handleSubmit() {
  ├── Validate form data
  ├── Show loading state
  ├── POST to /api/contactrequests
  └── Handle response
      ├── Success: Show success message
      └── Error: Show error message
}
```

### 3️⃣ Backend Processing

```javascript
// contactRequestController.ts
createContactRequest() {
  ├── Validate required fields
  ├── Save to MongoDB
  │   └── Status: 'new'
  ├── Prepare notification data
  └── Trigger notifications (async)
      ├── sendAdminNotificationEmail()
      ├── sendUserConfirmationEmail()
      ├── sendAdminWhatsAppNotification()
      └── sendUserWhatsAppConfirmation()
}
```

### 4️⃣ Email Service

```javascript
// emailService.ts
sendAdminNotificationEmail() {
  ├── Create nodemailer transporter
  ├── Build HTML email template
  ├── Send to ADMIN_EMAIL
  └── Log result
}

sendUserConfirmationEmail() {
  ├── Create nodemailer transporter
  ├── Build HTML confirmation template
  ├── Send to user's email
  └── Log result
}
```

### 5️⃣ WhatsApp Service

```javascript
// whatsappService.ts
sendAdminWhatsAppNotification() {
  ├── Initialize Twilio client
  ├── Format message with inquiry details
  ├── Send to ADMIN_WHATSAPP_NUMBER
  └── Log result
}

sendUserWhatsAppConfirmation() {
  ├── Initialize Twilio client
  ├── Format confirmation message
  ├── Send to user's phone (if provided)
  └── Log result
}
```

---

## 📧 Email Templates

### Admin Email

```
┌─────────────────────────────────────────┐
│     New Contact Request                 │
│     N&H Homes Real Estate               │
├─────────────────────────────────────────┤
│                                         │
│  Contact Details                        │
│  ────────────────                       │
│  Name:          John Doe                │
│  Email:         john@example.com        │
│  Phone:         +97412345678            │
│  Subject:       Property Inquiry        │
│  Property Type: Residential - Sale      │
│  Budget:        QAR500K - QAR1M         │
│                                         │
│  Message                                │
│  ────────                               │
│  I'm interested in purchasing a         │
│  residential property in Doha...        │
│                                         │
└─────────────────────────────────────────┘
```

### User Confirmation Email

```
┌─────────────────────────────────────────┐
│  Thank You for Contacting Us            │
│  N&H Homes Real Estate                  │
├─────────────────────────────────────────┤
│                                         │
│  Dear John Doe,                         │
│                                         │
│  Thank you for reaching out to N&H      │
│  Homes Real Estate. We have received    │
│  your inquiry and will get back to you  │
│  within 24 hours.                       │
│                                         │
│  Your Inquiry Details                   │
│  ────────────────────                   │
│  Name:    John Doe                      │
│  Email:   john@example.com              │
│  Phone:   +97412345678                  │
│  Subject: Property Inquiry              │
│                                         │
│  Best regards,                          │
│  N&H Homes Real Estate Team             │
│  Doha, Qatar                            │
│                                         │
└─────────────────────────────────────────┘
```

---

## 💬 WhatsApp Templates

### Admin WhatsApp

```
📧 *New Contact Request*

👤 *Name:* John Doe
📧 *Email:* john@example.com
📱 *Phone:* +97412345678
📝 *Subject:* Property Inquiry
🏠 *Property Type:* Residential - Sale
💰 *Budget:* QAR500K - QAR1M

💬 *Message:*
I'm interested in purchasing a
residential property in Doha...

---
N&H Homes Real Estate
```

### User WhatsApp

```
👋 *Thank you for contacting N&H Homes Real Estate!*

We have received your inquiry and will get back
to you as soon as possible, typically within 24 hours.

If your matter is urgent, please call us at:
📞 +974 7070 4504

Best regards,
N&H Homes Real Estate Team
🏢 Doha, Qatar
```

---

## 🔧 Configuration Required

### Environment Variables (backend/.env)

```env
# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
ADMIN_EMAIL=info@nandhrealestate.qa

# WhatsApp Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

---

## ⚡ Async Processing

All notifications are sent asynchronously (fire and forget):

```javascript
// Non-blocking notifications
Promise.all([
  sendAdminNotificationEmail(data),
  sendUserConfirmationEmail(data),
]).catch((error) => {
  console.error("Error sending emails:", error);
});

Promise.all([
  sendAdminWhatsAppNotification(data),
  sendUserWhatsAppConfirmation(data),
]).catch((error) => {
  console.error("Error sending WhatsApp:", error);
});

// Response sent immediately
return res.status(201).json({
  success: true,
  message: "Contact request received!",
});
```

**Benefits:**

- ✅ Fast response to user
- ✅ No blocking if email/WhatsApp fails
- ✅ Better user experience
- ✅ Errors logged but don't break flow

---

## 📊 Database Storage

### MongoDB Collection: contactrequests

```javascript
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  phone: "+97412345678",
  subject: "Property Inquiry",
  message: "I'm interested in...",
  status: "new",
  createdAt: ISODate("2026-02-10T13:00:00Z"),
  updatedAt: ISODate("2026-02-10T13:00:00Z")
}
```

**Status Values:**

- `new` - Just submitted
- `in-progress` - Being handled
- `resolved` - Completed
- `closed` - Archived

---

## 🎯 Success Indicators

### Frontend

```
✅ Form submitted successfully
✅ Success message displayed
✅ Form fields cleared
✅ No errors in console
```

### Backend Logs

```
✅ Contact request saved to MongoDB
✅ Admin notification email sent: [messageId]
✅ User confirmation email sent: [messageId]
✅ WhatsApp notification sent to admin: [sid]
✅ WhatsApp confirmation sent to user: [sid]
```

### Admin Receives

```
✅ Email in inbox
✅ WhatsApp message received
✅ Entry visible in admin panel
```

### User Receives

```
✅ Confirmation email in inbox
✅ WhatsApp confirmation (if phone provided)
✅ Success message on screen
```

---

## 🚨 Error Handling

### Email Fails

```
❌ Email error logged
✅ WhatsApp still sent
✅ Data still saved to DB
✅ User still sees success
```

### WhatsApp Fails

```
❌ WhatsApp error logged
✅ Email still sent
✅ Data still saved to DB
✅ User still sees success
```

### Both Fail

```
❌ Errors logged
✅ Data still saved to DB
✅ User still sees success
✅ Admin can check DB
```

**Philosophy:** Never fail the user submission due to notification issues.

---

## 📈 Monitoring

### Check Logs

```bash
cd backend
npm run dev

# Watch for:
# ✅ "Admin notification email sent"
# ✅ "User confirmation email sent"
# ✅ "WhatsApp notification sent to admin"
# ✅ "WhatsApp confirmation sent to user"
```

### Check Twilio Console

```
https://console.twilio.com/
→ Monitor → Logs → Messaging
→ View delivery status
```

### Check MongoDB

```javascript
// Connect to MongoDB
use hnrealstate

// View recent submissions
db.contactrequests.find().sort({createdAt: -1}).limit(10)
```

---

## 🎉 Summary

**What's Implemented:**

- ✅ Contact form with validation
- ✅ Email notifications (admin + user)
- ✅ WhatsApp notifications (admin + user)
- ✅ MongoDB storage
- ✅ Error handling
- ✅ Async processing
- ✅ Professional templates
- ✅ Multi-language support

**What You Need to Do:**

1. Configure Gmail app password
2. Configure Twilio credentials
3. Test the form

**Time Required:** 15 minutes

---

**See [`SETUP_EMAIL_WHATSAPP_NOTIFICATIONS.md`](SETUP_EMAIL_WHATSAPP_NOTIFICATIONS.md) for setup instructions.**
