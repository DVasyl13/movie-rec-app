package com.app.exception;

public class UserAlreadyExistException extends RuntimeException {
    public UserAlreadyExistException(String email) {
        super("[" + email + "] is already in use");
    }
}