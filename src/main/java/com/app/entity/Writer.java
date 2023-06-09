package com.app.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
@ToString(exclude = {"movies"})
public class Writer {
    @Id
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToMany(mappedBy = "writers")
    @JsonBackReference
    private Set<MovieDetails> movies = new HashSet<>();

}
