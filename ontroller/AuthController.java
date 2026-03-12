package com.zenter.controller;

import com.zenter.dto.*;
import com.zenter.service.UserService;
import com.zenter.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = userService.signup(request);
        if (response.isSuccess()) return ResponseEntity.status(201).body(response);
        return ResponseEntity.badRequest().body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = userService.login(request);
        if (response.isSuccess()) return ResponseEntity.ok(response);
        return ResponseEntity.status(401).body(response);
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleAuth(@Valid @RequestBody GoogleAuthRequest request) {
        AuthResponse response = userService.googleAuth(request);
        if (response.isSuccess()) return ResponseEntity.ok(response);
        return ResponseEntity.badRequest().body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401).body(AuthResponse.error("Invalid token"));
            }
            Long userId = jwtUtil.extractUserId(token);
            AuthResponse response = userService.getUserById(userId);
            if (response.isSuccess()) return ResponseEntity.ok(response);
            return ResponseEntity.status(404).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(AuthResponse.error("Authentication failed"));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("ZenterGh API is running 🚀");
    }
}