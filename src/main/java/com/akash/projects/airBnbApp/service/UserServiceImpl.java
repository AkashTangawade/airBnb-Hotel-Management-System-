package com.akash.projects.airBnbApp.service;

import com.akash.projects.airBnbApp.dto.AuthResponse;
import com.akash.projects.airBnbApp.dto.LoginRequest;
import com.akash.projects.airBnbApp.dto.RegisterRequest;
import com.akash.projects.airBnbApp.dto.UserDto;
import com.akash.projects.airBnbApp.entity.User;
import com.akash.projects.airBnbApp.entity.enums.Role;
import com.akash.projects.airBnbApp.repository.UserRepository;
import com.akash.projects.airBnbApp.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final ModelMapper modelMapper;

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Registering new user with email: {}", registerRequest.getEmail());
        
        try {
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                log.warn("Email already exists: {}", registerRequest.getEmail());
                throw new RuntimeException("Email already exists");
            }

            log.info("Creating user object for email: {}", registerRequest.getEmail());
            User user = User.builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .roles(Set.of(Role.GUEST))
                    .build();

            log.info("Saving user to database for email: {}", registerRequest.getEmail());
            user = userRepository.save(user);
            log.info("User saved successfully with ID: {}", user.getId());

            log.info("Loading user details for token generation: {}", user.getEmail());
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            String token = jwtService.generateToken(userDetails);
            log.info("Token generated successfully for user: {}", user.getEmail());

            return AuthResponse.builder()
                    .token(token)
                    .user(modelMapper.map(user, UserDto.class))
                    .build();
        } catch (Exception e) {
            log.error("Error during registration for email: {}. Exception: {}", registerRequest.getEmail(), e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("User login attempt for email: {}", loginRequest.getEmail());
        
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        log.info("User logged in successfully: {}", user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(modelMapper.map(user, UserDto.class))
                .build();
    }

    @Override
    public UserDto getCurrentUser() {
        // This will be implemented using SecurityContext
        String email = org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return modelMapper.map(user, UserDto.class);
    }
}
