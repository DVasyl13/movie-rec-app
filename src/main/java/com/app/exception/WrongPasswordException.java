package com.app.exception;

public class WrongPasswordException extends RuntimeException{
    public WrongPasswordException(Object field){
        super("User["+field+"] has sent wrong password!");
    }
}