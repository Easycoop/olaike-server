const express = require('express');
const router = express.Router();

const RouteValidatorSchema = require('./validator');
const routerSchemaValidator = require('../middlewares/route.validator');
const AuthController = require('../controllers/auth.controller');
const { AuthenticatedController, verifyAuth, verifyRefreshAuth } = require('../middlewares/auth');
const { AuthTokenType } = require('../utils/token');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for user authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Unauthorized
 */
router.post('/login', routerSchemaValidator(RouteValidatorSchema.Auth.login), AuthController.login);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Signup successful
 *       400:
 *         description: Bad request
 */
router.post('/signup', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signup);

/**
 * @swagger
 * /auth/signup-otp:
 *   post:
 *     summary: User signup with OTP verification
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP verification successful
 *       400:
 *         description: Bad request
 */
router.post('/signup-otp', routerSchemaValidator(RouteValidatorSchema.Auth.signup), AuthController.signupWithOtp);

/**
 * @swagger
 * /auth/update-password:
 *   post:
 *     summary: Update user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 */
router.post('/update-password', AuthController.updatePassword);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.delete('/logout', verifyAuth(AuthTokenType.Access), AuthenticatedController(AuthController.logout));

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh user access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token.
 *     responses:
 *       200:
 *         description: Access token refreshed
 *       401:
 *         description: Unauthorized
 */
router.post(
    '/refresh',
    routerSchemaValidator(RouteValidatorSchema.Auth.refreshToken),
    verifyRefreshAuth(AuthTokenType.Refresh),
    AuthenticatedController(AuthController.refreshToken),
);

/**
 * @swagger
 * /auth/verifyemail:
 *   get:
 *     summary: Verify user email
 *     tags: [Auth]
 *     parameters:
 *       - name: token
 *         in: query
 *         description: Verification token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Bad request
 */
router.get('/verifyemail', AuthController.verifyEmail);

/**
 * @swagger
 * /auth/verifyemail-otp:
 *   post:
 *     summary: Verify email using OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verification successful
 *       400:
 *         description: Bad request
 */
router.post('/verifyemail-otp', AuthController.verifyEmailOtp);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Initiate password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset initiated successfully
 *       400:
 *         description: Bad request
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP resent successfully
 *       400:
 *         description: Bad request
 */
router.post('/resend-otp', AuthController.resendOtp);

/**
 * @swagger
 * /auth/verify-reset-otp:
 *   post:
 *     summary: Verify OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Bad request
 */
router.post('/verify-reset-otp', AuthController.verifyResetOtp);

/**
 * @swagger
 * /auth/reset-password-complete:
 *   post:
 *     summary: Complete password reset process
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Bad request
 */
router.post('/reset-password-complete', AuthController.resetPasswordComplete);

module.exports = { router };
