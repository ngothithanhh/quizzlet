package com.example.quizzlet.dto.flashcard;

import com.example.quizzlet.enums.MediaSide;
import com.example.quizzlet.enums.MediaType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardMediaResponse {
    private Long id;

    private String url;

    private MediaType type;

    private MediaSide side;
}
