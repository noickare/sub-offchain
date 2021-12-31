import config from "../config"

const transport = config.SMTP.transporter

export default async function sendEmail(type: string = "confirmation", params: any) {
    return new Promise((resolve, reject) => {
        const options = {
            from: {
                name: "Clueconn",
                address: "no-reply@clueconn.com"
            },
            to: params.email,
            subject: "Subject",
            text: 'Please use a HTML compatible client to view this email',
            html: 'Email'
        }
    
        switch (type) {
            case "confirmation":
                options.subject = "Clueconn Email Verification"
                options.text = `Use the following link to confirm your email \n ${params.link}`
                options.html = `
                    <html>
                        <body>
                            <h3>Clueconn</h3>
                            <p>Use the following link to confirm your email <br> ${params.link}</p> 
                        </body>
                    </html>
                `
                break;
        
            default:
                break;
        }
    
        transport.sendMail(options, (err, any) => {
            if(err) {
                console.log(`Error sending ${type} email to ${params.email}: ${err}`)
                return reject(err)
            } 

            resolve("Email sent")
        })
    })
}