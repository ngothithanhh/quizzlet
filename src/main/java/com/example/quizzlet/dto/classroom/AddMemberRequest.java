package com.example.quizzlet.dto.classroom;

import com.example.quizzlet.enums.ClassRole;
import lombok.Data;

@Data
public class AddMemberRequest {
    private Long userId;
    private ClassRole role;
}
