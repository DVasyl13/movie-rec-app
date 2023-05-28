package com.app.dto;

import java.util.List;

public record MovieSmallDtoWrapper(List<MovieSmallDto> items, String errorMessage) {
}
