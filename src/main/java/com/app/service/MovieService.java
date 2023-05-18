package com.app.service;

import com.app.dto.MovieDto;
import com.app.entity.Movie;
import com.app.exception.EmptyResponseFromApiException;
import com.app.repository.MovieRepository;
import com.app.util.MovieMapper;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class MovieService {

    @Value("${api.key.1}")
    private String apiKey;

    @PersistenceContext
    private final EntityManager entityManager;
    private final MovieRepository movieRepository;
    private final RestTemplate restTemplate;

    @Transactional
    public Movie getFullMovie(String imdbId) {
        Movie movie = movieRepository.findMovieByImdbId(imdbId);
        if (movie != null) {
            return movie;
        }

        movie = getFullMovieFromApi(imdbId);
        System.out.println(movie);
        entityManager.merge(movie);
        return movie;
    }

    private Movie getFullMovieFromApi(String imdbId) {
        ResponseEntity<MovieDto> response
                = restTemplate.getForEntity("https://imdb-api.com/en/API/Title/"+apiKey+"/"+imdbId+"/Trailer,", MovieDto.class);
        MovieDto movieJson = response.getBody();
        System.out.println("from getFullMovieFromApi:");
        System.out.println(movieJson);
        System.out.println("");
        if (movieJson != null) {
            return MovieMapper.mapMovieDtoToMovie(movieJson);
        }
        throw new EmptyResponseFromApiException("ResponseEntity<MovieDto> response is empty.");
    }
}
