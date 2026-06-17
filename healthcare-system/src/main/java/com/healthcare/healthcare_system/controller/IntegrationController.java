package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.service.AIService;
import com.healthcare.healthcare_system.service.NotificationService;
import com.healthcare.healthcare_system.service.PaymentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "Enterprise Integrations", description = "AI Assistant, Maps, Payments, SMS/Email Alerts, and Storage Utilities")
@RestController
@RequestMapping("/integration")
public class IntegrationController {

    @Autowired
    private AIService aiService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PaymentService paymentService;

    // 🔥 AI SYMPTOM CHECKER
    @PostMapping("/ai/analyze")
    public Map<String, Object> analyzeSymptoms(@RequestBody Map<String, String> payload) {
        String symptoms = payload.getOrDefault("symptoms", "");
        return aiService.analyzeSymptoms(symptoms);
    }

    // 🔥 MAPS CONFIGURATION HELPER
    @GetMapping("/maps/config")
    public Map<String, String> getMapsConfig() {
        return Map.of("provider", "Google Maps", "status", "ready");
    }

    // 🔥 CREATE RAZORPAY ORDER
    @PostMapping("/payment/create")
    public Map<String, Object> createPaymentOrder(@RequestBody Map<String, Object> payload) {
        Double amount = Double.valueOf(payload.getOrDefault("amount", "500").toString());
        String currency = payload.getOrDefault("currency", "INR").toString();
        return paymentService.createOrder(amount, currency);
    }

    // 🔥 VERIFY RAZORPAY PAYMENT
    @PostMapping("/payment/verify")
    public Map<String, Object> verifyPaymentSignature(@RequestBody Map<String, String> payload) {
        String orderId = payload.get("orderId");
        String paymentId = payload.get("paymentId");
        String signature = payload.get("signature");
        return paymentService.verifyPayment(orderId, paymentId, signature);
    }

    // 🔥 RAZORPAY WEBHOOK ROUTING
    @PostMapping("/payment/webhook")
    public Map<String, Object> handlePaymentWebhook(
            @RequestBody Map<String, Object> webhookPayload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        return paymentService.processWebhook(webhookPayload, signature);
    }

    // 🔥 TRIGGER SMS & EMAIL NOTIFICATIONS
    @PostMapping("/notify")
    public Map<String, Object> dispatchNotificationAlerts(@RequestBody Map<String, String> payload) {
        String phone = payload.get("phone");
        String email = payload.get("email");
        String message = payload.getOrDefault("message", "Your HealthCare+ consultation profile has been updated.");
        return notificationService.dispatchNotifications(phone, email, message);
    }

    // 🔥 CLOUDINARY CONFIGURATION ACCESS
    @GetMapping("/cloudinary/config")
    public Map<String, String> getCloudinaryConfig() {
        return Map.of(
            "cloudName", "healthcareplus-enterprise",
            "uploadPreset", "medical_documents_secure",
            "status", "authorized"
        );
    }
}
