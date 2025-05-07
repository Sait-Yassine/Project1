package com.example.brilliant.repository;

import com.example.brilliant.entity.AccountInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountInfoRepository extends JpaRepository<AccountInfo, Long> {
    Optional<AccountInfo> findByUserId(Long userId);
} 