const { Router } = require('express');
const { router: authRoute } = require('./auth.routes');
const { router: userRoute } = require('./user.routes');
const { router: miscRoute } = require('./misc.routes');
const { router: rolePermissionsRoutes } = require('./role.permissions.routes');
const { router: walletRoute } = require('./wallet.routes');
const { router: transactionRoute } = require('./transaction.routes');
const { router: groupRoute } = require('./group.routes');
const { router: subWalletRoute } = require('./sub.wallet.routes');
const { router: kycRoute } = require('./kyc.routes');
const { router: ticketRoute } = require('./ticket.routes');
const { router: notificationRoute } = require('./notification.routes');
const { router: beneficiaryRoute } = require('./beneficiary.routes.js');
const { router: budgetRoute } = require('./budget.routes');
const { router: paymentRoute } = require('./payment.routes');
const { router: applicationRoute } = require('./application.routes');
const { router: messageRoute } = require('./message.routes');
const { router: conversationRoute } = require('./conversation.routes');
const { router: feesRoute } = require('./fees.routes');
const { router: loanApplicationRoute } = require('./loan.application.routes.js');
const { router: withdrawRequestRoute } = require('./withdraw.requests.routes.js');

const router = Router();

router
    .use('/auth', authRoute)
    .use('/user', userRoute)
    .use('/role-permissions', rolePermissionsRoutes)
    .use('/transaction', transactionRoute)
    .use('/wallet', walletRoute)
    .use('/sub-wallet', subWalletRoute)
    .use('/group', groupRoute)
    .use('/kyc', kycRoute)
    .use('/ticket', ticketRoute)
    .use('/notification', notificationRoute)
    .use('/beneficiary', beneficiaryRoute)
    .use('/payment', paymentRoute)
    .use('/budget', budgetRoute)
    .use('/application', applicationRoute)
    .use('/message', messageRoute)
    .use('/conversation', conversationRoute)
    .use('/fees', feesRoute)
    .use('/loan-application', loanApplicationRoute)
    .use('/withdraw-request', withdrawRequestRoute)
    .use('/misc', miscRoute);

module.exports = { routeHandler: router };
