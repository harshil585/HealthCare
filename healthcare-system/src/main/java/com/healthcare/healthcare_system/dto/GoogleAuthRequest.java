package com.healthcare.healthcare_system.dto;

/**
 * DTO for Google OAuth 2.0 authentication requests.
 * Contains the Google ID token received from the frontend
 * and an optional role for first-time registrations.
 */
public class GoogleAuthRequest {

    private String idToken;
    private String role; // Optional: "PATIENT" or "DOCTOR" for new users (defaults to PATIENT)

    public GoogleAuthRequest() {}

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
