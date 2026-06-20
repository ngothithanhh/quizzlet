package com.example.quizzlet.service.impl;

import com.example.quizzlet.service.LanguageDetectService;
import com.google.common.base.Optional;
import com.optimaize.langdetect.LanguageDetector;
import com.optimaize.langdetect.LanguageDetectorBuilder;
import com.optimaize.langdetect.i18n.LdLocale;
import com.optimaize.langdetect.ngram.NgramExtractors;
import com.optimaize.langdetect.profiles.LanguageProfile;
import com.optimaize.langdetect.profiles.LanguageProfileReader;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Arrays;
import com.optimaize.langdetect.i18n.LdLocale;

@Service
public class LanguageDetectServiceImpl implements LanguageDetectService {

    private LanguageDetector detector;

    @PostConstruct
    public void init() {
        try {
            List<LdLocale> locales = Arrays.asList(
                    LdLocale.fromString("en"),
                    LdLocale.fromString("vi"),
                    LdLocale.fromString("fr"),
                    LdLocale.fromString("de"),
                    LdLocale.fromString("es"),
                    LdLocale.fromString("ja"),
                    LdLocale.fromString("ko"),
                    LdLocale.fromString("zh-CN"),
                    LdLocale.fromString("zh-TW"),
                    LdLocale.fromString("ru"),
                    LdLocale.fromString("it"),
                    LdLocale.fromString("pt")
            );

            List<LanguageProfile> languageProfiles =
                    new LanguageProfileReader().readBuiltIn(locales);

            this.detector = LanguageDetectorBuilder.create(NgramExtractors.standard())
                    .withProfiles(languageProfiles)
                    .build();

        } catch (Exception e) {
            this.detector = null;
            System.err.println("Không khởi tạo được LanguageDetector: " + e.getMessage());
        }
    }

    @Override
    public String detect(String text) {
        if (text == null || text.isBlank()) {
            return "en";
        }

        if (detector == null) {
            return "en";
        }

        Optional<LdLocale> lang = detector.detect(text);

        return lang.isPresent() ? lang.get().getLanguage() : "en";
    }
}