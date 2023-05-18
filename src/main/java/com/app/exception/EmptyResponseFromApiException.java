package com.app.exception;

public class EmptyResponseFromApiException extends RuntimeException{
    public EmptyResponseFromApiException(String s) {
        super(s);
    }
}

