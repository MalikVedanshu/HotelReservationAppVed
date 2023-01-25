import nodemailer from 'nodemailer';
import config from 'config';

const { host, auth,port  } = config.get("emailkeys");

async function verificationEmail (emailData) {
    try {
        const { toAddress, emailSubject, emailBody } = emailData;
        let transporter = nodemailer.createTransport({
            host,
            port,
            secure: true, // true for 465, false for other ports
            auth: {
              user: auth.user, // generated ethereal user
              pass: auth.pass, // generated ethereal password
            },
          });

          let info = await transporter.sendMail({
            from: 'Hotel Booking App', // sender address
            to: toAddress, // list of receivers
            subject: "Hello" + emailSubject, // Subject line
            html: emailBody, // html body
          });

          console.log("Message sent. Message ID : ", info.messageId);
    }
    catch(error) {
        console.log(error);
    }
}

export default verificationEmail;