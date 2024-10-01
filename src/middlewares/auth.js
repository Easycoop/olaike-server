const { AuthTokenCipher, AuthorizationUtil } = require('../utils/token');
const { UnauthenticatedError } = require('../utils/error');

const verifyAuth = (requiredAuthType) => {
    return async (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return next(new UnauthenticatedError('Invalid authorization header'));
        }
        const jwtToken = authHeader.split(' ')[1];

        const payload = await AuthTokenCipher.decodeToken(jwtToken);
        const tokenData = payload;
        tokenData.token = jwtToken;
        if (tokenData.tokenType !== requiredAuthType) {
            return next(new UnauthenticatedError('Invalid authentication: not required auth type'));
        }

        const tokenExpiry = new Date(tokenData.expiryDate).getTime();
        const currentTime = new Date().getTime();

        if (tokenExpiry < currentTime) {
            return next(new UnauthenticatedError('Invalid authentication: token expired'));
        }

        const validAuthProvided = await AuthorizationUtil.verifyToken({
            tokenType: requiredAuthType,
            user: tokenData.user,
            token: jwtToken,
        });
        if (!validAuthProvided) {
            return next(new UnauthenticatedError('Invalid authentication'));
        }

        req.authPayload = tokenData;
        next();
    };
};

const verifyRefreshAuth = (requiredAuthType) => {
    return async (req, res, next) => {
        const cookies = req.cookies.refreshToken;
        const jwtToken = cookies;

        if (!cookies) return next(new UnauthenticatedError('Refresh token not found in cookie'));

        const payload = await AuthTokenCipher.decodeToken(jwtToken);
        const tokenData = payload;
        tokenData.token = jwtToken;
        if (tokenData.tokenType !== requiredAuthType) {
            return next(new UnauthenticatedError('Invalid authentication'));
        }

        const tokenExpiry = new Date(tokenData.expiryDate).getTime();
        const currentTime = new Date().getTime();
        if (tokenExpiry < currentTime) {
            return next(new UnauthenticatedError('Invalid authentication'));
        }

        const validAuthProvided = await AuthorizationUtil.verifyToken({
            tokenType: requiredAuthType,
            user: tokenData.user,
            token: jwtToken,
        });

        if (!validAuthProvided) {
            return next(new UnauthenticatedError('Invalid authentication'));
        }

        req.authPayload = tokenData;
        next();
    };
};

const AuthenticatedController = (controller) => {
    return async (req, res, next) => {
        return controller(req, res, next);
    };
};

module.exports = {
    verifyAuth,
    verifyRefreshAuth,
    AuthenticatedController,
};
