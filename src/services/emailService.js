import nodemailer from 'nodemailer';

// Create a transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME || 'prithvihhh@gmail.com',
    pass: process.env.SMTP_PASSWORD || 'ziuvuxrmytzwixvc',
  },
});

/**
 * Send an email to a restaurant with the user's message
 * @param {string} restaurantEmail - Restaurant's email address
 * @param {string} userName - User's name
 * @param {string} userMessage - User's message
 * @param {string} chatId - Chat ID for tracking replies
 * @returns {Promise<boolean>} - Success status
 */
export const sendEmailToRestaurant = async (restaurantEmail, userName, userMessage, chatId) => {
  try {
    console.log(`[EmailService] Sending email to restaurant: ${restaurantEmail}`);
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'prithvihhh@gmail.com',
      to: restaurantEmail,
      subject: `New message from ${userName} via AllerPal`,
      replyTo: process.env.SMTP_FROM || 'prithvihhh@gmail.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #00aced;">New Message from AllerPal User</h2>
          <p><strong>From:</strong> ${userName}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${userMessage}
          </div>
          <p style="margin-top: 20px;">Please reply directly to this email to respond to the customer.</p>
          <p style="color: #777; font-size: 12px;">Reference: ${chatId}</p>
          <hr />
          <p style="color: #777; font-size: 12px;">This message was sent via AllerPal. Please respond within 24 hours.</p>
        </div>
      `,
      headers: {
        'X-Chat-ID': chatId,
      }
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Email sent successfully to ${restaurantEmail}. MessageId: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending email:', error);
    throw error; // Propagate error to handle it in the chat service
  }
};

/**
 * Send a reminder email to a restaurant for unanswered messages
 * @param {string} restaurantEmail - Restaurant's email address
 * @param {string} userName - User's name
 * @param {string} chatId - Chat ID for tracking replies
 * @returns {Promise<boolean>} - Success status
 */
export const sendReminderEmail = async (restaurantEmail, userName, chatId) => {
  try {
    console.log(`[EmailService] Sending reminder email to restaurant: ${restaurantEmail}`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: restaurantEmail,
      subject: `REMINDER: Unanswered message from ${userName} via AllerPal`,
      replyTo: process.env.EMAIL_USER,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff6b6b;">Reminder: Unanswered Message</h2>
          <p>You have an unanswered message from <strong>${userName}</strong> that was sent 24 hours ago.</p>
          <p>Please reply to this email as soon as possible to maintain good customer service.</p>
          <p style="color: #777; font-size: 12px;">Reference: ${chatId}</p>
        </div>
      `,
      headers: {
        'X-Chat-ID': chatId,
      }
    };

    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Reminder email sent successfully to ${restaurantEmail}`);
    return true;
  } catch (error) {
    console.error('[EmailService] Error sending reminder email:', error);
    return false;
  }
};

export default {
  sendEmailToRestaurant,
  sendReminderEmail,
}; 