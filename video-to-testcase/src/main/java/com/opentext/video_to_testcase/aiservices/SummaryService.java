package com.opentext.video_to_testcase.aiservices;

import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

import com.opentext.video_to_testcase.utility.StaticData;

@AiService
public interface SummaryService {
    @SystemMessage(StaticData.SUMMARY_SYSTEM_MESSAGE)
    String generateSummary(
        @UserMessage("""
            Transcript:
            {{transcript}}
            """)
        String transcript
    );
}
