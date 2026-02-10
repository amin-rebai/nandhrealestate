# 🚀 Production Deployment Guide - Contact Notifications

## ✅ Issue Fixed

The contact form error "Failed to send message. Please try again." has been fixed by:

1. ✅ Correcting API endpoint from `/contactrequests` to `/contact-requests`
2. ✅ Uncommenting email and WhatsApp notification code
3. ✅ Adding better error handling

## 🔧 Files Modified

- [`backend/src/server.ts`](backend/src/server.ts:56) - Fixed route path
- [`frontend/src/pages/Contact.tsx`](frontend/src/pages/Contact.tsx:86) - Fixed API endpoint
- [`backend/src/controllers/contactRequestController.ts`](backend/src/controllers/contactRequestController.ts:88) - Enabled notifications

---

## 📋 Production Deployment Checklist

### 1. Environment Variables

Make sure these are set in your production environment:

```env
# Server Configuration
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d

# CORS - Add your production domains
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://admin.yourdomain.com

# Email Configuration (REQUIRED for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_EMAIL=your_production_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
ADMIN_EMAIL=info@nhrealestate.qa

# WhatsApp Configuration (REQUIRED for notifications)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_production_auth_token
TWILIO_WHATSAPP_NUMBER=+14155238886
ADMIN_WHATSAPP_NUMBER=+97470704504
```

---

## 📧 Email Setup for Production

### Option 1: Gmail (Recommended for Small Scale)

1. **Create a dedicated Gmail account** for your business
   - Example: `notifications@nhrealestate.qa` (use Gmail)

2. **Enable 2-Factor Authentication**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

3. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "N&H Real Estate Production"
   - Copy the 16-character password

4. **Set Environment Variables**
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_EMAIL=notifications@gmail.com
   SMTP_PASSWORD=abcdefghijklmnop
   ADMIN_EMAIL=info@nhrealestate.qa
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Create SendGrid Account**
   - Go to: https://sendgrid.com
   - Sign up for free (100 emails/day) or paid plan

2. **Create API Key**
   - Go to Settings → API Keys
   - Create API Key with "Mail Send" permissions
   - Copy the API key

3. **Update Email Service**

   ```typescript
   // backend/src/services/emailService.ts
   const createTransporter = () => {
     return nodemailer.createTransporter({
       host: "smtp.sendgrid.net",
       port: 587,
       auth: {
         user: "apikey",
         pass: process.env.SENDGRID_API_KEY,
       },
     });
   };
   ```

4. **Set Environment Variables**
   ```env
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_EMAIL=noreply@nhrealestate.qa
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ADMIN_EMAIL=info@nhrealestate.qa
   ```

### Option 3: AWS SES (Recommended for Large Scale)

1. **Set up AWS SES**
   - Go to AWS Console → SES
   - Verify your domain
   - Request production access

2. **Get SMTP Credentials**
   - Go to SMTP Settings
   - Create SMTP Credentials
   - Copy username and password

3. **Set Environment Variables**
   ```env
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com
   SMTP_PORT=587
   SMTP_EMAIL=noreply@nhrealestate.qa
   SMTP_PASSWORD=your_ses_smtp_password
   ADMIN_EMAIL=info@nhrealestate.qa
   ```

---

## 💬 WhatsApp Setup for Production

### Important: Twilio Sandbox vs Production

**Sandbox (Testing Only):**

- ✅ Free
- ❌ Users must join sandbox first
- ❌ Not suitable for production
- ❌ Limited to verified numbers

**Production (Required for Live Site):**

- ✅ Works with any WhatsApp number
- ✅ Professional experience
- ❌ Requires paid Twilio account
- ❌ Requires WhatsApp Business API approval

### Production Setup Steps

1. **Upgrade Twilio Account**
   - Go to: https://console.twilio.com/
   - Add payment method
   - Upgrade from trial to paid account

2. **Request WhatsApp Business API Access**
   - Go to: Messaging → Try it out → Request Access
   - Fill out business information
   - Wait for approval (can take 1-3 days)

3. **Get WhatsApp Business Number**
   - Once approved, you'll get a WhatsApp Business number
   - This replaces the sandbox number

