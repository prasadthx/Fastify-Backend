// import pkg from 'sib-api-v3-sdk';
// const {ApiClient, TransactionalEmailsApi, SendSmtpEmail} = pkg;
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// let defaultClient = ApiClient.instance;

// let apiKey = defaultClient.authentications["api-key"];

// apiKey.apiKey = `${process.env.SEND_IN_BLUE_API_KEY}`

const sendEmail = async(email, name, token, role, res) => {
    // let apiInstance = new TransactionalEmailsApi();
    // let sendSmtpEmail = new SendSmtpEmail();

    let link = "";
    if(role === "customer"){
        link = `http://ec2-44-197-206-160.compute-1.amazonaws.com:3000/auth/customer/verifyemail?verify=${token}`
    }
    else{
        link = `http://ec2-44-197-206-160.compute-1.amazonaws.com:3000/auth/vendor/verifyemail?verify=${token}`
    }
    
    // sendSmtpEmail = {
    //     sender : { email : 'xtest.smtp@gmail.com'},
    //     to : [
    //         {
    //             email,
    //             name,
    //         }
    //     ],
    //     subject : "Account Verification",
    //     htmlContent : getHTML(link)
    // }

    const msg = {
        to: email, // Change to your recipient
        from: 'xtest.smtp@gmail.com', // Change to your verified sender
        subject: 'Account Verification',
        html: getHTML(link),
    }

    // return apiInstance.sendTransacEmail(sendSmtpEmail).then(
    //     (data) => {
    //         return res.code(201).send("Email sent successfully");
    //     }).catch(err => {
    //         console.log(err);
    //         return res.code(400).send("Error sending email");
    //     })

    return sgMail.send(msg)
    .then(() => {
      res.code(200).send('Email sent');
    })
    .catch((error) => {
      console.error(error)
      res.code(400).send('Error sending email');
    })
}

export default sendEmail;

const getHTML = (link) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    <title></title>
    
    <style>
      
      p{
          text-align: center;
      }

      button{
          background-color: linen;
          align:center;
          border-radius:12px;
          padding: 1rem 1rem 1rem 1rem;
          font-weight: bold;
      }
      
      button:hover{
            background-color:navy;
          cursor:pointer;
          color:white;
      }
    
      #button-div{
          width:100%;
          display: flex;
          justify-content: center;
          align-items: center;
      }
    
    </style>
    </head>
    <body>
    
    <h1 style="text-align:center;">Welcome!</h1>
    
    <p>We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
    
    <div id="button-div">
        <a href="${link}" target="_blank" style="margin:auto"><button>Confirm Account</button></a>
    </div>
    
    <p>If that doesn't work, click or copy and paste the following 
    <a href="${link}" style="font-weight:bold">link</a>
    in your browser:</p>
    
    </body>
    </html>    
    `
}