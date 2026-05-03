package com.example.quizzlet.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
public class ClassMemberId implements Serializable {
    private Long classId;
    private Long userId;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ClassMemberId that)) return false;
        return Objects.equals(classId, that.classId) && Objects.equals(userId, that.userId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(classId, userId);
    }
}
