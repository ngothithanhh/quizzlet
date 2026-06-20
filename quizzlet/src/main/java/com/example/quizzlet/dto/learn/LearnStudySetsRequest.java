package com.example.quizzlet.dto.learn;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class LearnStudySetsRequest {
    private List<Long> studySetsId;
}
