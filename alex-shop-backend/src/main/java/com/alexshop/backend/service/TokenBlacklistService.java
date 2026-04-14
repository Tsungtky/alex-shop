package com.alexshop.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {
    private final StringRedisTemplate redisTemplate;
    private static final String PREFIX = "blacklist:";

    public void blacklist(String token, long ttlSeconds) {
        if (ttlSeconds > 0) {
            try {
                redisTemplate.opsForValue().set(PREFIX + token, "1", ttlSeconds, TimeUnit.SECONDS);
            } catch (Exception e) {
                // Redis 連線失敗時記錄日誌，不讓整個系統崩潰
                System.err.println("[Redis] blacklist 失敗: " + e.getMessage());
            }
        }
    }

    public boolean isBlacklisted(String token) {
        try {
            return Boolean.TRUE.equals(redisTemplate.hasKey(PREFIX + token));
        } catch (Exception e) {
            // Redis 斷線時放行（fail open），避免整個 API 掛掉
            System.err.println("[Redis] isBlacklisted 查詢失敗: " + e.getMessage());
            return false;
        }
    }
}
