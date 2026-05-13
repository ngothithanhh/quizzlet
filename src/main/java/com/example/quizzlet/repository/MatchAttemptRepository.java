package com.example.quizzlet.repository;

import com.example.quizzlet.entity.MatchAttempt;
import com.example.quizzlet.entity.MatchSession;
import org.apache.xmlbeans.impl.regex.Match;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatchAttemptRepository extends JpaRepository<MatchAttempt,Long> {
}
