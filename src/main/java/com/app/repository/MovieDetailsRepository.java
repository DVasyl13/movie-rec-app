package com.app.repository;


import com.app.entity.MovieDetails;
import io.micrometer.common.lang.NonNullApi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.Set;

public interface MovieDetailsRepository extends JpaRepository<MovieDetails, Long> {

    @Query("select md from MovieDetails md " +
            "left join fetch md.movie m" +
            "left join fetch md.movies sm " +
            "left join fetch md.genres g " +
            "left join fetch md.actors a " +
            "left join fetch md.directors d " +
            "left join fetch md.writers w " +
            "where md.id=?1 " )
    Optional<MovieDetails> findById(Long id);


    //TODO: Make it pageable
    @Query("select md from MovieDetails md " +
            "left join md.movie m " +
            "left join m.usersLiked ul " +
            "where ul.id =?1")
    Set<MovieDetails> findLikedMovieByUserId(Long id);

    @Query("select md from MovieDetails md " +
            "left join md.movie m " +
            "left join m.usersIgnored ui " +
            "where ui.id =?1")
    Set<MovieDetails> findIgnoredMovieByUserId(Long id);

    @Query("select md from MovieDetails md " +
            "left join md.movie m " +
            "left join m.usersWatched uw " +
            "where uw.id =?1")
    Set<MovieDetails> findWatchedMovieByUserId(Long id);
}
