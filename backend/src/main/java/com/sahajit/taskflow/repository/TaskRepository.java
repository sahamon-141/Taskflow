package com.sahajit.taskflow.repository;

import com.sahajit.taskflow.entity.Task;
import com.sahajit.taskflow.entity.User;
import org.springframework.data.jpa.repository.*;
import java.util.List;
import java.util.Optional;

public interface TaskRepository extends
        JpaRepository<Task, Long>,
        JpaSpecificationExecutor<Task> {

    List<Task> findByUser(User user);

    Optional<Task> findByIdAndUser(Long id, User user);
}