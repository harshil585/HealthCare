package com.healthcare.healthcare_system.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    @Value("${gemini.api.key:mock_key}")
    private String apiKey;

    private RestTemplate restTemplate;

    private RestTemplate getRestTemplate() {
        if (restTemplate == null) {
            restTemplate = new RestTemplate();
        }
        return restTemplate;
    }

    /**
     * Analyzes patient symptoms to recommend a specialization, urgency level, and tailored advice.
     */
    public Map<String, Object> analyzeSymptoms(String symptoms) {
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("mock_key") && !apiKey.equals("mock_api_key")) {
            try {
                RestTemplate rest = getRestTemplate();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                String prompt = "You are a warm, empathetic, and comforting clinical assistant. Analyze these symptoms: \"" + symptoms + "\". " +
                        "When giving advice, show genuine care, reassure the patient kindly, and offer practical, comforting next steps so they feel supported. " +
                        "Respond with a JSON object containing these exact keys: " +
                        "\"recommendedSpecialization\" (choose one of: Cardiologist, Dermatologist, Orthopedist, Gastroenterologist, Ophthalmologist, Neurologist, General Physician), " +
                        "\"advice\" (a warm, comforting, and empathetic suggestion for the patient), " +
                        "\"urgencyLevel\" (choose one of: LOW, MEDIUM, HIGH, NORMAL).";

                String requestBody = "{"
                        + "\"contents\": [{"
                        + "  \"parts\": [{"
                        + "    \"text\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\""
                        + "  }]"
                        + "}], "
                        + "\"generationConfig\": {"
                        + "  \"responseMimeType\": \"application/json\""
                        + "}"
                        + "}";

                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<String> responseEntity = rest.postForEntity(url, entity, String.class);

                if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(responseEntity.getBody());
                    JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                    if (textNode.isTextual()) {
                        String jsonResponse = textNode.asText();
                        JsonNode innerJson = mapper.readTree(jsonResponse);
                        
                        Map<String, Object> response = new HashMap<>();
                        response.put("symptomsAnalyzed", symptoms);
                        response.put("recommendedSpecialization", innerJson.path("recommendedSpecialization").asText("General Physician"));
                        response.put("advice", innerJson.path("advice").asText("Please rest and consult a doctor."));
                        response.put("urgencyLevel", innerJson.path("urgencyLevel").asText("NORMAL"));
                        response.put("timestamp", System.currentTimeMillis());
                        response.put("aiProvider", "Gemini 1.5 Flash (Live API)");
                        return response;
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini API call failed, falling back to heuristic engine: " + e.getMessage());
            }
        }

        Map<String, Object> response = new HashMap<>();
        String lower = symptoms.toLowerCase();
        
        String specialization = "General Physician";
        String advice = "Please take it easy, rest well, and stay hydrated. I recommend checking in with a general physician soon so they can examine you and ensure you're okay.";
        String urgency = "NORMAL";

        if (lower.contains("chest") || lower.contains("heart") || lower.contains("breath")) {
            specialization = "Cardiologist";
            advice = "I hear you, and this sounds concerning. Chest pain or difficulty breathing should be evaluated immediately. Please seek urgent medical care or visit the nearest emergency room right away.";
            urgency = "HIGH";
        } else if (lower.contains("skin") || lower.contains("rash") || lower.contains("itch")) {
            specialization = "Dermatologist";
            advice = "I understand skin irritation can be very uncomfortable. Try your best not to scratch the area, and keep it clean and gently moisturized until you can consult a dermatologist.";
            urgency = "LOW";
        } else if (lower.contains("bone") || lower.contains("joint") || lower.contains("fracture") || lower.contains("pain in leg")) {
            specialization = "Orthopedist";
            advice = "I'm sorry to hear that. Please rest the affected limb and avoid putting any weight or pressure on it. You can gently apply an ice pack wrapped in a soft cloth to soothe the area and reduce any swelling.";
            urgency = "MEDIUM";
        } else if (lower.contains("stomach") || lower.contains("digestion") || lower.contains("acid") || lower.contains("vomit")) {
            specialization = "Gastroenterologist";
            advice = "I'm sorry you're feeling unwell. Try to rest, stick to a bland diet, and sip on warm water or clear fluids. It's best to avoid oily or spicy foods until you can consult a doctor.";
            urgency = "MEDIUM";
        } else if (lower.contains("eye") || lower.contains("vision") || lower.contains("blur")) {
            specialization = "Ophthalmologist";
            advice = "Eye issues can be stressful. Please try to rest your eyes and avoid screen time or bright lights. Do not rub your eyes, and consider wearing dark glasses for comfort until you consult an ophthalmologist.";
            urgency = "MEDIUM";
        } else if (lower.contains("headache") || lower.contains("brain") || lower.contains("migraine") || lower.contains("dizzy")) {
            specialization = "Neurologist";
            advice = "I'm sorry you're dealing with this discomfort. Rest in a quiet, dark room, and try to avoid bright screens or loud noises. Keep track of how long the pain lasts to help your neurologist when you meet.";
            urgency = "MEDIUM";
        }

        response.put("symptomsAnalyzed", symptoms);
        response.put("recommendedSpecialization", specialization);
        response.put("advice", advice);
        response.put("urgencyLevel", urgency);
        response.put("timestamp", System.currentTimeMillis());
        response.put("aiProvider", "Gemini Health Assistant (Heuristic Engine)");

        return response;
    }

    /**
     * Generates a personalized medical summary report for a given consultation session.
     */
    public String generateAppointmentSummary(String doctorName, String patientName, String specialization) {
        if (apiKey != null && !apiKey.trim().isEmpty() && !apiKey.equals("mock_key") && !apiKey.equals("mock_api_key")) {
            try {
                RestTemplate rest = getRestTemplate();
                String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey;

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                String prompt = "Generate a short, professional one-sentence medical summary report for a consultation session where patient " + patientName + " consulted with Dr. " + doctorName + " (" + specialization + "). Keep it concise.";

                String requestBody = "{"
                        + "\"contents\": [{"
                        + "  \"parts\": [{"
                        + "    \"text\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\""
                        + "  }]"
                        + "}]"
                        + "}";

                HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
                ResponseEntity<String> responseEntity = rest.postForEntity(url, entity, String.class);

                if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                    ObjectMapper mapper = new ObjectMapper();
                    JsonNode root = mapper.readTree(responseEntity.getBody());
                    JsonNode textNode = root.path("candidates").get(0).path("content").path("parts").get(0).path("text");
                    if (textNode.isTextual()) {
                        return textNode.asText().trim();
                    }
                }
            } catch (Exception e) {
                System.err.println("Gemini API summary call failed, falling back: " + e.getMessage());
            }
        }
        return "Patient " + patientName + " consulted with " + doctorName + " (" + specialization + "). "
             + "Session concluded successfully. Standard follow-up and monitoring recommended.";
    }
}

