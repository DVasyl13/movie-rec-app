package com.app.repository;

import com.app.dto.PersonDto;
import com.app.entity.Director;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DirectorRepository extends JpaRepository<Director, Long> {

    @Query("select new com.app.dto.PersonDto('', d.id, d.name ) from Director d " +
            "left join d.movies ms " +
            "left join ms.movie m " +
            "left join m.usersLiked " +
            "group by d.id, d.name " +
            "order by count(d.id) desc")
    List<PersonDto> getDirectorByUsersLikedMovies(Long id);
}
