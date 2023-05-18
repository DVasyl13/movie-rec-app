package com.app.util;

import com.app.dto.ActorDto;
import com.app.dto.MovieDto;
import com.app.dto.PersonDto;
import com.app.entity.*;

import java.util.HashSet;
import java.util.Set;

public class MovieMapper {

    public static Movie mapMovieDtoToMovie(MovieDto movieDto) {
        Movie movie = new Movie();

        movie.setImdbId(movieDto.id());
        movie.setTitle(movieDto.fullTitle());
        movie.setImage(movieDto.image());

        MovieDetails movieDetails = new MovieDetails();
        movieDetails.setYear(movieDto.year());
        movieDetails.setRuntimeMins(movieDto.runtimeMins());
        movieDetails.setPlot(movieDto.plot());
        movieDetails.setGenres(movieDto.genres());
        movieDetails.setAwards(movieDto.awards());
        movieDetails.setCountries(movieDto.countries());
        movieDetails.setCompanies(movieDto.companies());
        movieDetails.setImdbRating(movieDto.imDbRating());
        movieDetails.setImdbRatingVotes(movieDto.imDbRatingVotes());
        movieDetails.setMetacriticRating(movieDto.metacriticRating());
        movieDetails.setBudget(movieDto.boxOffice().budget());
        movieDetails.setOpUsa(movieDto.boxOffice().openingWeekendUSA());
        movieDetails.setWorldwideGross(movieDto.boxOffice().cumulativeWorldwideGross());

        Set<Director> directors = mapPersonDtoSetToDirectorSet(movieDto.directorList());
        movieDetails.setDirectors(directors);

        Set<Writer> writers = mapPersonDtoSetToWriterSet(movieDto.writerList());
        movieDetails.setWriters(writers);

        Set<Actor> actors = mapActorDtoSetToActorSet(movieDto.actorList());
        movieDetails.setActors(actors);

        movie.setMovieDetails(movieDetails);

        return movie;
    }

    private static Set<Director> mapPersonDtoSetToDirectorSet(Set<PersonDto> personDtos) {
        Set<Director> directors = new HashSet<>();
        for (PersonDto personDto : personDtos) {
            Director director = new Director();
            director.setImdbId(personDto.id());
            director.setName(personDto.name());
            directors.add(director);
        }
        return directors;
    }

    private static Set<Writer> mapPersonDtoSetToWriterSet(Set<PersonDto> personDtos) {
        Set<Writer> writers = new HashSet<>();
        for (PersonDto personDto : personDtos) {
            Writer writer = new Writer();
            writer.setImdbId(personDto.id());
            writer.setName(personDto.name());
            writers.add(writer);
        }
        return writers;
    }

    private static Set<Actor> mapActorDtoSetToActorSet(Set<ActorDto> actorDtos) {
        Set<Actor> actors = new HashSet<>();
        for (ActorDto actorDto : actorDtos) {
            Actor actor = new Actor();
            actor.setImdbId(actorDto.id());
            actor.setName(actorDto.name());
            actor.setImage(actorDto.image());
            actors.add(actor);
        }
        return actors;
    }
}
