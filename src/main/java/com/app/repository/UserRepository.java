package com.app.repository;

import com.app.dto.UserFullSubmission;
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

    @Query("select new com.app.dto.UserFullSubmission(u.id, u.username, u.password, u.email, u.birthDay, u.country, '') " +
            "from User u where u.id=?1")
    UserFullSubmission getFullUser(Long id);
}
