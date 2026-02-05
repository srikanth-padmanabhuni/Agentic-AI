package com.opentext.video_to_testcase.services;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.opentext.video_to_testcase.aiservices.SummaryService;

@Service
@RequiredArgsConstructor
public class SummaryAgentService {

    private final GoogleAiGeminiChatModel chatModel;

    public String generateSummary(String transcript) {
        SummaryService service = AiServices.builder(SummaryService.class)
            .chatModel(chatModel)
            .build();
        return service.generateSummary(transcript);
    }
}
