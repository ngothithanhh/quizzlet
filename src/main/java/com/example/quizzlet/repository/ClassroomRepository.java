package com.example.quizzlet.repository;

import com.example.quizzlet.entity.Classroom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
    Optional<Classroom> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);

    List<Classroom> findByOwnerId(Long ownerId);

}
