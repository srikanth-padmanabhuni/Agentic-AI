package com.opentext.video_to_testcase.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(AIProperties.class)
public class AIConfig {

    private final AIProperties aiProperties;

    public AIConfig(AIProperties aiProperties) {
        this.aiProperties = aiProperties;
    }

    public AIProperties.OpenAi getOpenAi() {
        return aiProperties.getOpenai();
    }

    public AIProperties.Gemini getGemini() {
        return aiProperties.getGemini();
    }
}
