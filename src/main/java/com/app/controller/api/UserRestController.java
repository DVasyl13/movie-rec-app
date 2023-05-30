package com.app.controller.api;

import com.app.dto.*;
import com.app.service.MovieService;
import com.app.service.UserService;
import com.app.util.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;
    private final MovieService movieService;

    @PostMapping
    @RequestMapping
    public ResponseEntity<Object> getUserDetails(@RequestBody UserFullSubmission user) {
        var userResponse = userService.getUserDetails(user);
        return ResponseHandler.generateResponse("User had been successfully found", HttpStatus.OK, userResponse);
    }

    @PutMapping
    @RequestMapping("/liked")
    public ResponseEntity<Object> doToggleToLiked(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserLikedMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }

    @PutMapping
    @RequestMapping("/ignored")
    public ResponseEntity<Object> doToggleToIgnored(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserIgnoredMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }

    @PutMapping
    @RequestMapping("/watched")
    public ResponseEntity<Object> doToggleToWatched(@RequestBody UserPutDto user) {
        var userResponse = userService.toggleUserWatchedMovie(user);
        return ResponseHandler.generateResponse("Movie added successfully", HttpStatus.OK, userResponse);
    }

    @GetMapping
    @RequestMapping("/{id}/liked")
    public Set<MovieDto> getUsersLikedMovies(@PathVariable("id") Long id) {
        return userService.getUsersLikedMovies(id);
    }

    @GetMapping
    @RequestMapping("/{id}/ignored")
    public Set<MovieDto> getUsersIgnoredMovies(@PathVariable("id") Long id) {
        return userService.getUsersIgnoredMovies(id);
    }

    @GetMapping
    @RequestMapping("/{id}/watched")
    public Set<MovieDto> getUsersWatchedMovies(@PathVariable("id") Long id) {
        return userService.getUsersWatchedMovies(id);
    }

    @GetMapping
    @RequestMapping("/{id}/director-based-movies")
    public Set<MovieSmallDto> getDirectorBasedMovies(@PathVariable("id") Long id) {
     return movieService.getMoviesBasedOnDirectors(id);
    }

    @GetMapping
    @RequestMapping("/{id}/genres-based-movies")
    public Set<MovieSmallDto> getGenresBasedMovies(@PathVariable("id") Long id) {
        return movieService.getMoviesBasedOnGenres(id);
    }

    @GetMapping
    @RequestMapping("/{id}/similar-based-movies")
    public Set<MovieSmallDto> getGenresBasedSimilar(@PathVariable("id") Long id) {
        return movieService.getMoviesBasedOnSimilars(id);
    }

}
