package com.app.exception;

public class EmptyResultFromDbCall extends RuntimeException{
    public EmptyResultFromDbCall(String s) {
        super(s);
    }
}
