const dotenv = require('dotenv');
dotenv.config();

const required = ['MONGODB_URI', 'JWT_STUDENT_SECRET', 'JWT_ADMIN_SECRET', 'JWT_SUPERVISOR_SECRET'];
const missing = required.filter(key => !process.env[key]);
if (missing.length > 0) {
  console.error('\n❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('\n👉 Please create a .env file in the backend folder. You can copy from .env.example:\n   cp .env.example .env\n');
  process.exit(1);
}

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  jwt: {
    studentSecret: process.env.JWT_STUDENT_SECRET,
    adminSecret: process.env.JWT_ADMIN_SECRET,
    supervisorSecret: process.env.JWT_SUPERVISOR_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1d',
  },
  redisUrl: process.env.REDIS_URL,
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.FROM_EMAIL,
  },
  twilio: {
    sid: process.env.TWILIO_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phone: process.env.TWILIO_PHONE,
  },
};

module.exports = env;
