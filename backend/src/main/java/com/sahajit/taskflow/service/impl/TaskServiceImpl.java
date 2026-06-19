package com.sahajit.taskflow.service.impl;

import com.sahajit.taskflow.dto.CreateTaskRequest;
import com.sahajit.taskflow.dto.TaskResponse;
import com.sahajit.taskflow.entity.Task;
import com.sahajit.taskflow.entity.User;
import com.sahajit.taskflow.exception.BadRequestException;
import com.sahajit.taskflow.repository.TaskRepository;
import com.sahajit.taskflow.repository.UserRepository;
import com.sahajit.taskflow.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.sahajit.taskflow.dto.UpdateTaskRequest;
import java.util.List;
import com.sahajit.taskflow.entity.Priority;
import com.sahajit.taskflow.entity.TaskStatus;
import com.sahajit.taskflow.util.TaskSpecification;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    @Override
    public TaskResponse createTask(CreateTaskRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority())
                .dueDate(request.getDueDate())
                .user(user)
                .build();

        Task savedTask = taskRepository.save(task);

        return TaskResponse.builder()
                .id(savedTask.getId())
                .title(savedTask.getTitle())
                .description(savedTask.getDescription())
                .priority(savedTask.getPriority())
                .status(savedTask.getStatus())
                .dueDate(savedTask.getDueDate())
                .createdAt(savedTask.getCreatedAt())
                .updatedAt(savedTask.getUpdatedAt())
                .build();
    }
    @Override
    public Page<TaskResponse> getAllTasks(
            String userEmail,
            int page,
            int size,
            String sortBy,
            TaskStatus status,
            Priority priority,
            String search
    ) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(sortBy).descending()
        );

        Specification<Task> spec = Specification.where(
                TaskSpecification.belongsToUser(user)
        );

        if (status != null) {
            spec = spec.and(TaskSpecification.hasStatus(status));
        }

        if (priority != null) {
            spec = spec.and(TaskSpecification.hasPriority(priority));
        }

        if (search != null && !search.isBlank()) {
            spec = spec.and(TaskSpecification.titleContains(search));
        }

        Page<Task> taskPage = taskRepository.findAll(spec, pageable);

        return taskPage.map(task ->
                TaskResponse.builder()
                        .id(task.getId())
                        .title(task.getTitle())
                        .description(task.getDescription())
                        .priority(task.getPriority())
                        .status(task.getStatus())
                        .dueDate(task.getDueDate())
                        .createdAt(task.getCreatedAt())
                        .updatedAt(task.getUpdatedAt())
                        .build()
        );
    }
    @Override
    public TaskResponse getTaskById(Long taskId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new BadRequestException("Task not found"));

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .priority(task.getPriority())
                .status(task.getStatus())
                .dueDate(task.getDueDate())
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
    @Override
    public TaskResponse updateTask(
            Long taskId,
            UpdateTaskRequest request,
            String userEmail
    ) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new BadRequestException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setPriority(request.getPriority());
        task.setStatus(request.getStatus());
        task.setDueDate(request.getDueDate());

        Task updatedTask = taskRepository.save(task);

        return TaskResponse.builder()
                .id(updatedTask.getId())
                .title(updatedTask.getTitle())
                .description(updatedTask.getDescription())
                .priority(updatedTask.getPriority())
                .status(updatedTask.getStatus())
                .dueDate(updatedTask.getDueDate())
                .createdAt(updatedTask.getCreatedAt())
                .updatedAt(updatedTask.getUpdatedAt())
                .build();
    }
    @Override
    public void deleteTask(Long taskId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        Task task = taskRepository.findByIdAndUser(taskId, user)
                .orElseThrow(() -> new BadRequestException("Task not found"));

        taskRepository.delete(task);
    }
}