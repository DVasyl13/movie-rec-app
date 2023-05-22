package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;


@Entity
@Table(name = "movie")
@Getter
@Setter
@ToString(exclude = {"movieDetails"})
@NoArgsConstructor
public class Movie {

    @Id
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "image", nullable = false)
    private String image;

    @OneToOne(mappedBy = "movie", fetch = FetchType.LAZY)
    private MovieDetails movieDetails;

    @ManyToMany(mappedBy = "watchedMovies")
    @JsonBackReference
    private Set<User> usersWatched = new HashSet<>();

    @ManyToMany(mappedBy = "likedMovies")
    @JsonBackReference
    private Set<User> usersLiked = new HashSet<>();

    @ManyToMany(mappedBy = "ignoredMovies")
    @JsonBackReference
    private Set<User> usersIgnored = new HashSet<>();

    public void setMovieDetails(MovieDetails movieDetails) {
        this.movieDetails = movieDetails;
        this.movieDetails.setMovie(this);
    }
}
