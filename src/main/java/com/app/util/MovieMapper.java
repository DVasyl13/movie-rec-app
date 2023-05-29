package com.app.util;

import com.app.dto.*;
import com.app.entity.*;

import java.util.Set;
import java.util.stream.Collectors;

public class MovieMapper {

    public static MovieDetails mapMovieDtoToMovieDetails(MovieDto movieDto) {
        Movie movie = new Movie();

        movie.setId(IdMapper.getLongFromString(movieDto.id()));
        movie.setTitle(movieDto.fullTitle());
        movie.setImage(movieDto.image());

        MovieDetails movieDetails = new MovieDetails();
        movieDetails.setId(IdMapper.getLongFromString(movieDto.id()));
        movieDetails.setYear(movieDto.year());
        movieDetails.setRuntimeMins(movieDto.runtimeMins());
        movieDetails.setPlot(movieDto.plot());
        movieDetails.setReleaseDate(movieDto.releaseDate());
        movieDetails.setAwards(movieDto.awards());
        movieDetails.setCountries(movieDto.countries());
        movieDetails.setCompanies(movieDto.companies());
        movieDetails.setImdbRating(movieDto.imDbRating());
        movieDetails.setImdbRatingVotes(movieDto.imDbRatingVotes());
        movieDetails.setMetacriticRating(movieDto.metacriticRating());
        movieDetails.setBudget(movieDto.boxOffice().budget());
        movieDetails.setTrailer(movieDto.trailer().link());
        movieDetails.setOpUsa(movieDto.boxOffice().openingWeekendUSA());
        movieDetails.setWorldwideGross(movieDto.boxOffice().cumulativeWorldwideGross());

        Set<SimilarMovie> similarMovies = mapMovieSimilarDtoToSimilarMovie(movieDto.similars());
        movieDetails.setMovies(similarMovies);

        Set<Director> directors = mapPersonDtoSetToDirectorSet(movieDto.directorList());
        movieDetails.setDirectors(directors);

        Set<Writer> writers = mapPersonDtoSetToWriterSet(movieDto.writerList());
        movieDetails.setWriters(writers);

        Set<Actor> actors = mapActorDtoSetToActorSet(movieDto.actorList());
        movieDetails.setActors(actors);

        Set<Genre> genres = mapGenreDtoToGenre(movieDto.genreList());
        movieDetails.setGenres(genres);

        movieDetails.setMovie(movie);
        System.out.println(movieDetails);
        return movieDetails;
    }

    private static Set<Director> mapPersonDtoSetToDirectorSet(Set<PersonDto> personDtos) {
        return personDtos.stream().map((e) -> {
            Director director = new Director();
            director.setId(IdMapper.getLongFromString(e.id()));
            director.setName(e.name());
           return director;
        }).collect(Collectors.toSet());
    }

    private static Set<PersonDto> mapDirectorSetToPersonDtoSet(Set<Director> directors) {
        return directors.stream().map((e) -> {
            return new PersonDto(IdMapper.getIMDbPersonId(e.getId()),e.getId(), e.getName());
        }).collect(Collectors.toSet());
    }

    private static Set<Writer> mapPersonDtoSetToWriterSet(Set<PersonDto> personDtos) {
        return personDtos.stream().map((e) -> {
            Writer writer = new Writer();
            writer.setId(IdMapper.getLongFromString(e.id()));
            writer.setName(e.name());
            return writer;
        }).collect(Collectors.toSet());
    }

    private static Set<PersonDto> mapWriterSetToPersonSet(Set<Writer> writers) {
        return writers.stream().map((e) -> {
            return new PersonDto(IdMapper.getIMDbPersonId(e.getId()),e.getId(), e.getName());
        }).collect(Collectors.toSet());
    }
    private static Set<Actor> mapActorDtoSetToActorSet(Set<ActorDto> actorDtos) {
        return actorDtos.stream().map((e) -> {
            Actor actor = new Actor();
            actor.setId(IdMapper.getLongFromString(e.id()));
            actor.setImage(e.image());
            actor.setName(e.name());
            return actor;
        }).collect(Collectors.toSet());
    }

    private static Set<ActorDto> mapActorSetToActorDtoSet(Set<Actor> actors) {
        return actors.stream().map((e) -> {
            return new ActorDto(IdMapper.getIMDbPersonId(e.getId()),e.getId(),e.getName(),e.getImage());
        }).collect(Collectors.toSet());
    }

    private static Set<SimilarMovie> mapMovieSimilarDtoToSimilarMovie(Set<MovieSmallDto> movieSmallDtos) {
        return movieSmallDtos.stream().map((e) -> {
            SimilarMovie movie = new SimilarMovie();
            movie.setId(IdMapper.getLongFromString(e.id()));
            movie.setImage(e.image());
            movie.setTitle(e.title());
            return movie;
        }).collect(Collectors.toSet());
    }

    private static Set<MovieSmallDto> mapSimilarMoviesToMovieSimilarDtos(Set<SimilarMovie> movies) {
        return movies.stream().map((e) -> {
            return new MovieSmallDto(IdMapper.getIMDbMovieId(e.getId()), e.getId(),e.getTitle(),
                    e.getImage());
        }).collect(Collectors.toSet());
    }

    private static Set<GenreDto> mapGenreToGenreDto(Set<Genre> genres) {
        return genres.stream().map((e) -> {
            return new GenreDto(e.getName(), e.getName());
        }).collect(Collectors.toSet());
    }

    private static Set<Genre> mapGenreDtoToGenre(Set<GenreDto> genresDtos) {
        return genresDtos.stream().map((e) -> {
            Genre genre = new Genre();
            genre.setId(e.key());
            genre.setName(e.value());
            return genre;
        }).collect(Collectors.toSet());
    }


    public static MovieDto mapMovieDetailsToMovieDto(MovieDetails movieDetails) {
        Set<MovieSmallDto> similars = mapSimilarMoviesToMovieSimilarDtos(movieDetails.getMovies());
        Set<GenreDto> genres = mapGenreToGenreDto(movieDetails.getGenres());
        Set<PersonDto> writers = mapWriterSetToPersonSet(movieDetails.getWriters());
        Set<ActorDto> actors = mapActorSetToActorDtoSet(movieDetails.getActors());
        Set<PersonDto> directors = mapDirectorSetToPersonDtoSet(movieDetails.getDirectors());
        return new MovieDto(
                IdMapper.getIMDbMovieId(movieDetails.getId()),
                movieDetails.getId(),
                movieDetails.getMovie().getTitle(),
                movieDetails.getMovie().getImage(),
                movieDetails.getYear(),
                movieDetails.getReleaseDate(),
                movieDetails.getRuntimeMins(),
                movieDetails.getPlot(),
                movieDetails.getAwards(),
                movieDetails.getCountries(),
                genres,
                movieDetails.getCompanies(),
                movieDetails.getImdbRating(),
                movieDetails.getImdbRatingVotes(),
                new TrailerDto(movieDetails.getTrailer()),
                movieDetails.getMetacriticRating(),
                new BoxOffice(movieDetails.getBudget(),
                        movieDetails.getOpUsa(),
                        movieDetails.getWorldwideGross()),
                similars
                , directors, writers, actors
        );
    }

    public static Set<MovieSmallDto> mapMovieSetToMovieSmallDto(Set<Movie> movies) {
        return movies.stream()
                .map((e) -> new MovieSmallDto(IdMapper.getIMDbMovieId(e.getId()), e.getId(), e.getTitle(), e.getImage()))
                .collect(Collectors.toSet());
    }
}
