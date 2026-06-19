package com.sahajit.taskflow.dto;

import com.sahajit.taskflow.entity.Priority;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private Priority priority;

    private LocalDateTime dueDate;
}