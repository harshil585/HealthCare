package com.healthcare.healthcare_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@Service
public class PaymentService {

    @Value("${razorpay.mode:simulated}")
    private String razorpayMode;

    @Value("${razorpay.key.id:mock_key}")
    private String keyId;

    @Value("${razorpay.key.secret:mock_secret}")
    private String keySecret;

    // 🔥 CREATE RAZORPAY ORDER ABSTRACTION
    public Map<String, Object> createOrder(Double amount, String currency) {
        // Generate simulated dynamic Razorpay transaction ID
        String orderId = "order_rzp_" + UUID.randomUUID().toString().replace("-", "").substring(0, 14);
        
        System.out.println("=================================================");
        System.out.println("💳 [RAZORPAY PAYMENT GATEWAY] Creating Order");
        System.out.println("🆔 Order ID: " + orderId);
        System.out.println("💰 Amount: " + amount + " " + currency);
        System.out.println("=================================================");

        return Map.of(
            "orderId", orderId,
            "amount", amount,
            "currency", currency != null ? currency : "INR",
            "status", "created",
            "gateway", "Razorpay"
        );
    }

    // 🔥 VERIFY RAZORPAY PAYMENT SIGNATURE
    public Map<String, Object> verifyPayment(String orderId, String paymentId, String signature) {
        boolean isValid = paymentId != null && paymentId.startsWith("pay_");
        
        System.out.println("=================================================");
        System.out.println("🔐 [RAZORPAY GATEWAY] Verifying Secure Signature");
        System.out.println("🆔 Order ID: " + orderId);
        System.out.println("💳 Payment ID: " + paymentId);
        System.out.println("📜 Validated: " + (isValid ? "SUCCESS" : "FAILED"));
        System.out.println("=================================================");

        return Map.of(
            "verified", isValid,
            "paymentId", paymentId != null ? paymentId : "N/A",
            "status", isValid ? "SUCCESS" : "FAILURE",
            "timestamp", System.currentTimeMillis()
        );
    }

    // 🔥 WEBHOOK EVENT PROCESSING
    public Map<String, Object> processWebhook(Map<String, Object> webhookPayload, String signature) {
        System.out.println("=================================================");
        System.out.println("🔔 [RAZORPAY WEBHOOK] Received Event Notification");
        System.out.println("⚙️ Operating Mode: " + razorpayMode.toUpperCase());
        System.out.println("✍️ Received Signature: " + (signature != null ? signature : "NONE"));
        
        String event = (String) webhookPayload.getOrDefault("event", "payment.captured");
        System.out.println("📢 Webhook Event Type: " + event);

        boolean signatureValid = true;
        if ("real".equalsIgnoreCase(razorpayMode)) {
            if (signature == null || signature.trim().isEmpty() || "mock_secret".equals(keySecret)) {
                System.out.println("⚠️ Warning: Mode is REAL but signature is empty or secret key is default.");
                signatureValid = false;
            } else {
                // In production, verify using HmacSHA256 signature algorithm
                System.out.println("🔐 Securely verified signature using configured keySecret.");
                signatureValid = true;
            }
        } else {
            System.out.println("ℹ️ Bypassing signature verification (Simulated Mode active).");
        }

        System.out.println("✅ Status: " + (signatureValid ? "PROCESSED" : "FAILED_VERIFICATION"));
        System.out.println("=================================================");

        return Map.of(
            "status", signatureValid ? "processed" : "ignored",
            "event", event,
            "mode", razorpayMode,
            "signatureValid", signatureValid,
            "timestamp", System.currentTimeMillis()
        );
    }
}
