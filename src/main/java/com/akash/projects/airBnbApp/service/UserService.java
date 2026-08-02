package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.AuthResponse;
import com.akash.projects.airBnbApp.dto.LoginRequest;
import com.akash.projects.airBnbApp.dto.RegisterRequest;
import com.akash.projects.airBnbApp.dto.UserDto;

public interface UserService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    UserDto getCurrentUser();
}
