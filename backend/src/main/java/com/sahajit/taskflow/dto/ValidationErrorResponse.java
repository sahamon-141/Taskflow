package com.sahajit.taskflow.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class ValidationErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private Map<String, String> errors;
    private String path;
}