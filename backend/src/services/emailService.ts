import nodemailer from 'nodemailer';

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  propertyType?: string;
  budget?: string;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Send email to admin
export const sendAdminNotificationEmail = async (data: ContactEmailData) => {
  try {
    const transporter = createTransporter();

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_EMAIL;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #c1a88a 0%, #8b7355 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">New Contact Request</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">N&H Real Estate</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555; width: 30%;">Name:</td>
              <td style="padding: 12px; color: #333;">${data.name}</td>
            </tr>
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 12px; color: #333;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            ${data.phone ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 12px; color: #333;">${data.phone}</td>
            </tr>
            ` : ''}
            ${data.subject ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555;">Subject:</td>
              <td style="padding: 12px; color: #333;">${data.subject}</td>
            </tr>
            ` : ''}
            ${data.propertyType ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555;">Property Type:</td>
              <td style="padding: 12px; color: #333;">${data.propertyType}</td>
            </tr>
            ` : ''}
            ${data.budget ? `
            <tr style="border-bottom: 1px solid #ddd;">
              <td style="padding: 12px; font-weight: bold; color: #555;">Budget:</td>
              <td style="padding: 12px; color: #333;">${data.budget}</td>
            </tr>
            ` : ''}
          </table>

          <h3 style="color: #333; margin-top: 25px;">Message</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #c1a88a; color: #333; line-height: 1.6;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 25px; text-align: center;">
            This is an automated message from N&H Real Estate contact form.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: adminEmail,
      subject: `New Contact Request: ${data.subject || data.name}`,
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Error sending admin notification email:', error);
    return { success: false, error: error.message };
  }
};

// Send confirmation email to user
export const sendUserConfirmationEmail = async (data: ContactEmailData) => {
  try {
    const transporter = createTransporter();

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #c1a88a 0%, #8b7355 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Thank You for Contacting Us</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">N&H Real Estate</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <p style="color: #333; font-size: 16px;">Dear ${data.name},</p>
          
          <p style="color: #555; line-height: 1.6;">
            Thank you for reaching out to N&H Real Estate. We have received your inquiry and appreciate your interest in our services.
          </p>

          <p style="color: #555; line-height: 1.6;">
            Our team will review your message and get back to you as soon as possible, typically within 24 hours. If your matter is urgent, please feel free to call us directly at <strong>+974 7070 4504</strong>.
          </p>

          <div style="background: white; padding: 20px; border-radius: 5px; border-left: 4px solid #c1a88a; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Your Inquiry Details</h3>
            <p style="color: #555; margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="color: #555; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p style="color: #555; margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>` : ''}
            ${data.subject ? `<p style="color: #555; margin: 5px 0;"><strong>Subject:</strong> ${data.subject}</p>` : ''}
          </div>

          <p style="color: #555; line-height: 1.6;">
            Best regards,<br>
            <strong>N&H Real Estate Team</strong><br>
            Doha, Qatar
          </p>

          <p style="color: #999; font-size: 12px; margin-top: 25px; text-align: center; border-top: 1px solid #ddd; padding-top: 15px;">
            © 2024 N&H Real Estate. All rights reserved.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: data.email,
      subject: 'We Received Your Inquiry - N&H Real Estate',
      html: htmlContent
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('User confirmation email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('Error sending user confirmation email:', error);
    return { success: false, error: error.message };
  }
};

