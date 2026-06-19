package com.sahajit.taskflow.service;

import com.sahajit.taskflow.entity.RefreshToken;
import com.sahajit.taskflow.entity.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user);

    RefreshToken verifyRefreshToken(String token);

    void deleteRefreshToken(String token);
}