package com.healthcare.healthcare_system.controller;

import com.healthcare.healthcare_system.dto.DoctorRegisterRequest;
import com.healthcare.healthcare_system.dto.GoogleAuthRequest;
import com.healthcare.healthcare_system.dto.LoginRequest;
import com.healthcare.healthcare_system.dto.PatientRegisterRequest;
import com.healthcare.healthcare_system.dto.AuthResponse;
import com.healthcare.healthcare_system.dto.UserDTO;
import com.healthcare.healthcare_system.entity.User;
import com.healthcare.healthcare_system.service.AuthService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "Register and login endpoints for all roles")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public UserDTO register(@RequestBody User user){
        return authService.register(user);
    }

    // LOGIN
    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request){
        return authService.login(request);   
    }

    @PostMapping("/doctor/register")
    public UserDTO registerDoctor(@RequestBody DoctorRegisterRequest request) {
        return authService.registerDoctor(request);
    }

    @PostMapping("/patient/register")
    public UserDTO registerPatient(@RequestBody PatientRegisterRequest request) {
        return authService.registerPatient(request);
    }

    // GOOGLE OAUTH 2.0
    @PostMapping("/google")
    public AuthResponse googleAuth(@RequestBody GoogleAuthRequest request) {
        return authService.googleLogin(request);
    }
}

