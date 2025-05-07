package com.example.brilliant.controller;

import com.example.brilliant.entity.Video;
import com.example.brilliant.entity.Course;
import com.example.brilliant.repository.VideoRepository;
import com.example.brilliant.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/videos")
public class VideoController {
    @Autowired
    private VideoRepository videoRepository;
    @Autowired
    private CourseRepository courseRepository;

    @GetMapping
    public List<Video> getAllVideos() {
        return videoRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Video> getVideoById(@PathVariable Long id) {
        return videoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Video> createVideo(@RequestBody Video video) {
        if (video.getCourse() != null && video.getCourse().getId() != null) {
            Course course = courseRepository.findById(video.getCourse().getId()).orElse(null);
            if (course == null) return ResponseEntity.badRequest().build();
            video.setCourse(course);
        }
        return ResponseEntity.ok(videoRepository.save(video));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Video> updateVideo(@PathVariable Long id, @RequestBody Video updated) {
        return videoRepository.findById(id)
                .map(video -> {
                    video.setTitle(updated.getTitle());
                    video.setDescription(updated.getDescription());
                    video.setThumbnail(updated.getThumbnail());
                    if (updated.getCourse() != null && updated.getCourse().getId() != null) {
                        Course course = courseRepository.findById(updated.getCourse().getId()).orElse(null);
                        if (course != null) video.setCourse(course);
                    }
                    return ResponseEntity.ok(videoRepository.save(video));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        if (!videoRepository.existsById(id)) return ResponseEntity.notFound().build();
        videoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
} 