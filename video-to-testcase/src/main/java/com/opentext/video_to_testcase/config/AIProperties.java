package com.opentext.video_to_testcase.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "ai")
public class AIProperties {

    private OpenAi openai = new OpenAi();
    private Gemini gemini = new Gemini();

    @Data
    public static class OpenAi {
        private String apiKey;
        private String model;
    }

    @Data
    public static class Gemini {
        private String apiKey;
        private String model;
    }
}
