const DB_NAME = 'AuthDB'
const options = { httpOnly: true, secure: true }
const OTP_EXPIRY_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export {
    DB_NAME,
    options,
    OTP_EXPIRY_DURATION
}