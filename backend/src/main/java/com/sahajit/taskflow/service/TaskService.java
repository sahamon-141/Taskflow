package com.sahajit.taskflow.service;

import com.sahajit.taskflow.dto.*;
import com.sahajit.taskflow.entity.Priority;
import com.sahajit.taskflow.entity.TaskStatus;
import org.springframework.data.domain.Page;

public interface TaskService {

    TaskResponse createTask(CreateTaskRequest request, String userEmail);

    Page<TaskResponse> getAllTasks(
            String userEmail,
            int page,
            int size,
            String sortBy,
            TaskStatus status,
            Priority priority,
            String search
    );

    TaskResponse getTaskById(Long taskId, String userEmail);

    TaskResponse updateTask(
            Long taskId,
            UpdateTaskRequest request,
            String userEmail
    );

    void deleteTask(Long taskId, String userEmail);
}