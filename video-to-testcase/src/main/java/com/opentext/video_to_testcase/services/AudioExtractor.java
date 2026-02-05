package com.opentext.video_to_testcase.services;

import java.io.File;
import lombok.RequiredArgsConstructor;

import org.bytedeco.ffmpeg.global.avcodec;
import org.bytedeco.javacv.FFmpegFrameGrabber;
import org.bytedeco.javacv.FFmpegFrameRecorder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AudioExtractor {

    public File extract(File videoFile) throws Exception {

        String fileName = videoFile.getName();

        File audioFile = File.createTempFile(fileName, ".mp3");

        try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(videoFile)) {
            grabber.start();

            // Safety check for silent videos
            if (grabber.getAudioChannels() == 0) {
                throw new RuntimeException("No audio track found in video.");
            }

            try (FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(audioFile, grabber.getAudioChannels())) {
                recorder.setFormat("mp3");
                recorder.setAudioCodec(avcodec.AV_CODEC_ID_MP3);
                recorder.setSampleRate(grabber.getSampleRate());
                // Set a standard bitrate if original is unknown
                recorder.setAudioBitrate(grabber.getAudioBitrate() > 0 ? grabber.getAudioBitrate() : 128000);
                recorder.start();

                org.bytedeco.javacv.Frame frame;
                while ((frame = grabber.grabFrame()) != null) {
                    if (frame.samples != null) {
                        recorder.record(frame);
                    }
                }
                recorder.stop();
            }
            grabber.stop();
        }
        return audioFile;
    }
}
