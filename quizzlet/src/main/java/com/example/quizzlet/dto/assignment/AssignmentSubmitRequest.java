package com.example.quizzlet.dto.assignment;

import com.example.quizzlet.dto.learn.QuestionAnswerRequest;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AssignmentSubmitRequest {
    private List<QuestionAnswerRequest> answers;

}
