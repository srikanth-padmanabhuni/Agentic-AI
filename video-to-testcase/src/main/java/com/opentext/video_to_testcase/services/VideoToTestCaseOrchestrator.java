package com.opentext.video_to_testcase.services;

import org.slf4j.LoggerFactory;

import ch.qos.logback.classic.Logger;
import java.io.File;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VideoToTestCaseOrchestrator {

    Logger logger = (Logger) LoggerFactory.getLogger(VideoToTestCaseOrchestrator.class);


    private final AudioExtractor audioExtractor;
    private final GeminiAudioTranscriptionService geminiAudioTranscriptionService;
    private final SummaryAgentService summaryAgent;
    private final TestCaseAgentService testCaseAgent;

    public String process(File videoFile) {

        File audioFile = null;
        try {
            audioFile = audioExtractor.extract(videoFile);

            if (audioFile == null) {
                throw new IllegalStateException("Empty audioFile received from Extractor");
            }
            logger.info("Audio extraction completed. Audio file path: " + audioFile.getAbsolutePath());

            String transcript = geminiAudioTranscriptionService.transcribe(audioFile.toPath());
            if (transcript.isBlank()) {
                throw new IllegalStateException("Empty transcript received from Whisper");
            }
            logger.info("Transcription completed. Transcript: " + transcript);

            String summary = summaryAgent.generateSummary(transcript);
            if (summary.isBlank()) {
                throw new IllegalStateException("Empty summary received from Summary Agent");
            }
            logger.info("Summary generation completed. Summary: " + summary);

            String testCases = testCaseAgent.generateTestCases(summary);
            if (testCases.isBlank()) {
                throw new IllegalStateException("Empty testCases received from Test Case Agent");
            }
            logger.info("Test case generation completed. Test Cases: " + testCases);

            return testCases;
        } catch (Exception e) {
            throw new RuntimeException("Error processing video: " + videoFile.getName(), e);
        } finally {
            // Ensure temp audio file is deleted
            if (audioFile != null && audioFile.exists()) {
                boolean deleted = audioFile.delete();
                if (!deleted) {
                    logger.warn("Failed to delete temporary audio file: " + audioFile.getAbsolutePath());
                }
            }
        }
    }

}
