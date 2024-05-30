const nodemailer = require('nodemailer');
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;

const sendMail = async (email, mailSubject, content) => {
    console.log("mail==",email,mailSubject,content)

    try {

        const transport = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:SMTP_MAIL,
                pass:SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from:SMTP_MAIL,
            to:email,
            subject:mailSubject,
            html:content
        }

        transport.sendMail(mailOptions, function(error, info){
            if(error){
                console.log("mailerror",error)
            }
            else{
                console.log("Mail sent successfully!:-", info.response)
            }
        });

    } catch (error) {
        console.log(error.message);
    }
}

  const sendForgetPasswordMail = async(option) =>{
    console.log("option==", option)
  try{

    const transport = nodemailer.createTransport({
      host:'smtp.gmail.com',
      port:587,
      secure:false,
      requireTLS:true,
      auth:{
          user:SMTP_MAIL,
          pass:SMTP_PASSWORD
      }
  });

  const mailOption = {
    from: SMTP_MAIL,
    to: option.email,
    subject: option.subject,
    html: option.message,
  };

  transport.sendMail(mailOption, function(error, info){
      if(error){
          console.log("mailerror",error)
      }
      else{
          console.log("Mail sent successfully!:-", info.response)
      }
  });

  }catch(error){
    console.log(error)
  }
}

// module.exports = sendMail;

const mailTemplate = (content, buttonUrl, buttonText) => {
    return `<!DOCTYPE html>
    <html>
    <body style="text-align: center; font-family: 'Verdana', serif; color: #000;">
      <div
        style="
          max-width: 400px;
          margin: 10px;
          background-color: #fafafa;
          padding: 25px;
          border-radius: 20px;
        "
      >
        <p style="text-align: left;">
          ${content}
        </p>
        <a href="${buttonUrl}" target="_blank">
          <button
            style="
              background-color: #444394;
              border: 0;
              width: 200px;
              height: 30px;
              border-radius: 6px;
              color: #fff;
            "
          >
            ${buttonText}
          </button>
        </a>
        <p style="text-align: left;">
          If you are unable to click the above button, copy paste the below URL into your address bar
        </p>
        <a href="${buttonUrl}" target="_blank">
            <p style="margin: 0px; text-align: left; font-size: 10px; text-decoration: none;">
              ${buttonUrl}
            </p>
        </a>
      </div>
    </body>
  </html>`;
  };
  
  module.exports = { sendMail, mailTemplate, sendForgetPasswordMail };