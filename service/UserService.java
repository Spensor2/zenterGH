package com.zenter.service;

import com.zenter.dto.*;
import com.zenter.model.User;
import com.zenter.repository.UserRepository;
import com.zenter.util.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            return AuthResponse.error("An account with this email already exists");
        }
        if (userRepository.existsByPhone(request.getPhone().trim())) {
            return AuthResponse.error("An account with this phone number already exists");
        }

        User user = new User(
            request.getFullName().trim(),
            request.getEmail().toLowerCase().trim(),
            request.getPhone().trim(),
            passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

        AuthResponse.UserData userData = new AuthResponse.UserData(
            savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(),
            savedUser.getPhone(), savedUser.getProfilePicture()
        );

        return AuthResponse.success("Account created successfully", token, userData);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim()).orElse(null);

        if (user == null) return AuthResponse.error("No account found with this email");

        if ("google".equals(user.getAuthProvider())) {
            return AuthResponse.error("This account uses Google sign-in. Please use the Google button.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return AuthResponse.error("Incorrect password");
        }

        if (!user.isActive()) return AuthResponse.error("This account has been deactivated");

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());

        AuthResponse.UserData userData = new AuthResponse.UserData(
            user.getId(), user.getFullName(), user.getEmail(),
            user.getPhone(), user.getProfilePicture()
        );

        return AuthResponse.success("Login successful", token, userData);
    }

    /* ── GOOGLE AUTH — create or login ── */
    public AuthResponse googleAuth(GoogleAuthRequest request) {
        // Check if user exists by Google ID
        User user = userRepository.findByGoogleId(request.getGoogleId()).orElse(null);

        if (user != null) {
            // Existing Google user — update profile pic if changed
            if (request.getProfilePicture() != null) {
                user.setProfilePicture(request.getProfilePicture());
                userRepository.save(user);
            }

            String token = jwtUtil.generateToken(user.getId(), user.getEmail());
            AuthResponse.UserData userData = new AuthResponse.UserData(
                user.getId(), user.getFullName(), user.getEmail(),
                user.getPhone(), user.getProfilePicture()
            );
            return AuthResponse.success("Welcome back!", token, userData);
        }

        // Check if email exists (registered with normal signup)
        User existingEmailUser = userRepository.findByEmail(
            request.getEmail().toLowerCase().trim()
        ).orElse(null);

        if (existingEmailUser != null) {
            // Link Google to existing account
            existingEmailUser.setGoogleId(request.getGoogleId());
            existingEmailUser.setAuthProvider("google");
            if (request.getProfilePicture() != null) {
                existingEmailUser.setProfilePicture(request.getProfilePicture());
            }
            userRepository.save(existingEmailUser);

            String token = jwtUtil.generateToken(existingEmailUser.getId(), existingEmailUser.getEmail());
            AuthResponse.UserData userData = new AuthResponse.UserData(
                existingEmailUser.getId(), existingEmailUser.getFullName(),
                existingEmailUser.getEmail(), existingEmailUser.getPhone(),
                existingEmailUser.getProfilePicture()
            );
            return AuthResponse.success("Google account linked!", token, userData);
        }

        // Brand new Google user — create account
        User newUser = new User();
        newUser.setFullName(request.getFullName().trim());
        newUser.setEmail(request.getEmail().toLowerCase().trim());
        newUser.setPhone("not-set");
        newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
        newUser.setGoogleId(request.getGoogleId());
        newUser.setAuthProvider("google");
        newUser.setProfilePicture(request.getProfilePicture());

        User savedUser = userRepository.save(newUser);
        String token = jwtUtil.generateToken(savedUser.getId(), savedUser.getEmail());

        AuthResponse.UserData userData = new AuthResponse.UserData(
            savedUser.getId(), savedUser.getFullName(), savedUser.getEmail(),
            savedUser.getPhone(), savedUser.getProfilePicture()
        );

        return AuthResponse.success("Account created with Google!", token, userData);
    }

    public AuthResponse getUserById(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return AuthResponse.error("User not found");

        AuthResponse.UserData userData = new AuthResponse.UserData(
            user.getId(), user.getFullName(), user.getEmail(),
            user.getPhone(), user.getProfilePicture()
        );
        return AuthResponse.success("User fetched", null, userData);
    }
}