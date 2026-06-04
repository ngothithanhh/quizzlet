package com.example.quizzlet.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Data
public class FavoriteId implements Serializable {
    private Long userId;
    private Long studySetId;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof FavoriteId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(studySetId, that.studySetId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, studySetId);
    }
}
