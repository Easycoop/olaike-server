const CacheUtil = require('./cache');
const jwt = require('jsonwebtoken');
const { getProfile } = require('../database/models/methods/profile');
const { JWT_SECRET } = require('../config');
// const { AuthenticatedUser, TokenPayload } = require("../interfaces/auth");

const AuthTokenType = {
    Access: 'access',
    Refresh: 'refresh',
    EmailVerification: 'emailverification',
    PasswordReset: 'passwordreset',
};

const AuthCodeType = {
    EmailVerification: 'emailverification',
    PasswordReset: 'passwordreset',
};

class AuthTokenCipher {
    static async encodeToken(payload, expiry) {
        return jwt.sign(payload, JWT_SECRET, expiry ? { expiresIn: 1000 } : {});
    }

    static async decodeToken(token) {
        return jwt.verify(token, JWT_SECRET);
    }
}

class AuthCache {
    static generateKey({ user, tokenType }) {
        return `${user.id}:${tokenType}`;
    }

    static async saveData({ tokenType, data, expiry, user }) {
        const key = this.generateKey({ user, tokenType });
        return CacheUtil.saveToCache({ key, value: data, ttl: expiry });
    }

    static async getData({ tokenType, user }) {
        const key = this.generateKey({ user, tokenType });
        const data = await CacheUtil.getFromCache(key);
        return data === null ? null : data.replace(/"/g, '');
    }

    static async compareToken({ tokenType, token, user }) {
        return this.compareData({ tokenType, user, dataToCompare: token });
    }

    static async compareData({ tokenType, user, dataToCompare }) {
        const tokenSavedInCache = await this.getData({ tokenType, user });
        return tokenSavedInCache?.replace(/"/g, '') === dataToCompare.replace(/"/g, '');
    }
}

class AuthorizationUtil {
    static async generateToken({ tokenType, user, expiry }) {
        const userProfile = await getProfile(user.dataValues);

        const plainUserObject = user.dataValues;
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
        const dataToEmbedInToken = {
            user: {
                ...plainUserObject,
                roles: userProfile.roles,
                permissions: userProfile.permissions,
            },
            tokenType,
            expiryDate,
        };
        const token = await AuthTokenCipher.encodeToken(dataToEmbedInToken, expiry);
        await AuthCache.saveData({
            tokenType,
            data: token,
            user: plainUserObject,
            expiry,
        });
        return token;
    }

    static async generateCode({ codeType, user, expiry }) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const userProfile = await user.getProfile(user.dataValues);
        const plainUserObject = user.toObject();
        const expiryDate = new Date();
        expiryDate.setSeconds(expiryDate.getSeconds() + expiry);
        const dataToEmbedInCode = {
            user: {
                ...plainUserObject,
                roles: userProfile.roles,
                permissions: userProfile.permissions,
            },
            tokenType: codeType,
            expiryDate,
        };
        const token = await AuthTokenCipher.encodeToken(dataToEmbedInCode, expiry);
        await AuthCache.saveData({
            tokenType: codeType,
            data: token,
            user: plainUserObject,
            expiry,
        });
        return code;
    }

    static async clearAuthorization({ tokenType, user }) {
        const key = AuthCache.generateKey({ user, tokenType });
        return CacheUtil.deleteFromCache(key);
    }

    static async verifyToken({ tokenType, token, user }) {
        return AuthCache.compareToken({ tokenType, token, user });
    }
}

module.exports = { AuthorizationUtil, AuthTokenType, AuthCodeType, AuthTokenCipher };
