const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // or your email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendStatusEmail = async (to, jobTitle, status) => {
  const subject = status === 'accepted' 
    ? `Congratulations! Your application for ${jobTitle} has been accepted`
    : `Update on your application for ${jobTitle}`;

  const text = status === 'accepted'
    ? `We're pleased to inform you that your application for "${jobTitle}" has been accepted! We'll contact you shortly with next steps.`
    : `We regret to inform you that your application for "${jobTitle}" has not been selected at this time.`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>${subject}</h2>
      <p>${text}</p>
      ${status === 'rejected' ? 
        '<p>We appreciate your time and effort in applying and encourage you to apply for future opportunities.</p>' : 
        '<p>Welcome to our team! We look forward to working with you.</p>'
      }
      <p>Best regards,</p>
      <p>The Hiring Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"JobBoard" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`Status email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendStatusEmail };