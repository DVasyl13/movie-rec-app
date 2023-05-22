package com.app.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String field) {
        super("Could not find user [" + field +"]");
    }
}