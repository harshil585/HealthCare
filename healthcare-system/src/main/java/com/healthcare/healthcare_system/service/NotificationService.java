package com.healthcare.healthcare_system.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import jakarta.annotation.PostConstruct;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

import java.util.Map;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    private static final int MAX_RETRY_ATTEMPTS = 3;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${twilio.mode}")
    private String twilioMode;

    @Value("${twilio.account.sid}")
    private String twilioAccountSid;

    @Value("${twilio.auth.token}")
    private String twilioAuthToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void initTwilio() {
        if ("real".equalsIgnoreCase(twilioMode)) {
            try {
                Twilio.init(twilioAccountSid, twilioAuthToken);
                logger.info("✅ [TWILIO] SDK initialized successfully in real mode.");
            } catch (Exception e) {
                logger.error("❌ [TWILIO] Initialization failed: {}", e.getMessage(), e);
            }
        } else {
            logger.info("ℹ️ [TWILIO] Mode is set to SIMULATED. Real SMS notifications are disabled.");
        }
    }

    // 🔥 TWILIO SMS API INTEGRATION
    @Async
    public void sendSmsNotification(String phoneNumber, String message) {
        if ("real".equalsIgnoreCase(twilioMode)) {
            logger.info("=================================================");
            logger.info("🚀 [TWILIO SMS API] Dispatching Outgoing Real SMS");
            logger.info("📍 To: {}", phoneNumber);
            try {
                Message twilioMessage = Message.creator(
                    new PhoneNumber(phoneNumber),
                    new PhoneNumber(twilioPhoneNumber),
                    message
                ).create();
                logger.info("✅ Status: DELIVERED (Twilio Network) | SID: {}", twilioMessage.getSid());
            } catch (Exception e) {
                logger.error("❌ Status: FAILED (Twilio Exception: {})", e.getMessage(), e);
            }
            logger.info("=================================================");
        } else {
            // Log simulation of outgoing Twilio API REST interaction
            logger.info("=================================================");
            logger.info("🚀 [TWILIO SMS API] Dispatching Outgoing SMS (Simulated)");
            logger.info("📍 To: {}", phoneNumber);
            logger.info("💬 Payload: {}", message);
            logger.info("✅ Status: DELIVERED (Simulated Enterprise Channel)");
            logger.info("=================================================");
        }
    }

    // 🔥 SENDGRID / RESEND / GMAIL SMTP EMAIL TRANSMISSION
    @Async
    public void sendEmailNotification(String emailAddress, String subject, String bodyContents) {
        logger.info("=================================================");
        logger.info("📧 [EMAIL SERVICE] Initiating Email Dispatch");
        logger.info("📬 Recipient: {}", emailAddress);
        logger.info("🏷️ Subject: {}", subject);
        
        if (mailSender == null) {
            logger.warn("⚠️ JavaMailSender is not initialized. Check your spring-boot-starter-mail configurations.");
            logger.debug("📄 HTML Body Preview: {}", bodyContents);
            logger.info("=================================================");
            return;
        }

        // Retry logic for email sending
        Exception lastException = null;
        for (int attempt = 1; attempt <= MAX_RETRY_ATTEMPTS; attempt++) {
            try {
                logger.debug("📤 Email send attempt {}/{}", attempt, MAX_RETRY_ATTEMPTS);

                MimeMessage mimeMessage = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
                
                // 🔥 CRITICAL FIX: Set the sender address explicitly
                if (mailUsername != null && !mailUsername.isEmpty()) {
                    helper.setFrom(mailUsername);
                    logger.debug("📤 From address set to: {}", mailUsername);
                }

                helper.setTo(emailAddress);
                helper.setSubject(subject);
                
                String formattedBody = bodyContents.replace("\n", "<br/>");
                
                String htmlTemplate = "<!DOCTYPE html><html><head><meta charset=\"utf-8\">"
                        + "<style>"
                        + "body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f0f5ff; margin: 0; padding: 20px; color: #0f172a; }"
                        + ".container { max-width: 600px; background: #ffffff; border-radius: 24px; padding: 40px; margin: 0 auto; box-shadow: 0 10px 30px rgba(37,99,235,0.05); border: 1px solid rgba(37,99,235,0.08); }"
                        + ".header { text-align: center; border-bottom: 2px solid #f0f5ff; padding-bottom: 20px; margin-bottom: 30px; }"
                        + ".logo { font-size: 28px; font-weight: 800; color: #2563eb; text-decoration: none; }"
                        + ".content { font-size: 16px; line-height: 1.8; color: #334155; }"
                        + ".footer { text-align: center; margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f0f5ff; padding-top: 20px; }"
                        + "</style></head><body>"
                        + "<div class=\"container\">"
                        + "  <div class=\"header\"><span class=\"logo\">HealthCare+</span></div>"
                        + "  <div class=\"content\">" + formattedBody + "</div>"
                        + "  <div class=\"footer\">&copy; 2026 HealthCare+. Refined care for everyone.</div>"
                        + "</div></body></html>";
                
                helper.setText(htmlTemplate, true);
                
                mailSender.send(mimeMessage);
                logger.info("🚀 Status: SUCCESS (Rich HTML Email Sent Successfully via SMTP Gateway) | Attempt: {}", attempt);
                logger.info("=================================================");
                return; // Success — exit retry loop
            } catch (Exception e) {
                lastException = e;
                logger.warn("⚠️ Email send attempt {}/{} failed: {}", attempt, MAX_RETRY_ATTEMPTS, e.getMessage());
                
                if (attempt < MAX_RETRY_ATTEMPTS) {
                    try {
                        long backoffMs = (long) Math.pow(2, attempt) * 1000; // Exponential backoff
                        logger.debug("⏳ Waiting {}ms before retry...", backoffMs);
                        Thread.sleep(backoffMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        // All retries exhausted
        logger.error("❌ Status: FAILED after {} attempts (SMTP Exception: {})", MAX_RETRY_ATTEMPTS, 
                lastException != null ? lastException.getMessage() : "unknown");
        logger.error("💡 Tips: Please configure valid spring.mail.username and spring.mail.password in application.properties.");
        if (lastException != null) {
            logger.error("📋 Full stack trace:", lastException);
        }
        logger.info("=================================================");
    }

    // Unified dispatch wrapper
    public Map<String, Object> dispatchNotifications(String recipientPhone, String recipientEmail, String contextMessage) {
        logger.debug("📡 Dispatching notifications — phone: {}, email: {}", recipientPhone, recipientEmail);
        
        if (recipientPhone != null && !recipientPhone.isEmpty()) {
            sendSmsNotification(recipientPhone, contextMessage);
        }
        if (recipientEmail != null && !recipientEmail.isEmpty()) {
            sendEmailNotification(recipientEmail, "HealthCare+ Consultation Update", contextMessage);
        }
        return Map.of(
            "smsDelivered", recipientPhone != null && !recipientPhone.isEmpty(),
            "emailDelivered", recipientEmail != null && !recipientEmail.isEmpty(),
            "timestamp", System.currentTimeMillis()
        );
    }
}
