import { Request, Response } from 'express';
import ContactRequest from '../models/ContactRequest';
import { sendAdminNotificationEmail, sendUserConfirmationEmail } from '../services/emailService';
import { sendAdminWhatsAppNotification, sendUserWhatsAppConfirmation } from '../services/whatsappService';

interface AuthRequest extends Request {
  user?: any;
}

// @desc    Get all contact requests
// @route   GET /api/contact-requests
// @access  Private (Admin)
export const getContactRequests = async (req: AuthRequest, res: Response) => {
  try {
    const { status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = req.query;

    const filter: any = {};
    if (status) filter.status = status;

    const sort: any = {};
    sort[sortBy as string] = order === 'desc' ? -1 : 1;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const requests = await ContactRequest.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('agentId', 'name email');

    const total = await ContactRequest.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create contact request
// @route   POST /api/contact-requests
// @access  Public
export const createContactRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message, agentId, subject, propertyType, budget } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    const contactRequest = await ContactRequest.create({
      name,
      email,
      phone,
      message,
      agentId,
      subject,
      status: 'new'
    });

    // Prepare data for notifications
    const notificationData = {
      name,
      email,
      phone,
      message,
      subject,
      propertyType,
      budget
    };

    // Send email notifications (fire and forget)
    // Promise.all([
    //   sendAdminNotificationEmail(notificationData),
    //   sendUserConfirmationEmail(notificationData)
    // ]).catch(error => {
    //   console.error('Error sending emails:', error);
    // });

    // Send WhatsApp notifications (fire and forget)
    // Promise.all([
    //   sendAdminWhatsAppNotification(notificationData),
    //   sendUserWhatsAppConfirmation(notificationData)
    // ]).catch(error => {
    //   console.error('Error sending WhatsApp messages:', error);
    // });

    return res.status(201).json({
      success: true,
      data: contactRequest,
      message: 'Contact request received. We will get back to you soon!'
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Update contact request status
// @route   PUT /api/contact-requests/:id
// @access  Private (Admin)
export const updateContactRequest = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    const contactRequest = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        error: 'Contact request not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: contactRequest
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Delete contact request
// @route   DELETE /api/contact-requests/:id
// @access  Private (Admin)
export const deleteContactRequest = async (req: AuthRequest, res: Response) => {
  try {
    const contactRequest = await ContactRequest.findByIdAndDelete(req.params.id);

    if (!contactRequest) {
      return res.status(404).json({
        success: false,
        error: 'Contact request not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact request deleted'
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

