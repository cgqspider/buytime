var nodemailer = require('nodemailer');
import { APP_PORT, DB_URL, DB_HOST, DB_NAME, DB_USER, DB_PASS, EMAIL, EMAIL_PASS } from '../config';

const sendEmail = async ({ from, to, subject, text, html}) => {
    let transporter = nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
            user: EMAIL, // generated ethereal user
            pass: EMAIL_PASS, // generated ethereal password
        },
    });

    // send mail with defined transport object
let info = await transporter.sendMail({
    from: `inShare <${from}>`, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
});
}

export default sendEmail;