const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Helmet middleware for security headers
app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'","https://cdnjs.cloudflare.com"], // Allowing inline styles for now
        // Add additional directives as needed
        scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"]
    }
}));

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));
// Serve static files from specific directories
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/img', express.static(path.join(__dirname, '/public/img')));
app.use('/js', express.static(path.join(__dirname, '/public/js')));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wshop0780@gmail.com',
        pass: 'lrpymkjkkdmfuvgk'
    }
});

const sendEmail = (to, subject, htmlContent) => {
    const mailOptions = {
        from: 'wshop0780@gmail.com',
        to: Array.isArray(to) ? to.join(', ') : to, // Convert array of recipients to comma-separated string
        subject,
        html: htmlContent
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ', error);
        } else {
            console.log('Email sent: ', info.response);
        }
    });
};

app.get('/', (req, res) => {
    // Handle your routes here
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.post('/register', (req, res) => {
    const { name, email, phone, quantity, total } = req.body;

    // HTML content for the email to client
    const clientHtmlContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    p {
                        color: #666;
                        font-size: 16px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1 dir="rtl">تأكيد التسجيل</h1>
                    <p dir="rtl">شكرا لتسجيلك، سنتصل بك بعد قليل !</p>
                </div>
            </body>
        </html>
    `;

    // Send email to client with HTML content
    sendEmail([email], 'تأكيد التسجيل', clientHtmlContent);

    // Send email to admin (you)
    sendEmail('wshop0780@gmail.com', 'New Registration', `A new registration has been received. Here are the details: Name: ${name}, Email: ${email}, Phone: ${phone}, Quantity: ${quantity}, Total: ${total}`);

    res.redirect('/thank-you');
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/thank-you.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
