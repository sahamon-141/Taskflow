package com.sahajit.taskflow.util;

import com.sahajit.taskflow.entity.*;
import org.springframework.data.jpa.domain.Specification;

public class TaskSpecification {

    public static Specification<Task> belongsToUser(User user) {
        return (root, query, cb) ->
                cb.equal(root.get("user"), user);
    }

    public static Specification<Task> hasStatus(TaskStatus status) {
        return (root, query, cb) ->
                cb.equal(root.get("status"), status);
    }

    public static Specification<Task> hasPriority(Priority priority) {
        return (root, query, cb) ->
                cb.equal(root.get("priority"), priority);
    }

    public static Specification<Task> titleContains(String search) {
        return (root, query, cb) ->
                cb.like(
                        cb.lower(root.get("title")),
                        "%" + search.toLowerCase() + "%"
                );
    }
}