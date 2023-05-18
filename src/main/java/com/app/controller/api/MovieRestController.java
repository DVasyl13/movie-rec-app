package com.app.controller.api;

import com.app.entity.Movie;
import com.app.service.MovieService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vi/movie")
@RequiredArgsConstructor
public class MovieRestController {

    private final MovieService movieService;

    @GetMapping
    @RequestMapping("/{id}")
    public Movie getSomething(@PathVariable(name = "id") String id) {
        return movieService.getFullMovie(id);
    }


}
