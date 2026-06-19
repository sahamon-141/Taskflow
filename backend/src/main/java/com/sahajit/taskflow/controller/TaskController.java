package com.sahajit.taskflow.controller;

import com.sahajit.taskflow.dto.CreateTaskRequest;
import com.sahajit.taskflow.dto.TaskResponse;
import com.sahajit.taskflow.dto.UpdateTaskRequest;
import com.sahajit.taskflow.entity.Priority;
import com.sahajit.taskflow.entity.TaskStatus;
import com.sahajit.taskflow.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping
    public TaskResponse createTask(
            @Valid @RequestBody CreateTaskRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return taskService.createTask(request, userEmail);
    }

    @GetMapping
    public Page<TaskResponse> getAllTasks(
            Authentication authentication,

            @RequestParam(defaultValue = "0")
            int page,

            @RequestParam(defaultValue = "10")
            int size,

            @RequestParam(defaultValue = "createdAt")
            String sortBy,

            @RequestParam(required = false)
            TaskStatus status,

            @RequestParam(required = false)
            Priority priority,

            @RequestParam(required = false)
            String search
    ) {
        return taskService.getAllTasks(
                authentication.getName(),
                page,
                size,
                sortBy,
                status,
                priority,
                search
        );
    }
    @GetMapping("/{taskId}")
    public TaskResponse getTaskById(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return taskService.getTaskById(taskId, userEmail);
    }
    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();

        return taskService.updateTask(taskId, request, userEmail);
    }
    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(
            @PathVariable Long taskId,
            Authentication authentication
    ) {
        taskService.deleteTask(taskId, authentication.getName());

        return ResponseEntity.ok("Task deleted successfully");
    }
}
