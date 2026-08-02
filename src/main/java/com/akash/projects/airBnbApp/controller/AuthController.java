package com.akash.projects.airBnbApp.controller;

import com.akash.projects.airBnbApp.advice.ApiResponse;
import com.akash.projects.airBnbApp.dto.AuthResponse;
import com.akash.projects.airBnbApp.dto.LoginRequest;
import com.akash.projects.airBnbApp.dto.RegisterRequest;
import com.akash.projects.airBnbApp.dto.UserDto;
import com.akash.projects.airBnbApp.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Registration request received for email: {}", registerRequest.getEmail());
            AuthResponse authResponse = userService.register(registerRequest);
            log.info("Registration successful for email: {}", registerRequest.getEmail());
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>(authResponse, "User registered successfully"));
        } catch (Exception e) {
            log.error("Registration failed for email: {}. Error: {}", registerRequest.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.login(loginRequest);
        return ResponseEntity
                .ok(new ApiResponse<>(authResponse, "User logged in successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto userDto = userService.getCurrentUser();
        return ResponseEntity.ok(new ApiResponse<>(userDto, "User fetched successfully"));
    }
}
