//Send confirmation link to the user email
const emailConfirmationLinkTemplate = (user) => ({
    to: user.email,
    subject: 'Email confirmation',
    text: `Hello ${user.firstNname} ${user.lastName}`,
    html: ` 
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
    <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
        <h2>Verify your email address</h2>
        <p>Thank you and welcome to Root platform</p>
        <p>To begin, activate your account by clicking <a href=http://localhost:5000/api/v1/auth/verifyemail?uniqueString=${user.uniqueString}&email=${user.email}  style="color: #0000ff; text-decoration: none;"> here </a> to verify your email</p>
        <div style=" margin-top: 60px;">
            <p>If you did not create an account, no further action is required.</p>
            <p style="margin-top: 40px;">Kind regards,</p>
            <p><b>Root</b> Team</p>
        </div>
    </div>
    <div style="text-align: center; margin-top:50px">
        <h3><a href="https://root.com" style="color: black; text-decoration: none; margin-bottom: 0;">Root.com</a></h3>
        <p style="margin-top: -10px;">&copy; Copyright 2024, Root</p>
    </div>
</div>
      `,
});

//Send confirmation otp to the user email
const emailConfirmationOtpTemplate = (user) => ({
    to: user.email,
    subject: 'Email confirmation',
    text: `Hello ${user.firstNname} ${user.lastName}`,
    html: ` 
   <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Verify your email address</h2>
          <p>Use the code below to verify your email</p>
          <h1>${user.otp}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withRoot.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Root</b> Team</p>
          </div>
      </div>
    <div style="text-align: center; margin-top:50px">
          <h3><a href="https://root.com" style="color: black; text-decoration: none; margin-bottom: 0;">Root.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Root</p>
      </div>
    </div>
        `,
});

const passwordResetEmailTemplate = (user) => {
    mailOptions = {
        to: user.email,
        subject: 'Email confirmation',
        text: `Hello ${user.firstNname} ${user.lastName}`,
        html: `
      <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Reset password</h2>
          <p>Use the code below to reset your password</p>
          <h1>${user.uniqueString}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withRoot.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Root</b> Team</p>
          </div>
      </div>
      <div style="text-align: center; margin-top:50px">
          <h3><a href="https://withRoot.com" style="color: #ffcc00; text-decoration: none; margin-bottom: 0;">Root.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Root Africa Technologies</p>
      </div>
    </div>
      `,
    };

    Transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            logger.log(error);
        } else {
            logger.log('message sent');
        }
    });
};

module.exports = {
    emailConfirmationLinkTemplate,
    emailConfirmationOtpTemplate,
    passwordResetEmailTemplate,
};
