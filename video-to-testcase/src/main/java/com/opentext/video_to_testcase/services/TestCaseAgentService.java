package com.opentext.video_to_testcase.services;

import dev.langchain4j.model.googleai.GoogleAiGeminiChatModel;
import dev.langchain4j.service.AiServices;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.opentext.video_to_testcase.aiservices.TestCaseService;

@Service
@RequiredArgsConstructor
public class TestCaseAgentService {

    private final GoogleAiGeminiChatModel chatModel;

    public String generateTestCases(String summary) {
        TestCaseService service = AiServices.builder(TestCaseService.class)
            .chatModel(chatModel)
            .build();
        return service.generateTestCases(summary);
    }
}
