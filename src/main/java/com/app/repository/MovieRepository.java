package com.app.repository;

import com.app.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query("select m from Movie m left join fetch Director d " +
            "left join fetch Actor a " +
            "left join  fetch Writer w " +
            "left join fetch MovieDetails md " +
            "where m.imdbId=?1")
    Movie findMovieByImdbId(String imdbId);
}
