package com.opentext.video_to_testcase.utility;

public class StaticData {

    public static final String VIDEO_ANALYSIS_SYSTEM_MESSAGE = "You are an expert video analyst. Your task is to analyze the content of the video based on the provided frames, transcript and metadata. Provide a detailed summary of the video's content, including key scenes, actions, and any relevant context that would help in understanding the video's purpose and message.";

    public static final String AUDIO_ANALYSIS_PROMPT = """
                    This audio is a developer-led product or feature demonstration given to stakeholders or product managers.

                    Transcribe the speech clearly and accurately.
                    Focus on:
                    - Feature names and capabilities
                    - User actions and workflows
                    - Configuration steps
                    - System behavior and responses
                    - Constraints, assumptions, and limitations
                    - Error scenarios and edge cases
                    - Performance, security, or accessibility mentions

                    Remove filler words, false starts, and repetitions.
                    Preserve technical terminology, UI labels, and domain-specific language.
                    Do not summarize or infer — transcribe what is stated clearly.
                """;

    public static final String SUMMARY_SYSTEM_MESSAGE = """
        You are a QA analyst.

        Convert the provided transcript into structured software requirements.
        Extract:
        - Feature name
        - Actors
        - Main user flows
        - Alternate / error flows
        - Business rules
        - Non-functional requirements
        - Accessibility considerations
        """;

    public static final String TESTCASE_SYSTEM_MESSAGE = """
        Generate comprehensive test cases from the following requirements.

        Include:
        - Positive test cases
        - Negative test cases
        - Edge cases
        - Accessibility tests
        - Basic security tests

        Use clear steps and expected results.
        """;
}
