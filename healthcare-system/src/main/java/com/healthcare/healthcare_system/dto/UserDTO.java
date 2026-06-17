package com.healthcare.healthcare_system.dto;

import com.healthcare.healthcare_system.entity.User;

public class UserDTO {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private String role;
    private Boolean isActive;
    private String profilePicture;
    private String authProvider;

    public UserDTO() {}

    public UserDTO(User user) {
        if (user != null) {
            this.userId = user.getUserId();
            this.name = user.getName();
            this.email = user.getEmail();
            this.phone = user.getPhone();
            this.role = user.getRole();
            this.isActive = user.getIsActive();
            this.profilePicture = user.getProfilePicture();
            this.authProvider = user.getAuthProvider();
        }
    }

    // Getters and Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }
}
