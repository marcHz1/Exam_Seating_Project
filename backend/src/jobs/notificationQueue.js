const Queue = require('bull');
const env = require('../config/env');
const logger = require('../config/logger');
const Notification = require('../models/Notification');
const Student = require('../models/Student');

const notificationQueue = new Queue('notifications', env.redisUrl || undefined);

notificationQueue.process('send-notification', async (job) => {
  const { notificationId } = job.data;
  try {
    const notification = await Notification.findById(notificationId).populate('student_id');
    if (!notification) return;

    const student = notification.student_id;

    if (notification.channel === 'email' && student.email) {
      // Email sending logic would go here using nodemailer
      // For production, integrate with SMTP
      logger.info(`[EMAIL] To: ${student.email}, Message: ${notification.message}`);
      notification.status = 'sent';
      notification.sent_at = new Date();
    } else if (notification.channel === 'sms' && student.phone) {
      // SMS sending logic would go here using Twilio
      logger.info(`[SMS] To: ${student.phone}, Message: ${notification.message}`);
      notification.status = 'sent';
      notification.sent_at = new Date();
    } else {
      notification.status = 'failed';
    }

    await notification.save();
  } catch (err) {
    logger.error(`Notification job failed for ${notificationId}`, err);
    await Notification.findByIdAndUpdate(notificationId, { status: 'failed' });
    throw err;
  }
});

notificationQueue.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed: ${err.message}`);
});

module.exports = notificationQueue;
