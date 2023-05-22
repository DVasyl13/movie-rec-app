package com.app.dto;

import java.util.Set;

public record UserDto(Long id, String username, String email,
                      Set<String> likedMovies, Set<String> ignoredMovies, Set<String> watchedMovies ) {
}
