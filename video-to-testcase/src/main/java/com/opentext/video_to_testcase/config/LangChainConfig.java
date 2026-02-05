package com.opentext.video_to_testcase.config;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.google.genai.Client;

@Configuration
public class LangChainConfig {

    private final AIConfig aiConfig;

    public LangChainConfig(AIConfig aiConfig) {
        this.aiConfig = aiConfig;
    }

    @Bean
    GoogleAiGeminiChatModel chatModel() {
        return GoogleAiGeminiChatModel.builder()
            .apiKey(this.aiConfig.getOpenAi().getApiKey())
            .modelName(this.aiConfig.getOpenAi().getModel())
            .build();
    }

    @Bean
    Client geminiClient() {
        return Client.builder()
            .apiKey(this.aiConfig.getGemini().getApiKey())
            .build();
    }

}
