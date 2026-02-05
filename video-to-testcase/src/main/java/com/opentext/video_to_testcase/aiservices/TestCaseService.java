package com.opentext.video_to_testcase.aiservices;

import com.opentext.video_to_testcase.utility.StaticData;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface TestCaseService {
    @SystemMessage(StaticData.TESTCASE_SYSTEM_MESSAGE)
    String generateTestCases(
        @UserMessage("""
            Requirements:
            {{requirements}}
            """)
        String requirements
    );
}
