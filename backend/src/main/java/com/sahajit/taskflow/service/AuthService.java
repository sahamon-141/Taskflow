package com.sahajit.taskflow.service;

import com.sahajit.taskflow.dto.AuthResponse;
import com.sahajit.taskflow.dto.LoginRequest;
import com.sahajit.taskflow.dto.RefreshTokenRequest;
import com.sahajit.taskflow.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);
}