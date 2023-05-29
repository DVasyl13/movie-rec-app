package com.app.repository;

import com.app.dto.MovieSmallDto;
import com.app.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    @Query( value =
            "select m.id, m.title, m.image " +
            "from moviedb.movie m " +
            "inner join (select ulm.movie_id, count(*) from moviedb.user_liked_movies ulm group by ulm.movie_id " +
            "            order by count(ulm.movie_id) DESC limit 18) t ON t.movie_id=m.id", nativeQuery = true)
    Set<Movie> getFavouriteUsersMovies();

//    @Query("select new com.app.dto.MovieSmallDto('', m.id, m.title, m.image) " +
//            "from Movie m " +
//            "left join m.usersIgnored ui " +
//            "left join m.usersWatched uw " +
//            "where ui.id=?1 and ui.id=?1")
//    Set<MovieSmallDto> getMoviesNotToRecommend(Long id);
}
