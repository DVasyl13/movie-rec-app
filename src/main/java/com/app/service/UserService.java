package com.app.service;

import com.app.dto.UserFullSubmission;
import com.app.dto.UserPutDto;
import com.app.entity.Movie;
import com.app.entity.User;
import com.app.exception.MovieNotFoundException;
import com.app.exception.UserAlreadyExistException;
import com.app.exception.UserNotFoundException;
import com.app.exception.WrongPasswordException;
import com.app.repository.MovieRepository;
import com.app.repository.UserRepository;
import com.app.util.IdMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
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
            if (isEmailAlreadyInUse(userFullSubmission.email())) {
                throw new UserAlreadyExistException(userFullSubmission.email());
            }
            user.get().setEmail(userFullSubmission.email());
            countOfChangedFields++;
        }
        if (Optional.ofNullable(userFullSubmission.password()).isPresent()) {
            user.get().setPassword(passwordEncoder.encode(userFullSubmission.password()));
            countOfChangedFields++;
        }
        return countOfChangedFields;
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
}
