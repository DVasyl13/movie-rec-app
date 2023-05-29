package com.app.dto;

import java.util.Set;

public record DirectorDtoWrapper(String id, String name, String image, Set<MovieSmallDto> knownFor) {
}
