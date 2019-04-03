const sgMail = require('@sendgrid/mail');
module.exports={
    sendEmail: (req,res)=>{
      console.log('inside sendEmail')
      console.log('req.body',req.body)
      console.log('req.body.email')
      const key='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'
      sgMail.setApiKey(key);

          const msg = {
            to: req.body.email,
            from: 'nidhi.kumari@geminisolutions.in',
            subject: 'Sending with SendGrid is Fun',
            // text: 'Please find your login Details Below loginId: '+req.body.email+'Password:'+req.body.password,
            html: 'Please find your login Details Below<br><label>loginId:</label>'+req.body.email+'<br>'+
                  '<label>Password:</label>'+req.body.password
          };
          sgMail.send(msg);
        res.json({message:'email sent'})
    }
    

}

