package com.app.exception;

public class MovieNotFoundException extends RuntimeException {
    public MovieNotFoundException(String s) {
        super("Movie with id [" + s + "] is not exist");
    }
}
