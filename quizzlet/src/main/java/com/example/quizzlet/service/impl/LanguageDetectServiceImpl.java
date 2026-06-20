package com.example.quizzlet.service.impl;

import com.example.quizzlet.service.LanguageDetectService;
import com.google.common.base.Optional;
import com.optimaize.langdetect.LanguageDetector;
import com.optimaize.langdetect.LanguageDetectorBuilder;
import com.optimaize.langdetect.i18n.LdLocale;
import com.optimaize.langdetect.ngram.NgramExtractors;
import com.optimaize.langdetect.profiles.LanguageProfile;
import com.optimaize.langdetect.profiles.LanguageProfileReader;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import jakarta.annotation.PostConstruct;


@Service
@RequiredArgsConstructor
public class LanguageDetectServiceImpl implements LanguageDetectService {
    private LanguageDetector detector;

    @PostConstruct
    public void init() throws IOException {
        List<LanguageProfile> languageProfiles = new LanguageProfileReader().readAllBuiltIn();

        this.detector = LanguageDetectorBuilder.create(NgramExtractors.standard())
                .withProfiles(languageProfiles)
                .build();
    }

    @Override
    public String detect(String text) {
        Optional<LdLocale> lang = detector.detect(text);

        if (lang.isPresent()) {
            return lang.get().getLanguage();
        }
        return "en";
    }


}
