const db = require('../database/models/index');
const User = db.User;
const Password = db.Password;
const Permission = db.Permission;
const Role = db.Role;
const { BadRequestError, InternalServerError } = require('../utils/error');
const { AuthTokenType, AuthorizationUtil } = require('../utils/token.js');
const Validator = require('../utils/validator');
const randString = require('../utils/random.string.js');
const path = require('path');
const { sequelize } = require('../database/models/index.js');
const { Op } = require('sequelize');
const { AuthMailService } = require('../services/mail.service/mail/index.js');

class AuthValidator {
    static async validateSignup({ email }) {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            throw new BadRequestError('Email is already registered');
        }
        return null;
    }

    static async validateLogin({ email, password }) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new BadRequestError('Incorrect email or password');
        }

        if (!user.isActivated) {
            throw new BadRequestError('Your account has not been activated');
        }

        if (!user.isVerified) {
            throw new BadRequestError('Your account has not been verified');
        }

        const userPassword = await Password.findOne({ where: { userId: user.id } });
        if (!userPassword) {
            throw new BadRequestError('Invalid email or password');
        }

        const passwordMatch = await userPassword.comparePassword(password);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid password');
        }

        return { user };
    }

    static async validateForgotPassword({ email, password }) {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            throw new BadRequestError('Incorrect email');
        }

        const validPassword = Validator.isPassword(password);
        if (!validPassword) {
            throw new BadRequestError('Invalid password');
        }

        return { user };
    }
}

class AuthController {
    static async login(req, res) {
        const { email, password } = req.body;

        try {
            // Validate login credentials
            const { user } = await AuthValidator.validateLogin({ email, password });

            // Fetch user roles and their associated permissions
            const userWithRolesAndPermissions = await User.findOne({
                where: { email },
                include: [
                    {
                        model: Role,
                        as: 'Roles',
                        include: [
                            {
                                model: Permission,
                                as: 'Permissions',
                            },
                        ],
                    },
                    {
                        model: Permission, // Directly assigned permissions to the user
                        as: 'Permissions',
                    },
                ],
            });

            if (!userWithRolesAndPermissions) {
                throw new BadRequestError('User not found');
            }

            // Extract roles
            const userRoles = userWithRolesAndPermissions.Roles.map((role) => role.name);

            // Extract permissions from roles
            const rolePermissions = userWithRolesAndPermissions.Roles.reduce((permissions, role) => {
                role.Permissions.forEach((permission) => {
                    if (!permissions.includes(permission.name)) {
                        permissions.push(permission.name);
                    }
                });
                return permissions;
            }, []);

            // Extract direct permissions tied to the user
            const directPermissions = userWithRolesAndPermissions.Permissions.map((permission) => permission.name);

            // Combine role-based and direct permissions, ensuring no duplicates
            const allPermissions = Array.from(new Set([...rolePermissions, ...directPermissions]));

            // Generate access and refresh tokens
            const accessToken = await AuthorizationUtil.generateToken({
                user,
                tokenType: AuthTokenType.Access,
                expiry: 3 * 60 * 60, // 3 hours
            });

            const refreshToken = await AuthorizationUtil.generateToken({
                user,
                tokenType: AuthTokenType.Refresh,
                expiry: 7 * 24 * 60 * 60, // 7 days
            });

            // Set refresh token as HTTP-only cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                secure: true, // Enable in production with HTTPS
            });

