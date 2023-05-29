package com.app.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "similar_movie")
@Getter
@Setter
@ToString
public class SimilarMovie {
    @Id
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "image", nullable = false)
    private String image;

    @Column(name = "im_db_rating", length = 4)
    private Float imDbRating;

    @ManyToMany(mappedBy = "movies")
    @JsonBackReference
    private Set<MovieDetails> movieDetails = new HashSet<>();
}
