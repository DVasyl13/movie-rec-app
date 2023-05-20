package com.app.service;

import com.app.dto.MovieDto;
import com.app.entity.Movie;
import com.app.entity.MovieDetails;
import com.app.exception.EmptyResponseFromApiException;
import com.app.repository.MovieDetailsRepository;
import com.app.repository.MovieRepository;
import com.app.util.IdMapper;
import com.app.util.MovieMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MovieService {

    @Value("${api.key.1}")
    private String apiKey;

    @PersistenceContext
    private final EntityManager entityManager;
    private final MovieRepository movieRepository;
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
        return MovieMapper.mapMovieToMovieDto(movie);
    }

}
