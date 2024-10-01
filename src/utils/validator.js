class Validator {
  static isPhoneNumber(phoneNumber) {
    /**
     * Phone number must start with either +234 or 0,
     * followed by 7, 8 or 9, and then 9 digits
     *
     * Note: This is valid for only Nigerian phone numbers
     */
    const phoneNumberRegex = /^(\+234|0)[789]\d{9}$/;
    return phoneNumberRegex.test(phoneNumber);
  }
  static isEmail(email) {
    /**
     * Email must contain exactly one @ symbol and one dot
     *
     * Note: This is not a perfect email validator
     * but it is good enough for this project
     */
    const emailRegex = /^(?=.*@[^@]*$)(?=.*\.[^.]*$)[^@]*@[^@]*\.[^.]*$/;
    return emailRegex.test(email);
  }
  static isPassword(password) {
    /**
     * Password must contain at least 8 characters,
     * one uppercase letter, one lowercase letter and one number
     */
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  }
  static isPasswordResetCode(passwordResetCode) {
    /**
     * Password reset code must contain exactly 6 digits
     */
    const passwordResetCodeRegex = /^\d{6}$/;
    return passwordResetCodeRegex.test(passwordResetCode);
  }
  static isVerificationCode(verificationCode) {
    /**
     * Verification Code must contain exactly 6 digits
     */
    const verificationCodeRegex = /^\d{6}$/;
    return verificationCodeRegex.test(verificationCode);
  }
}

module.exports = Validator;
