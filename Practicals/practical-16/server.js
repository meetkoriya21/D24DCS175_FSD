const express = require('express');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'meetkoriya254@gmail.com', 
    pass: 'cade qocg fyhi cxzd' 
  }
});

app.post('/contact', (req, res) => {
  const { name, email, message } = req.body;

  // Server-side validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email format.' });
  }

  // Send email
  const mailOptions = {
    from: email,
    to: 'meetkoriya254@gmail.com', 
    subject: 'New Contact Form Message from Portfolio',
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
    }
    res.json({ success: true, message: 'Message sent successfully!' });
  });
});

// Start server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
