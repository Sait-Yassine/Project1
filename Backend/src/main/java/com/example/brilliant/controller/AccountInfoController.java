package com.example.brilliant.controller;

import com.example.brilliant.entity.AccountInfo;
import com.example.brilliant.entity.User;
import com.example.brilliant.repository.AccountInfoRepository;
import com.example.brilliant.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/account-info")
public class AccountInfoController {
    @Autowired
    private AccountInfoRepository accountInfoRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<AccountInfo> getAccountInfoByUserId(@PathVariable Long userId) {
        return accountInfoRepository.findByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<AccountInfo> createAccountInfo(@RequestBody AccountInfo info) {
        if (info.getUser() == null || info.getUser().getId() == null) {
            return ResponseEntity.badRequest().build();
        }
        Optional<User> userOpt = userRepository.findById(info.getUser().getId());
        if (userOpt.isEmpty()) return ResponseEntity.badRequest().build();
        info.setUser(userOpt.get());
        return ResponseEntity.ok(accountInfoRepository.save(info));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AccountInfo> updateAccountInfo(@PathVariable Long id, @RequestBody AccountInfo updated) {
        return accountInfoRepository.findById(id)
                .map(info -> {
                    info.setBio(updated.getBio());
                    return ResponseEntity.ok(accountInfoRepository.save(info));
                })
                .orElse(ResponseEntity.notFound().build());
    }
} 