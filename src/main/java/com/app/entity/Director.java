package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "director")
@Getter @Setter
@ToString @EqualsAndHashCode
@NoArgsConstructor
public class Director {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "directors")
    @JsonBackReference
    private Set<MovieDetails> movies = new HashSet<>();
}
