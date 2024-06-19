const nodemailer = require('nodemailer')

const mailSender = async(to, subject, html)=>{
    try{
        const tranporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            server: process.env.SMTP_SERVICE,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            }
        })
    
        const options = {
            from: process.env.SMTP_EMAIL,
            to: to,
            subject: subject,
            html: html,
        }
    
        const send = tranporter.sendMail(options, (err)=>{
        })

        return send;
    }catch(err){
        console.log("Unable to send the mail: ", err);
    }
}

module.exports = mailSender