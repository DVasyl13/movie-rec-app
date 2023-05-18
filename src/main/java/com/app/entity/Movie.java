package com.app.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "movie")
@Getter
@Setter
@ToString
@NoArgsConstructor
@EqualsAndHashCode
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imdb_id", nullable = false)
    private String imdbId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "image", nullable = false)
    private String image;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", referencedColumnName = "id",
            foreignKey = @ForeignKey(name = "movie_movie_details_FK"))
    private MovieDetails movieDetails;
}
