package com.app.controller.api;

import com.app.dto.MovieDto;
import com.app.dto.MovieSmallDto;
import com.app.entity.Movie;
import com.app.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/vi/movie")
@RequiredArgsConstructor
public class MovieRestController {

    private final MovieService movieService;

    @GetMapping
    @RequestMapping("/{id}")
    public MovieDto getMovie(@PathVariable(name = "id") String id) {
        return movieService.getFullMovie(id);
    }


    @GetMapping
    @RequestMapping("/top250")
    public List<MovieSmallDto> getTopMovies() {
        return movieService.getTopMoviesFroIMDb();
    }

    @GetMapping
    @RequestMapping("/popular")
    public List<MovieSmallDto> getPopularMovies() {
        return movieService.getMostPopularMovies();
    }

    @GetMapping
    @RequestMapping("/favourite")
    public Set<MovieSmallDto> getFavouriteMovies() {
        return movieService.getUsersFavouriteMovies();
    }
}