4. **Update Environment Variables**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_production_auth_token
   TWILIO_WHATSAPP_NUMBER=+14155238886  # Your approved number
   ADMIN_WHATSAPP_NUMBER=+97470704504
   ```

### Alternative: Disable WhatsApp for Now

If you want to launch without WhatsApp:

1. **Comment out WhatsApp code** in [`backend/src/controllers/contactRequestController.ts`](backend/src/controllers/contactRequestController.ts:96):

   ```typescript
   // Send WhatsApp notifications (fire and forget - don't block response)
   // Promise.all([
   //   sendAdminWhatsAppNotification(notificationData),
   //   sendUserWhatsAppConfirmation(notificationData)
   // ]).catch(error => {
   //   console.error('Error sending WhatsApp messages:', error);
   // });
   ```

2. **Update success message** in [`frontend/src/pages/Contact.tsx`](frontend/src/pages/Contact.tsx:99):
   ```typescript
   message: "Thank you for your inquiry! We will contact you soon. Check your email for confirmation.";
   ```

---

## 🌐 Deployment Platforms

### Heroku

1. **Set Environment Variables**

   ```bash
   heroku config:set SMTP_EMAIL=your_email@gmail.com
   heroku config:set SMTP_PASSWORD=your_app_password
   heroku config:set ADMIN_EMAIL=info@nhrealestate.qa
   heroku config:set TWILIO_ACCOUNT_SID=ACxxxxxxxx
   heroku config:set TWILIO_AUTH_TOKEN=your_token
   heroku config:set TWILIO_WHATSAPP_NUMBER=+14155238886
   heroku config:set ADMIN_WHATSAPP_NUMBER=+97470704504
   ```

2. **Deploy**
   ```bash
   git push heroku main
   ```

### AWS (EC2, Elastic Beanstalk)

1. **Create `.env` file on server**

   ```bash
   sudo nano /var/app/current/.env
   ```

2. **Add environment variables**

   ```env
   SMTP_EMAIL=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   ADMIN_EMAIL=info@nhrealestate.qa
   TWILIO_ACCOUNT_SID=ACxxxxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_WHATSAPP_NUMBER=+14155238886
   ADMIN_WHATSAPP_NUMBER=+97470704504
   ```

3. **Restart application**
   ```bash
   pm2 restart all
   ```

### DigitalOcean

1. **Set environment variables in App Platform**
   - Go to Settings → Environment Variables
   - Add each variable

2. **Or use `.env` file**
   ```bash
   cd /var/www/your-app
   nano .env
   # Add variables
   pm2 restart all
   ```

### Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**

```bash
# Set API URL
vercel env add REACT_APP_API_URL
# Enter: https://your-backend-url.com
```

**Backend (Railway/Render):**

- Add environment variables in dashboard
- Or use `.env` file

---

## 🧪 Testing in Production

### 1. Test Email Notifications

```bash
# Send test email using curl
curl -X POST https://your-api-url.com/contact-requests \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+97412345678",
    "subject": "Test Inquiry",
    "message": "This is a test message"
  }'
```

**Check:**

- ✅ Admin email received
- ✅ User confirmation email received
- ✅ No errors in server logs

### 2. Test WhatsApp Notifications

**Check:**

- ✅ Admin WhatsApp message received
- ✅ User WhatsApp confirmation received (if phone provided)
- ✅ Check Twilio Console for delivery status

### 3. Test Contact Form

1. Go to: https://your-domain.com/contact
2. Fill out form
3. Submit
4. Verify:
   - ✅ Success message shown
   - ✅ Form cleared
   - ✅ Email received
   - ✅ WhatsApp received
   - ✅ Entry in admin panel

---

## 🔍 Troubleshooting Production Issues

### Issue: "Failed to send message"

**Check:**

1. ✅ Backend server is running
2. ✅ MongoDB is connected
3. ✅ CORS is configured correctly
4. ✅ API endpoint is correct (`/contact-requests`)
5. ✅ Check server logs for errors

**Solution:**

```bash
# Check backend logs
pm2 logs
# or
heroku logs --tail
# or
docker logs your-container
```

### Issue: Email not sending

**Check:**

1. ✅ SMTP credentials are correct
2. ✅ SMTP_EMAIL and SMTP_PASSWORD are set
3. ✅ Gmail app password (not regular password)
4. ✅ Check spam folder

**Solution:**

```bash
# Test SMTP connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_app_password'
  }
});
transporter.verify((error, success) => {
  if (error) console.log('Error:', error);
  else console.log('SMTP connection successful');
});
"
```

### Issue: WhatsApp not sending

**Check:**

1. ✅ Twilio credentials are correct
2. ✅ WhatsApp Business API is approved
3. ✅ Not using sandbox number in production
4. ✅ Phone numbers include country code

**Solution:**

- Check Twilio Console → Monitor → Logs → Messaging
- Verify WhatsApp Business API status
- Ensure account has sufficient balance

### Issue: CORS errors

**Check:**

1. ✅ Frontend domain is in CORS_ORIGINS
2. ✅ Include protocol (https://)
3. ✅ No trailing slashes

**Solution:**

```env
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 📊 Monitoring

