package com.example.brilliant.controller;

import com.example.brilliant.dto.LoginRequestDto;
import com.example.brilliant.dto.LoginResponseDto;
import com.example.brilliant.dto.UserRegistrationDto;
import com.example.brilliant.service.AuthService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * POST /api/auth/register
     * Registers a new user.
     * Returns 201 Created if successful, 400 Bad Request if email is taken or validation fails.
     */
    @PostMapping("/register")
    public ResponseEntity<Void> register(
            @Valid @RequestBody UserRegistrationDto dto
    ) {
        authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * POST /api/auth/login
     * Logs in an existing user.
     * Returns 200 OK with a LoginResponseDto (including token) on success,
     * or 401 Unauthorized on invalid credentials.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(
            @Valid @RequestBody LoginRequestDto dto
    ) {
        LoginResponseDto resp = authService.login(dto);
        return ResponseEntity.ok(resp);
    }
}
