//Send confirmation link to the user email
const emailConfirmationLinkTemplate = (user) => ({
    to: user.email,
    subject: 'Email confirmation',
    text: `Hello ${user.firstName} ${user.lastName}`,
    html: ` 
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
    <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
        <h2>Verify your email address</h2>
        <p>Thank you and welcome to Olaike platform</p>
        <p>To begin, activate your account by clicking <a href=http://localhost:5000/api/v1/auth/verifyemail?uniqueString=${user.uniqueString}&email=${user.email}  style="color: #0000ff; text-decoration: none;"> here </a> to verify your email</p>
        <div style=" margin-top: 60px;">
            <p>If you did not create an account, no further action is required.</p>
            <p style="margin-top: 40px;">Kind regards,</p>
            <p><b>Olaike</b> Team</p>
        </div>
    </div>
    <div style="text-align: center; margin-top:50px">
        <h3><a href="https://Olaike.com" style="color: black; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
        <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike</p>
    </div>
</div>
      `,
});

//Send confirmation otp to the user email
const emailConfirmationOtpTemplate = (user) => ({
    to: user.email,
    subject: 'Email confirmation',
    text: `Hello ${user.firstName} ${user.lastName}`,
    html: ` 
   <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Verify your email address</h2>
          <p>Use the code below to verify your email</p>
          <h1>${user.otp}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withOlaike.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Olaike</b> Team</p>
          </div>
      </div>
    <div style="text-align: center; margin-top:50px">
          <h3><a href="https://Olaike.com" style="color: black; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike</p>
      </div>
    </div>
        `,
});

const passwordResetEmailTemplate = (user) => {
    mailOptions = {
        to: user.email,
        subject: 'Email confirmation',
        text: `Hello ${user.firstName} ${user.lastName}`,
        html: `
      <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
      <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
          <h2>Reset password</h2>
          <p>Use the code below to reset your password</p>
          <h1>${user.uniqueString}</h1>
          <div style=" margin-top: 60px;">

              <p>If not from you kindly ignore or contact <a href="mailto:more@withOlaike.com" style="color: #007777; text-decoration: none; margin-bottom: 0;">customer support</a></p>
              <p style="margin-top: 40px;">Kind regards,</p>
              <p><b>Olaike</b> Team</p>
          </div>
      </div>
      <div style="text-align: center; margin-top:50px">
          <h3><a href="https://withOlaike.com" style="color: #ffcc00; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
          <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike Africa Technologies</p>
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

//Send successful registration application
const registrationTemplate = (user) => ({
    to: user.email,
    subject: 'Succesful registration',
    text: `Hello ${user.firstName} ${user.lastName}`,
    html: ` 
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
    <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
        <h2>Your application has been received</h2>
        <p>Thank you and welcome to Olaike</p>
        <p>We will notify you when you application has been processed. You will receive the notification within the next 48 hours</p>
        <div style=" margin-top: 60px;">
            <p>If you did not create an account, no further action is required.</p>
            <p style="margin-top: 40px;">Kind regards,</p>
            <p><b>Olaike</b> Team</p>
        </div>
    </div>
    <div style="text-align: center; margin-top:50px">
        <h3><a href="https://Olaike.com" style="color: black; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
        <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike</p>
    </div>
</div>
      `,
});

//Send registration action
const registrationActionTemplate = (user) => ({
    to: user.email,
    subject: 'Registration update',
    text: `Hello ${user.firstName} ${user.lastName}`,
    html: ` 
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
        <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
            <h2>Registration update</h2>
            <p>Your application to Olaike has been reviewed</p>
            ${
                user.action === 'accept'
                    ? `<p>
                      We are pleased to inform you that your application has been accepted. Login to your dashboard with
                      your email and password. Welcome onboard
                   </p>`
                    : `<p>
                      We regret to inform you that your application has not been accepted. Kindly review your application
                      and resubmit your application. If you have any questions, please feel free to reach out to our
                      customer support team at
                      <a
                          href="mailto:more@withOlaike.com"
                          style="color: #007777; text-decoration: none; margin-bottom: 0;"
                      >
                          more@withOlaike.com
                      </a>
                   </p>`
            }
        </div>
        <div style="text-align: center; margin-top: 50px;">
            <h3><a href="https://Olaike.com" style="color: black; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
            <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike</p>
        </div>
    </div>
    `,
});

module.exports = {
    emailConfirmationLinkTemplate,
    emailConfirmationOtpTemplate,
    passwordResetEmailTemplate,
    registrationTemplate,
    registrationActionTemplate,
};
