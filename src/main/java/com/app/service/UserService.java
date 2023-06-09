package com.app.service;

import com.app.dto.MovieDto;
import com.app.dto.PersonDto;
import com.app.dto.UserFullSubmission;
import com.app.dto.UserPutDto;
import com.app.entity.Movie;
import com.app.entity.MovieDetails;
import com.app.entity.User;
import com.app.exception.*;
import com.app.repository.DirectorRepository;
import com.app.repository.MovieDetailsRepository;
import com.app.repository.MovieRepository;
import com.app.repository.UserRepository;
import com.app.util.IdMapper;
import com.app.util.MovieMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final MovieDetailsRepository movieDetailsRepository;
    private final BCryptPasswordEncoder passwordEncoder;


    @Transactional
    public User saveUser(UserFullSubmission newUser) {
        User user = new User(newUser.username(), newUser.email(), newUser.password());

        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);

        if (isEmailAlreadyInUse(user.getEmail())) {
            throw new UserAlreadyExistException(newUser.email());
        }
        else {
            return userRepository.save(user);
        }
    }

    @Transactional
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if( user != null) {
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
            throw new WrongPasswordException(email);
        }
        throw new UserNotFoundException(email);
    }

    @Transactional
    protected boolean isEmailAlreadyInUse(String email) {
        return Optional.ofNullable(userRepository.findByEmail(email))
                .isPresent();
    }

    @Transactional
    public UserPutDto toggleUserLikedMovie(UserPutDto userDto) {
        User user = verifyUserAction(userDto);
        Movie movie = verifyIdMovieExist(userDto.movieId());
        if (user.getLikedMovies().contains(movie)) {
            user.getLikedMovies().remove(movie);
        } else {
            user.getLikedMovies().add(movie);
            removeFromIgnoredWhenLiked(user, movie);
        }
        return userDto;
    }

    @Transactional
    public UserPutDto toggleUserIgnoredMovie(UserPutDto userDto) {
        User user = verifyUserAction(userDto);
        Movie movie = verifyIdMovieExist(userDto.movieId());
        if (user.getIgnoredMovies().contains(movie)) {
            user.getIgnoredMovies().remove(movie);
        } else {
            user.getIgnoredMovies().add(movie);
            removeFromLikedWhenIgnored(user, movie);
        }
        return userDto;
    }

    @Transactional
    public UserPutDto toggleUserWatchedMovie(UserPutDto userDto) {
        User user = verifyUserAction(userDto);
        Movie movie = verifyIdMovieExist(userDto.movieId());
        if (user.getWatchedMovies().contains(movie)) {
            user.getWatchedMovies().remove(movie);
        } else {
            user.getWatchedMovies().add(movie);
        }
        return userDto;
    }

    private void removeFromLikedWhenIgnored(User user, Movie movie) {
        user.getLikedMovies().remove(movie);
    }

    private void removeFromIgnoredWhenLiked(User user, Movie movie) {
        user.getIgnoredMovies().remove(movie);
    }

    private User verifyUserAction(UserPutDto userPostDto) {
        Optional<User> user = userRepository.findById(IdMapper.getLongFromString(userPostDto.id()));
        if (user.isEmpty()) {
            throw new UserNotFoundException(userPostDto.id());
        }
        if (!passwordEncoder.matches(userPostDto.password(), user.get().getPassword())) {
            throw new WrongPasswordException(""+user.get().getId());
        }
        return user.get();
    }

    private Movie verifyIdMovieExist(String movieId) {
        Optional<Movie> movie = movieRepository.findById(IdMapper.getLongFromString(movieId));
        if (movie.isEmpty()) {
            throw new MovieNotFoundException(movieId);
        }
        return movie.get();
    }

    @Transactional(readOnly = true)
    public Set<MovieDto> getUsersLikedMovies(Long id) {
        Set<MovieDetails> movieDetails = movieDetailsRepository.findLikedMovieByUserId(id);
        if (movieDetails != null) {
            return movieDetails.stream()
                    .map(MovieMapper::mapMovieDetailsToMovieDto)
                    .collect(Collectors.toSet());
        }
        throw new EmptyResultFromDbCall("getUsersLikedMovies returns null");
    }

    @Transactional(readOnly = true)

    public Set<MovieDto> getUsersIgnoredMovies(Long id) {
        Set<MovieDetails> movieDetails = movieDetailsRepository.findIgnoredMovieByUserId(id);
        if (movieDetails != null) {
            return movieDetails.stream()
                    .map(MovieMapper::mapMovieDetailsToMovieDto)
                    .collect(Collectors.toSet());
        }
        throw new EmptyResultFromDbCall("getUsersIgnoredMovies returns null");
    }

    @Transactional(readOnly = true)
    public Set<MovieDto> getUsersWatchedMovies(Long id) {
        Set<MovieDetails> movieDetails = movieDetailsRepository.findWatchedMovieByUserId(id);
        if (movieDetails != null) {
            return movieDetails.stream()
                    .map(MovieMapper::mapMovieDetailsToMovieDto)
                    .collect(Collectors.toSet());
        }
        throw new EmptyResultFromDbCall("getUsersWatchedMovies returns null");
    }

    @Transactional(readOnly = true)
    public UserFullSubmission getUserDetails(UserFullSubmission userDto) {
        Optional<User> user = userRepository.findById(userDto.id());
        if (user.isEmpty()) {
            throw new NoSuchElementException("User was not found");
        } else if (passwordEncoder.matches(userDto.password(), user.get().getPassword())) {
            var temp = userRepository.getFullUser(userDto.id());
            return new UserFullSubmission(temp.id(), temp.username(), userDto.password(), temp.email(), temp.birthday(), temp.country(), "");
        }
        throw new WrongPasswordException(userDto.username() + " has sent a wrong password");
    }

    @Transactional
    public int putUserChanges(UserFullSubmission userFullSubmission) {
        Optional<User> user = userRepository.findById(userFullSubmission.id());
        int countOfChangedFields = 0;
        if (!passwordEncoder.matches(userFullSubmission.oldpassword(), user.get().getPassword())) {
            throw new WrongPasswordException(""+user.get().getId());
        }
        if (Optional.ofNullable(userFullSubmission.username()).isPresent()) {
            user.get().setUsername(userFullSubmission.username());
            countOfChangedFields++;
        }
        if (Optional.ofNullable(userFullSubmission.email()).isPresent()) {
            user.get().setEmail(userFullSubmission.email());
            countOfChangedFields++;
        }
        if (Optional.ofNullable(userFullSubmission.password()).isPresent()) {
            user.get().setPassword(passwordEncoder.encode(userFullSubmission.password()));
            countOfChangedFields++;
        }
        if (Optional.ofNullable(userFullSubmission.country()).isPresent()) {
            user.get().setCountry(userFullSubmission.country());
            countOfChangedFields++;
        }
        if (Optional.ofNullable(userFullSubmission.birthday()).isPresent()) {
            user.get().setBirthDay(userFullSubmission.birthday());
            countOfChangedFields++;
        }
        return countOfChangedFields;
    }
}