### 1. Set Up Logging

**Option 1: PM2 Logs**

```bash
pm2 logs
pm2 logs --lines 100
```

**Option 2: Winston Logger**

```bash
npm install winston
```

### 2. Monitor Email Delivery

- Check Gmail Sent folder
- Monitor bounce rates
- Set up email delivery notifications

### 3. Monitor WhatsApp Delivery

- Twilio Console → Monitor → Logs
- Set up delivery webhooks
- Monitor message status

### 4. Set Up Alerts

**Email Alerts:**

- Set up Gmail filters for bounce notifications
- Monitor SMTP errors

**WhatsApp Alerts:**

- Configure Twilio webhooks
- Monitor delivery failures

---

## 🔐 Security Best Practices

### 1. Environment Variables

✅ **Never commit `.env` to Git**

```bash
# Add to .gitignore
.env
.env.local
.env.production
```

✅ **Use strong passwords**

- JWT_SECRET: 32+ characters
- SMTP_PASSWORD: App password, not regular password

✅ **Rotate credentials regularly**

- Change passwords every 90 days
- Regenerate API keys periodically

### 2. Rate Limiting

Add rate limiting to prevent spam:

```typescript
// backend/src/server.ts
import rateLimit from "express-rate-limit";

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per 15 minutes
  message: "Too many contact requests, please try again later.",
});

app.use("/contact-requests", contactLimiter, contactRequestRoutes);
```

### 3. Input Validation

Already implemented in controller:

- ✅ Required fields validation
- ✅ Email format validation
- ✅ Error handling

---

## 📈 Performance Optimization

### 1. Async Notifications

Already implemented - notifications don't block response:

```typescript
// Fire and forget
Promise.all([...]).catch(error => console.error(error));
```

### 2. Database Indexing

Add indexes for better performance:

```typescript
// backend/src/models/ContactRequest.ts
contactRequestSchema.index({ createdAt: -1 });
contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ email: 1 });
```

### 3. Caching

Consider caching contact page content:

```typescript
// Use Redis or in-memory cache
```

---

## ✅ Production Checklist

### Before Launch

- [ ] Environment variables configured
- [ ] Email service tested
- [ ] WhatsApp service tested (or disabled)
- [ ] CORS configured correctly
- [ ] MongoDB connected
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Rate limiting enabled
- [ ] Error logging set up
- [ ] Monitoring configured

### After Launch

- [ ] Test contact form submission
- [ ] Verify email delivery
- [ ] Verify WhatsApp delivery
- [ ] Check admin panel
- [ ] Monitor server logs
- [ ] Set up alerts
- [ ] Document any issues
- [ ] Train team on admin panel

---

## 🆘 Support

### Quick Fixes

**Email not working?**

```bash
# Use Gmail with app password
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_char_app_password
```

**WhatsApp not working?**

```bash
# Disable for now, enable later
# Comment out WhatsApp code in controller
```

**CORS errors?**

```bash
# Add your domain
CORS_ORIGINS=https://yourdomain.com
```

### Need Help?

1. Check server logs
2. Review error messages
3. Test with curl
4. Check Twilio Console
5. Verify environment variables

---

## 📞 Contact

For production support:

- Check documentation files
- Review error logs
- Test in staging first
- Monitor Twilio Console

---

**Status:** ✅ Ready for Production Deployment  
**Last Updated:** February 2026  
**Version:** 1.0
