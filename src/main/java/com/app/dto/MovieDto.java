package com.app.dto;

import java.sql.Timestamp;
import java.util.Set;

public record MovieDto(String id, Long idDigit, String fullTitle, String image,
                       Integer year, Timestamp releaseDate, Integer runtimeMins,
                       String plot, String awards, String countries, Set<GenreDto> genreList,
                       String companies, String imDbRating, Integer imDbRatingVotes, TrailerDto trailer,
                       String metacriticRating, BoxOffice boxOffice, Set<MovieSmallDto> similars,
                       Set<PersonDto> directorList, Set<PersonDto> writerList, Set<ActorDto> actorList) {
}
