package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Test;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRepository extends JpaRepository<Test, Long> {
}
