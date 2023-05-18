package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "writer")
@Setter
@Getter
@EqualsAndHashCode
@ToString
public class Writer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "imdb_id")
    private String imdbId;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "writers")
    @JsonBackReference
    private Set<MovieDetails> movies = new HashSet<>();

}
