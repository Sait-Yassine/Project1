package com.example.brilliant.controller;

import com.example.brilliant.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/users/{userId}/make-admin")
    public ResponseEntity<Void> makeUserAdmin(@PathVariable Long userId) {
        adminService.makeUserAdmin(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/remove-admin")
    public ResponseEntity<Void> removeUserAdmin(@PathVariable Long userId) {
        adminService.removeUserAdmin(userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }
} 