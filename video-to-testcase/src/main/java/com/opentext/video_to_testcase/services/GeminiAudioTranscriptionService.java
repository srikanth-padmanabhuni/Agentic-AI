package com.opentext.video_to_testcase.services;

import com.google.genai.Client;
import com.google.genai.types.Blob;
import com.google.genai.types.Content;
import com.google.genai.types.GenerateContentConfig;
import com.google.genai.types.Part;
import com.google.genai.types.GenerateContentResponse;
import org.springframework.stereotype.Service;

import com.opentext.video_to_testcase.config.AIConfig;
import com.opentext.video_to_testcase.utility.StaticData;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class GeminiAudioTranscriptionService {

    private final Client client;
    private final AIConfig aiConfig;

    public String transcribe(Path audioPath) {
        try {
            byte[] audioBytes = Files.readAllBytes(audioPath);

            Blob audioBlob = Blob.builder()
                .mimeType("audio/wav") // adjust if needed
                .data(audioBytes)
                .build();

            Content content = Content.builder()
                .parts(List.of(
                    Part.builder()
                        .text(StaticData.AUDIO_ANALYSIS_PROMPT)
                        .build(),
                    Part.builder()
                        .inlineData(audioBlob)
                        .build()
                ))
                .build();

            GenerateContentConfig config =
                GenerateContentConfig.builder()
                    .temperature(0.0f)
                    .build();

            GenerateContentResponse response =
                client.models.generateContent(aiConfig.getGemini().getModel(),
                    List.of(content),
                    config);

            return response.text();

        } catch (Exception e) {
            throw new RuntimeException("Gemini audio transcription failed", e);
        }
    }
}
