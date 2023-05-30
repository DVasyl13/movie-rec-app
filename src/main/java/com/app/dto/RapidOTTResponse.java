package com.app.dto;

import java.util.List;

public record RapidOTTResponse(Integer page, List<MovieRapidApiDto> results) {
}
