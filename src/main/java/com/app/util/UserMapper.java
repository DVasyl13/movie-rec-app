package com.app.util;

import com.app.dto.UserDto;
import com.app.entity.Movie;
import com.app.entity.User;

import java.util.stream.Collectors;

public class UserMapper {

    public static UserDto mapUserIntoUsersMovieDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getLikedMovies().stream()
                        .map(Movie::getId)
                        .map(IdMapper::getIMDbMovieId)
                        .collect(Collectors.toSet()),
                user.getIgnoredMovies().stream()
                        .map(Movie::getId)
                        .map(IdMapper::getIMDbMovieId)
                        .collect(Collectors.toSet()),
                user.getWatchedMovies().stream()
                        .map(Movie::getId)
                        .map(IdMapper::getIMDbMovieId)
                        .collect(Collectors.toSet())
        );
    }
}
