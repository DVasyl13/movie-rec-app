package com.app.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "movie_details")
@Getter @Setter
@ToString @EqualsAndHashCode
@NoArgsConstructor
public class MovieDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "year", nullable = false)
    private Integer year;

    @Column(name = "release_date", nullable = false)
    private Timestamp releaseDate;

    @Column(name = "runtime_mins", nullable = false)
    private Integer runtimeMins;

    @Column(name = "plot", nullable = false, length = 1024)
    private String plot;

    @Column(name = "genres")
    private String genres;

    @Column(name = "awards")
    private String awards;

    @Column(name = "countries")
    private String countries;

    @Column(name = "companies")
    private String companies;

    @Column(name = "ibdb_rating", length = 4)
    private String imdbRating;

    @Column(name = "ibdb_rating_votes")
    private Integer imdbRatingVotes;

    @Column(name = "metacritic_rating", length = 4)
    private String metacriticRating;

    @Column(name = "trailer")
    private String trailer;

    @Column(name = "budget")
    private String budget;

    @Column(name = "open_weekend_usa")
    private String opUsa;

    @Column(name = "worldwide_gross")
    private String worldwideGross;

    @ManyToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JoinTable(
            name = "movie_details_director",
            joinColumns = { @JoinColumn(name = "movie_details_id") },
            inverseJoinColumns = { @JoinColumn(name = "director_id") }
    )
    private Set<Director> directors = new HashSet<>();

    @ManyToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JoinTable(
            name = "movie_details_actor",
            joinColumns = { @JoinColumn(name = "movie_details_id") },
            inverseJoinColumns = { @JoinColumn(name = "actor_id") }
    )
    private Set<Actor> actors = new HashSet<>();

    @ManyToMany(cascade = { CascadeType.ALL }, fetch = FetchType.LAZY)
    @JsonManagedReference
    @JoinTable(
            name = "movie_details_writer",
            joinColumns = { @JoinColumn(name = "movie_details_id") },
            inverseJoinColumns = { @JoinColumn(name = "writer_id") }
    )
    private Set<Writer> writers = new HashSet<>();


    @OneToOne(mappedBy = "movieDetails")
    private Movie movie;
}
