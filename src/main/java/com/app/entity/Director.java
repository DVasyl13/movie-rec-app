package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "director")
@Getter @Setter
@ToString(exclude = {"movies"})
@NoArgsConstructor
public class Director {
    @Id
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "directors")
    @JsonBackReference
    private Set<MovieDetails> movies = new HashSet<>();
}
