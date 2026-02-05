package com.opentext.video_to_testcase.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.opentext.video_to_testcase.services.VideoToTestCaseOrchestrator;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/video")
@RequiredArgsConstructor
public class VideoController {

    private final VideoToTestCaseOrchestrator orchestrator;

    @PostMapping("/analyze")
    public String analyze(@RequestParam MultipartFile videoFile) throws Exception {
        Path tempFile = Files.createTempFile("", videoFile.getOriginalFilename());
        videoFile.transferTo(tempFile);
        return this.orchestrator.process(tempFile.toFile());
    }

}
