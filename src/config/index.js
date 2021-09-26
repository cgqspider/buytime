import dotenv from 'dotenv';
dotenv.config();

export const {
    APP_PORT,
    DEBUG_MODE,
    DB_URL,
    JWT_SECRET,
    REFRESH_SECRET,
    EMAIL,
    EMAIL_PASS,
    APP_URL, 
    DB_HOST,
    DB_NAME,
    DB_USER,
    DB_PASS
} = process.env;