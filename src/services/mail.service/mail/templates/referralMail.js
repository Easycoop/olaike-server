//Send referral mail
const referralMailTemplate = (data) => ({
    to: data.email,
    subject: 'Olaike referral',
    text: `Hello There`,
    html: ` 
    <div style="font-family: sans-serif; background-color: transparent; padding-top: 100px;">
        <div style="background-color: white; color: black; padding: 50px 25px; text-align: center;">
            <h2>Referral link from ${data.firstName} ${data.lastName}</h2>
            <p>
            I hope you're doing great! I’m excited to share an incredible opportunity with you. I’ve been a member of ${data.society}, and it has already proven to be a game-changer for my financial growth and savings!

            By becoming a member, you can enjoy benefits such as:</p>
            <ul>
                <li>Access to low-interest loans</li>
                <li>Higher returns on savings</li>
                <li>Exclusive investment opportunities</li>
                <li>Financial advisory services</li>
            </ul

            <p>And the best part? By using my referral link, you can sign up easily and start enjoying these amazing benefits: ${data.referralLink}</p>

            <p>Take the first step toward securing your financial future with a trusted community behind you. I believe this could be a great resource for you as well! <p>

            <p>Looking forward to seeing you in the cooperative!</p>
            <p>
                <a
                    href="mailto:more@withOlaike.com"
                    style="color: #007777; text-decoration: none; margin-bottom: 0;"
                >
                    more@withOlaike.com
                </a>
            </p>
            
        </div>
        <div style="text-align: center; margin-top: 50px;">
            <h3><a href="https://Olaike.com" style="color: black; text-decoration: none; margin-bottom: 0;">Olaike.com</a></h3>
            <p style="margin-top: -10px;">&copy; Copyright 2024, Olaike</p>
        </div>
    </div>
    `,
});

module.exports = {
    referralMailTemplate,
};
