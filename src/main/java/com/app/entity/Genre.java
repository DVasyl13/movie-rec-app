package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "genre")
@Getter @Setter
@ToString(exclude = {"movieDetails"})
public class Genre {
    @Id
    @Column(length = 64)
    private String id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "genres")
    @JsonBackReference
    Set<MovieDetails> movieDetails = new HashSet<>();
}
