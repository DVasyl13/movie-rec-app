package com.app.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/movie")
@RequiredArgsConstructor
public class MovieController {

    @GetMapping("/all")
    public String getAllMoviesPage() {
        return "movies";
    }

    @GetMapping("/{id}")
    public String getMoviePage(@PathVariable String id) {
        return "movie";
    }

    @GetMapping("/for-you")
    public String getForYouPage() {
        return "for-you";
    }

    @GetMapping("/saved")
    public String getSavedPage() {
        return "saved";
    }

}

