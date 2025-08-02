const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // In development, use ethereal email for testing
    if (process.env.NODE_ENV === 'development') {
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: 'ethereal.user@ethereal.email',
          pass: 'ethereal.pass'
        }
      });
    }

    // Production configuration
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendInvitationEmail(recipientEmail, inviterName, token, message = '') {
    const inviteLink = `${process.env.FRONTEND_URL}/invite/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@ipray.com',
      to: recipientEmail,
      subject: `You're invited to join iPray by ${inviterName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <h2>You're invited to join iPray!</h2>
          <p>Hi there,</p>
          <p><strong>${inviterName}</strong> has invited you to join iPray, a platform for prayer and spiritual connection.</p>
          ${message ? `<p><em>"${message}"</em></p>` : ''}
          <div style="margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 3px;">
            ${inviteLink}
          </p>
          <p style="color: #666; font-size: 14px;">
            This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `
        You're invited to join iPray!
        
        ${inviterName} has invited you to join iPray, a platform for prayer and spiritual connection.
        
        ${message ? `Message: "${message}"` : ''}
        
        Click this link to accept the invitation: ${inviteLink}
        
        This invitation will expire in 7 days.
      `
    };

    try {
      // In development, simulate email sending
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 [EMAIL SIMULATION] Invitation email would be sent to:', recipientEmail);
        console.log('📧 [EMAIL SIMULATION] Subject:', mailOptions.subject);
        console.log('📧 [EMAIL SIMULATION] Invite Link:', inviteLink);
        return {
          success: true,
          messageId: 'simulated-' + Date.now(),
          preview: false
        };
      }

      const info = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: info.messageId,
        preview: nodemailer.getTestMessageUrl(info)
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}

module.exports = new EmailService();
