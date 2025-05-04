// src/main/java/com/example/brilliant/repository/UserRepository.java
package com.example.brilliant.repository;

import com.example.brilliant.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
