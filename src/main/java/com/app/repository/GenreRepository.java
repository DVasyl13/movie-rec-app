package com.app.repository;

import com.app.dto.GenreDto;
import com.app.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GenreRepository extends JpaRepository<Genre, Long> {

    @Query("select new com.app.dto.GenreDto(g.id, g.name) from Genre g " +
            "left join g.movieDetails md " +
            "left join md.movie m " +
            "left join m.usersLiked ul" +
            " where ul.id=?1 " +
            "group by g.id, g.name " +
            "order by count(g.id) desc")
    List<GenreDto> getGenresByUsersLikedMovies(Long id);

}
