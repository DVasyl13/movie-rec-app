package com.app.dto;

import java.sql.Timestamp;
import java.util.Set;

public record MovieDto(String id, String fullTitle, String image,
                       Integer year, Timestamp releaseDate, Integer runtimeMins,
                       String plot, String awards, String countries, String genres,
                       String companies, String imDbRating, Integer imDbRatingVotes,
                       String metacriticRating, BoxOffice boxOffice, Set<MovieSimilarDto> similars,
                       Set<PersonDto> directorList, Set<PersonDto> writerList, Set<ActorDto> actorList) {
}
