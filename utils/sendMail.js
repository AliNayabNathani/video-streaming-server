const nodemailer = require("nodemailer");

function sendEmail(to, subject, template) {

    // Create a Nodemailer transporter using Mailtrap SMTP settings
    const transporter = nodemailer.createTransport({
        host: "mail.smtp2go.com",
        port: 2525,
        auth: {
            user: "abheesh@inspedium.com",
            pass: "AbheeshInsp123",
        },
    });

    // Define the email content
    const mailOptions = {
        from: "abheesh@inspedium.com",
        to: 'nayabnathani6@gmail.com',
        subject: subject,
        html: template,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email: " + error);
        } else {
            console.log("Email sent: " + info.response);
        }
    });
}

module.exports = {
    sendEmail,
};