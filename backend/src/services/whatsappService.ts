import twilio from 'twilio';

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyType?: string;
  budget?: string;
}

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;

  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }

  return twilio(accountSid, authToken);
};

// Send WhatsApp notification to admin
export const sendAdminWhatsAppNotification = async (data: ContactData) => {
  try {
    const client = getTwilioClient();
    if (!client) {
      return { success: false, error: 'Twilio not configured' };
    }

    const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER;
    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;

    if (!adminPhone || !twilioWhatsAppNumber) {
      return { success: false, error: 'WhatsApp numbers not configured' };
    }

    const messageBody = `
📧 *New Contact Request*

👤 *Name:* ${data.name}
📧 *Email:* ${data.email}
${data.phone ? `📱 *Phone:* ${data.phone}` : ''}
${data.subject ? `📝 *Subject:* ${data.subject}` : ''}
${data.propertyType ? `🏠 *Property Type:* ${data.propertyType}` : ''}
${data.budget ? `💰 *Budget:* ${data.budget}` : ''}

💬 *Message:*
${data.message}

---
N&H Homes Real Estate
    `.trim();

    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${adminPhone}`,
      body: messageBody
    });

    console.log('WhatsApp notification sent to admin:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('Error sending WhatsApp notification to admin:', error);
    return { success: false, error: error.message };
  }
};

// Send WhatsApp confirmation to user (if they provided WhatsApp number)
export const sendUserWhatsAppConfirmation = async (data: ContactData) => {
  try {
    const client = getTwilioClient();
    if (!client) {
      return { success: false, error: 'Twilio not configured' };
    }

    // Only send if user provided a phone number
    if (!data.phone) {
      return { success: false, error: 'User phone number not provided' };
    }

    const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    if (!twilioWhatsAppNumber) {
      return { success: false, error: 'Twilio WhatsApp number not configured' };
    }

    const messageBody = `
👋 *Thank you for contacting N&H Homes Real Estate!*

We have received your inquiry and will get back to you as soon as possible, typically within 24 hours.

If your matter is urgent, please call us at:
📞 +974 7070 4504

Best regards,
N&H Homes Real Estate Team
🏢 Doha, Qatar
    `.trim();

    const message = await client.messages.create({
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${data.phone}`,
      body: messageBody
    });

    console.log('WhatsApp confirmation sent to user:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error: any) {
    console.error('Error sending WhatsApp confirmation to user:', error);
    return { success: false, error: error.message };
  }
};

