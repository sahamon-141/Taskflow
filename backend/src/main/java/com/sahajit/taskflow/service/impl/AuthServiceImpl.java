package com.sahajit.taskflow.service.impl;

import com.sahajit.taskflow.dto.AuthResponse;
import com.sahajit.taskflow.dto.LoginRequest;
import com.sahajit.taskflow.dto.RefreshTokenRequest;
import com.sahajit.taskflow.dto.RegisterRequest;
import com.sahajit.taskflow.entity.RefreshToken;
import com.sahajit.taskflow.entity.Role;
import com.sahajit.taskflow.entity.User;
import com.sahajit.taskflow.repository.UserRepository;
import com.sahajit.taskflow.security.JwtService;
import com.sahajit.taskflow.service.AuthService;
import com.sahajit.taskflow.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.sahajit.taskflow.exception.BadRequestException;
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        userRepository.save(user);
        User savedUser = userRepository.save(user);
        String accessToken =
                jwtService.generateAccessToken(savedUser.getEmail());

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(savedUser);
        return new AuthResponse(
                accessToken,
                refreshToken.getToken()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid credentials");
        }

        String accessToken =
                jwtService.generateAccessToken(user.getEmail());

        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                accessToken,
                refreshToken.getToken()
        );
    }
    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {

        RefreshToken refreshToken =
                refreshTokenService.verifyRefreshToken(
                        request.getRefreshToken()
                );

        String accessToken =
                jwtService.generateAccessToken(
                        refreshToken.getUser().getEmail()
                );

        return new AuthResponse(
                accessToken,
                refreshToken.getToken()
        );
    }
    @Override
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.deleteRefreshToken(
                request.getRefreshToken()
        );
    }

}