const nodeMailer=require('nodemailer')

const sendEmail=async(options)=>{
    const transportmail= nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        service:process.env.SMTP_SERVICE,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASSWORD
        }
    })
    const mailOptions={
        from:process.env.SMTP_USER,
        to:options.email,
        subject:options.subject,
        text:options.msg
    }
    await transportmail.sendMail(mailOptions)
}

module.exports=sendEmail