package com.app.repository;

import com.app.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

    @Query("select u from User u " +
            "left join fetch u.likedMovies lm " +
            "left join fetch u.ignoredMovies im " +
            "left join fetch u.watchedMovies wm " +
            "where u.id = ?1")
    Optional<User> findById(Long id);

}
