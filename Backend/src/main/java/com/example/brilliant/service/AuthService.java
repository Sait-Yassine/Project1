package com.example.brilliant.service;

import com.example.brilliant.dto.LoginRequestDto;
import com.example.brilliant.dto.LoginResponseDto;
import com.example.brilliant.dto.UserRegistrationDto;
import com.example.brilliant.entity.User;
import com.example.brilliant.repository.UserRepository;
import com.example.brilliant.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            JwtUtil jwtUtil,
            BCryptPasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user with ROLE_USER.
     * @throws IllegalArgumentException if email is already taken.
     */
    public void register(UserRegistrationDto dto) {
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }
        String hashed = passwordEncoder.encode(dto.getPassword());
        User user = new User(dto.getEmail(), hashed, Set.of("ROLE_USER"));
        userRepository.save(user);
    }

    /**
     * Authenticates a user and returns a LoginResponseDto with a real JWT.
     * @throws RuntimeException on invalid credentials.
     */
    public LoginResponseDto login(LoginRequestDto dto) {
        User user = userRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRoles());

        return new LoginResponseDto(
                token,
                user.getId(),
                user.getEmail(),
                user.getRoles()
        );
    }
}
