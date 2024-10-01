const createTicketTemplate = (user) => ({
    to: user.email,
    subject: 'Ticket created',
    text: `Hello ${user.firstNname} ${user.lastName}`,
    html: `
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px; color:white">
    <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
        <h2>Ticket created succesfullly</h2>
        <p>We have received your ticket. Our resolution team is working on it and will get bact to you in the next 48 hours.</p>
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
});

module.exports = {
    createTicketTemplate,
};
