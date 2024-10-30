const z = require('zod');
const Validator = require('../../utils/validator.js');

class AuthSchemaValidator {
    static validatePassword(password) {
        const passwordIsValid = Validator.isPassword(password);
        if (!passwordIsValid) {
            throw new z.ZodError([
                {
                    path: ['password'],
                    message: 'Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number',
                    code: z.ZodIssueCode.custom,
                },
            ]);
        }
        return true;
    }

    static validateEmail(email) {
        const isEmail = Validator.isEmail(email);
        if (!isEmail) {
            throw new z.ZodError([
                {
                    path: ['email'],
                    message: 'Email must contain an @ and . symbol',
                    code: z.ZodIssueCode.custom,
                },
            ]);
        }
        email.toLowerCase();
        return true;
    }

    static signup = z.object({
        body: z.object({
            email: z.string().transform((email) => email.trim().toLowerCase()),
            firstName: z.string().transform((data) => (data ? data.trim() : data)),
            lastName: z.string().transform((data) => (data ? data.trim() : data)),
            password: z
                .string()
                .min(8)
                .trim()
                .refine((data) => this.validatePassword(data)),
            phone: z.string().min(10),
        }),
    });

    static resendVerificationEmail = z.object({
        query: z.object({
            email: z.string().transform((email) => email.trim().toLowerCase()),
        }),
    });

    static verifyUserEmail = z.object({
        body: z.object({
            verificationCode: z.number(),
        }),
    });

    static forgotPassword = z.object({
        body: z.object({
            email: z.string().transform((email) => email.trim().toLowerCase()),
            newPassword: z
                .string()
                .min(8)
                .trim()
                .refine((data) => this.validatePassword(data)),
        }),
    });

    static resetPassword = z.object({
        body: z.object({}),
    });

    static activateUserAccount = z.object({
        query: z.object({
            email: z.string().transform((email) => email.trim().toLowerCase()),
        }),
    });

    static deactivateUserAccount = z.object({
        query: z.object({
            email: z.string().transform((email) => email.trim().toLowerCase()),
        }),
    });

    static login = z.object({
        body: z.object({
            email: z
                .string()
                .trim()
                .refine((data) => this.validateEmail(data)),
            password: z
                .string()
                // .min(8)
                .trim(),
            // .refine((data) => this.validatePassword(data)),
        }),
    });

    static refreshToken = z.object({
        // body: z.object({
        //     refreshToken: z.string(),
        // }),
    });
}

module.exports = AuthSchemaValidator;
