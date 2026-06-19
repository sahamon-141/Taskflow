package com.sahajit.taskflow.service.impl;

import com.sahajit.taskflow.entity.RefreshToken;
import com.sahajit.taskflow.entity.User;
import com.sahajit.taskflow.exception.BadRequestException;
import com.sahajit.taskflow.repository.RefreshTokenRepository;
import com.sahajit.taskflow.security.JwtService;
import com.sahajit.taskflow.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;

    @Value("${jwt.refresh.expiration}")
    private long refreshExpiration;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {

        refreshTokenRepository.deleteByUser(user);

        String token = jwtService.generateRefreshToken(user.getEmail());

        RefreshToken refreshToken = RefreshToken.builder()
                .token(token)
                .expiryDate(
                        LocalDateTime.now()
                                .plusNanos(refreshExpiration * 1_000_000)
                )
                .user(user)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() ->
                        new BadRequestException("Refresh token not found"));

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken);
            throw new BadRequestException("Refresh token expired");
        }

        return refreshToken;
    }
    @Override
    public void deleteRefreshToken(String token) {

        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() ->
                        new BadRequestException("Refresh token not found"));

        refreshTokenRepository.delete(refreshToken);
    }
}