            // Send response
            res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    user: user,
                    roles: userRoles,
                    permissions: allPermissions,
                    accessToken,
                    // refreshToken, // Optional to return
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: 'error',
                message: 'Login failed',
                error: error.message,
            });
        }
    }

    static async signup(req, res) {
        const { firstName, lastName, email, password, phone } = req.body;
        const uniqueString = randString();
        const t = await sequelize.transaction(); // Start a transaction

        try {
            // Validate user data
            await AuthValidator.validateSignup({ email }, { transaction: t });

            // Create new user
            const newUser = await User.create(
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    uniqueString: uniqueString,
                },
                { transaction: t },
            );

            // Find the EndUser role
            const endUserRole = await Role.findOne({ where: { name: 'EndUser' }, transaction: t });
            if (!endUserRole) {
                throw new Error('EndUser role not found');
            }

            // Assign role to the new user
            await newUser.addRole(endUserRole, { transaction: t });

            // Retrieve role with specific permissions
            const assignedRoleWithPermissions = await Role.findOne({
                where: { id: endUserRole.id },
                include: [
                    {
                        model: Permission,
                        attributes: ['id', 'name'], // Return specific permission fields if needed
                    },
                ],
                transaction: t,
            });

            // Create user password
            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            // Create wallet for the new user
            const newWallet = await Wallet.create(
                {
                    userId: newUser.id,
                    balance: 0,
                    currency: 'NGN',
                },
                { transaction: t },
            );

            // Commit the transaction if everything succeeds
            await t.commit();

            // Send verification email
            AuthMailService.sendVerificationLink(newUser);

            // Send response with user info, assigned role, and permissions
            res.status(201).json({
                status: 'success',
                message: 'Signup successful',
                data: {
                    user: newUser.dataValues,
                    wallet: newWallet.dataValues,
                    role: {
                        id: assignedRoleWithPermissions.id,
                        name: assignedRoleWithPermissions.name,
                        permissions: assignedRoleWithPermissions.Permissions || [], // Return permissions, if available
                    },
                },
            });
        } catch (error) {
            // Rollback transaction in case of error
            await t.rollback();
            console.error(error); // Log the error for debugging

            res.status(500).json({
                status: 'error',
                message: 'Signup failed',
                error: error.message,
            });
        }
    }

    static async signupWithOtp(req, res) {
        const { firstName, lastName, email, password, phone } = req.body;
        const t = await sequelize.transaction();

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Set OTP expiry (e.g., 10 minutes)
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        try {
            // Validate user data
            await AuthValidator.validateSignup({ email }, { transaction: t });

            // Create new user
            const newUser = await User.create(
                {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    otp: otp,
                    otpExpiry: otpExpiry,
                },
                { transaction: t },
            );

            // Find the EndUser role
            const endUserRole = await Role.findOne({ where: { name: 'EndUser' }, transaction: t });
            if (!endUserRole) {
                throw new Error('EndUser role not found');
            }

            // Assign role to the new user
            await newUser.addRole(endUserRole, { transaction: t });

            // Retrieve role with specific permissions
            const assignedRoleWithPermissions = await Role.findOne({
                where: { id: endUserRole.id },
                include: [
                    {
                        model: Permission,
                        attributes: ['id', 'name'], // Return specific permission fields if needed
                    },
                ],
                transaction: t,
            });

            // Create user password
            await Password.create(
                {
                    userId: newUser.id,
                    password: password,
                },
                { transaction: t },
            );

            // Create wallet for the new user
            const newWallet = await Wallet.create(
                {
                    userId: newUser.id,
                    balance: 0,
                    currency: 'NGN',
                },
                { transaction: t },
            );

            // If everything is successful, commit the transaction
            await t.commit();

            // Send verification email
            AuthMailService.sendVerificationOtp(newUser);

            // Send response with user info, assigned role, and permissions
            res.status(201).json({
                status: 'success',
                message: 'Signup successful',
                data: {
                    user: newUser.dataValues,
                    wallet: newWallet.dataValues,
                    role: {
                        id: assignedRoleWithPermissions.id,
                        name: assignedRoleWithPermissions.name,
                        permissions: assignedRoleWithPermissions.Permissions || [], // Return permissions, if available
                    },
                },
            });
        } catch (error) {
            // If any error occurs, rollback the transaction
            await t.rollback();
            console.error(error); // Log the error for debugging
            res.status(500).json({
                status: 'error',
                message: 'Signup failed',
                error: error.message,
            });
        }
    }

    static async verifyEmail(req, res, next) {
        const { uniqueString, email } = req.query;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        if (user.uniqueString === uniqueString) {
            await User.update(
                { isVerified: true },
                {
                    where: {
                        email: email,
                    },
                },
            );

            return res.sendFile(path.join(__dirname + '../../views/successful.email.verification.html'));
        } else {
            res.json('failed');
        }
    }

    static async verifyEmailOtp(req, res) {
        const { otp, email } = req.body;
        if (!otp || !email) {
            throw new BadRequestError('Missing required parameters');
        }

        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new BadRequestError('User record not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otpExpiry) {
            throw new BadRequestError('Expired OTP');
        }

        await User.update(
            { isVerified: true },
            {
                where: {
                    email: email,
                },
            },
        );

        return res.status(200).json({ status: 'success', message: 'Otp verified successfully' });
    }

    static async logout(req, res, next) {
        const user = await User.findOne({ where: { id: req.authPayload.user.id } });

        if (!user) {
            throw new InternalServerError('User record not found for authenticated request');
        }

        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Access,
        });

        await AuthorizationUtil.clearAuthorization({
            user,
            tokenType: AuthTokenType.Refresh,
        });

        res.status(200).json({ status: 'success', message: 'Logout successful', data: null });
    }

    static async refreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshToken;
        const user = await User.findOne({ where: { id: req.authPayload.user.id } });

        if (!user) {
            throw new InternalServerError('User record not found for authenticated request');
        }

        await AuthorizationUtil.verifyToken({
            user,
            token: refreshToken,
            tokenType: AuthTokenType.Refresh,
        });

        const accessToken = await AuthorizationUtil.generateToken({
            user,
            tokenType: AuthTokenType.Access,
            expiry: 3 * 60 * 60,
        });

        res.status(200).json({
            status: 'success',
            message: 'Token refreshed successfully',
            data: { user, accessToken },
        });
    }

    static async updatePassword(req, res, next) {
        const { email, currentPassword, newPassword } = req.body;
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new InternalServerError('User record not found');
        }

        const userPassword = await Password.findOne({ where: { userId: user.id } });

        if (!userPassword) {
            throw new BadRequestError('User password record not found');
        }

        const passwordMatch = await userPassword.comparePassword(currentPassword);
        if (!passwordMatch) {
            throw new BadRequestError('Invalid current password');
        }

        await Password.update(
            { password: newPassword },
            {
                where: {
                    userId: user.id,
                },
                individualHooks: true,
            },
        );

        res.status(200).json({
            status: 'success',
            message: 'Password update successful',
            data: user,
        });
    }

    static async resetPassword(req, res) {
        const { email } = req.body;
        if (!email) {
            throw new BadRequestError('Invalid email');
        }
        const user = await User.findOne({ where: { email: email } });

        if (!user) {
            throw new InternalServerError('User record not found');
        }

        // Generate a random OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

        // Set OTP expiry (e.g., 10 minutes)
        const otpExpiry = Date.now() + 10 * 60 * 1000;

        // Store the OTP and expiry in the user record
        await user.update({
            otp: otp,
            otpExpiry: otpExpiry,
        });

        // Send reset email
        AuthMailService.sendResetPasswordOtp(user);

        res.status(200).json({
            status: 'success',
            message: 'Otp sent successfully',
            data: user,
        });
    }

    static async verifyResetOtp(req, res) {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new BadRequestError('Missing required parameters');
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otpExpiry) {
            throw new BadRequestError('Expired OTP');
        }

        await User.update(
            { isVerified: true },
            {
                where: {
                    email: email,
                },
            },
        );

        return res.status(200).json({ status: 'success', message: 'Otp verified successfully' });
    }

    static async resetPasswordComplete(req, res) {
        const { email, otp, password } = req.body;

        if (!email || !otp || !password) {
            throw new BadRequestError('Missing required parameters');
        }

        // Find user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP is valid and not expired
        if (user.otp !== otp) {
            throw new BadRequestError('Invalid OTP');
        }

        if (Date.now() > user.otpExpiry) {
            throw new BadRequestError('Expired OTP');
        }

        await Password.update(
            { password: password },
            {
                where: {
                    userId: user.id,
                },
                individualHooks: true,
            },
        );

        res.status(200).json({
            status: 'success',
            message: 'Password updated successfully',
        });
    }

    static async resendOtp(req, res) {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            throw new BadRequestError('Email is required');
        }

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if OTP was recently sent (e.g., within the last 2 minutes)
        const otpCooldown = 2 * 60 * 1000; // 2 minutes
        const now = Date.now();
        if (user.otpExpiry && now < user.otpExpiry - 10 * 60 * 1000 + otpCooldown) {
            return res.status(429).json({
                status: 'fail',
                message: `Please wait before requesting a new OTP.`,
            });
        }

        // Generate a new OTP (6 digits)
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set the new OTP expiry (e.g., 10 minutes from now)
        const otpExpiry = now + 10 * 60 * 1000;

        // Update user record with new OTP and expiry
        await user.update({
            otp,
            otpExpiry,
        });

        // Resend the OTP via email (or SMS)
        AuthMailService.sendVerificationOtp(user);

        res.status(200).json({
            status: 'success',
            message: 'OTP resent successfully',
        });
    }
}

module.exports = AuthController;
