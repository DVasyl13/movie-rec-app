package com.app.service;

import com.app.dto.*;
import com.app.entity.Movie;
import com.app.entity.MovieDetails;
import com.app.exception.EmptyResponseFromApiException;
import com.app.exception.EmptyResultFromDbCall;
import com.app.repository.DirectorRepository;
import com.app.repository.GenreRepository;
import com.app.repository.MovieDetailsRepository;
import com.app.repository.MovieRepository;
import com.app.util.IdMapper;
import com.app.util.MovieMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    @Value("${api.key.1}")
    private String apiKey;

    @Value("${api.key.rapid}")
    private String apiKeyRapid;

    @PersistenceContext
    private final EntityManager entityManager;
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;
    private final DirectorRepository directorRepository;
    private final MovieDetailsRepository movieDetailsRepository;
    private final RestTemplate restTemplate;

    @Transactional
    public MovieDto getFullMovie(String imdbId) {
        Optional<Movie> movie = movieRepository.findById(IdMapper.getLongFromString(imdbId));
        if (movie.isPresent()) {
            Optional<MovieDetails> movieDetails = movieDetailsRepository.findById(IdMapper.getLongFromString(imdbId));
            return changeIdToIMDbStyle(movieDetails.get());
        }

        MovieDto movieDto = getFullMovieFromApi(imdbId);
        entityManager.merge(MovieMapper.mapMovieDtoToMovieDetails(movieDto));
        return movieDto;
    }

    private MovieDto getFullMovieFromApi(String imdbId) {
        ResponseEntity<MovieDto> response
                = restTemplate.getForEntity("https://imdb-api.com/en/API/Title/"+apiKey+"/"+imdbId+"/Trailer,", MovieDto.class);
        MovieDto movieJson = response.getBody();
        if (movieJson != null) {
            return movieJson;
        }
        throw new EmptyResponseFromApiException("ResponseEntity<MovieDto> response is empty.");
    }

    private MovieDto changeIdToIMDbStyle(MovieDetails movie) {
        return MovieMapper.mapMovieDetailsToMovieDto(movie);
    }

    public List<MovieSmallDto> getTopMoviesFroIMDb() {
        ResponseEntity<MovieSmallDtoWrapper> response
                = restTemplate.getForEntity("https://imdb-api.com/en/API/Top250Movies/"+apiKey, MovieSmallDtoWrapper.class);
        MovieSmallDtoWrapper movieWrapper = response.getBody();
        if (movieWrapper != null) {
            List<MovieSmallDto> movies = movieWrapper.items();
            Collections.shuffle(movies);
            return movies.stream().limit(18).collect(Collectors.toList());
        }
        throw new EmptyResponseFromApiException("ResponseEntity<MovieSmallDtoWrapper> response is empty.");
    }

    public List<MovieSmallDto> getMostPopularMovies() {
        ResponseEntity<MovieSmallDtoWrapper> response
                = restTemplate.getForEntity("https://imdb-api.com/en/API/MostPopularMovies/"+apiKey, MovieSmallDtoWrapper.class);
        MovieSmallDtoWrapper movieWrapper = response.getBody();
        if (movieWrapper != null) {
            List<MovieSmallDto> movies = movieWrapper.items();
            return movies.stream().limit(18).collect(Collectors.toList());
        }
        throw new EmptyResponseFromApiException("ResponseEntity<MovieSmallDtoWrapper> response is empty.");
    }

    public Set<MovieSmallDto> getUsersFavouriteMovies() {
        Set<Movie> movies = movieRepository.getFavouriteUsersMovies();
        if (movies != null) {
            return MovieMapper.mapMovieSetToMovieSmallDto(movies);
        }
        throw new EmptyResultFromDbCall("movieRepository.getFavouriteUsersMovies() returns null");
    }

    //TODO: add ignoring watched/ignored movies
    public Set<MovieSmallDto> getMoviesBasedOnDirectors(Long id) {
        var directors =  directorRepository.getDirectorByUsersLikedMovies(id);
        var topThree = directors.stream()
                .limit(3)
                .collect(Collectors.toSet());

        Set<MovieSmallDto> set = new HashSet<>();

        topThree.forEach(e -> {
            ResponseEntity<DirectorDtoWrapper> response
                    = restTemplate.getForEntity("https://imdb-api.com/en/API/Name/"+apiKey+"/"+IdMapper.getIMDbPersonId(e.idDigit()),
                    DirectorDtoWrapper.class);
            DirectorDtoWrapper movieJson = response.getBody();
            if (movieJson != null) {
                set.addAll(movieJson.knownFor());
            }
        });
        return set.stream().limit(12).collect(Collectors.toSet());
    }

    public Set<MovieSmallDto> getMoviesBasedOnGenres(Long id) {
        var genres = genreRepository.getGenresByUsersLikedMovies(id);
        var ignoredMovies = getMoviesNotToRecommend(id);
        String genresStingify = genres.stream()
                .limit(3)
                .map(GenreDto::value)
                .collect(Collectors.joining(","));

        System.out.println(genresStingify);

        String url = "https://ott-details.p.rapidapi.com/advancedsearch";
        String urlTemplate = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("start_year", "{1970}")
                .queryParam("end_year", "{2022}")
                .queryParam("genre", "{"+ genresStingify +"}")
                .queryParam("language", "{english}")
                .queryParam("type", "{movie}")
                .queryParam("sort", "{latest}")
                .queryParam("page", "{1}")
                .encode()
                .toUriString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-RapidAPI-Key", apiKeyRapid);
        headers.set("X-RapidAPI-Host", "ott-details.p.rapidapi.com");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<RapidOTTResponse> response
                = restTemplate.exchange(urlTemplate, HttpMethod.GET,entity, RapidOTTResponse.class);
        RapidOTTResponse ottResponse = response.getBody();
        System.out.println(ottResponse);
        if (ottResponse != null) {
            return ottResponse.results()
                    .stream()
                    .map(e -> new MovieSmallDto(e.imdbid(), IdMapper.getLongFromString(e.imdbid()), e.title(), e.imageurl()[0]))
                    .filter(e -> !ignoredMovies.contains(e.id()))
                    .limit(18)
                    .collect(Collectors.toSet());
        }
        throw new EmptyResponseFromApiException("RapidOTTResponse ottResponse body is null");
    }

    public Set<MovieSmallDto> getMoviesBasedOnSimilars(Long id) {
        var ignoredMovies = getMoviesNotToRecommend(id);
        var movies = movieRepository.getSimilarMovies(id);
        return movies.stream()
                .filter(e -> !ignoredMovies.contains(IdMapper.getIMDbMovieId(e.idDigit())))
                .limit(18)
                .collect(Collectors.toSet());
    }

    private Set<String> getMoviesNotToRecommend(Long id) {
        return movieRepository.getMoviesNotToRecommend(id)
                .stream()
                .map(e -> IdMapper.getIMDbMovieId(e.idDigit()))
                .collect(Collectors.toSet());
    }
}
